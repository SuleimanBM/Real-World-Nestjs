import { FilterQuery, FindOptions, UuidType, wrap } from "@mikro-orm/core";
import { Inject, Injectable, Logger, NotFoundException, UseGuards } from "@nestjs/common";
import { ArticleDto } from "src/dtos/article.dto";
import { UpdateArticleInput } from "src/dtos/articleUpdateInput.dto"
import { Article } from "src/entities/article-entity";
import { User } from "src/entities/user-entity";
import { JwtGuard } from "src/guards/jwt.guard";
import { HttpContext } from "src/misc/context";
import { ProfileService } from "./profile.service";
import { Follows } from "src/entities/follows-entity";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";
import { ArticleInput } from "src/dtos/articleInput";
import { Favorite } from "src/entities/favourites-entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager"
import { EntityManager } from "@mikro-orm/postgresql";
import { populate } from "dotenv";


@Injectable()
export class ArticleService {
    constructor(
        private em: EntityManager,
        private profileService: ProfileService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    private readonly logger = new Logger(ArticleService.name)

    async createArticle(articleInput: ArticleInput) {
        const createArticle = articleInput.article

        createArticle.slug = createArticle.title.toLowerCase().replace(/\s+/g, '-');

        const currentUser = HttpContext.get().req.user;

        const author = await this.em.findOne(User, { id: currentUser.id })

        if (!author) throw new NotFoundException("User does not exists")

        const article = this.em.create(Article, { ...createArticle, favoritesCount: 0, author })

        await this.em.flush()
        const plainArticle = wrap(article).toObject();

        return { article: { ...plainArticle, ...author.toDto() } }
    }

    async getAllArticles(query: GetArticlesQueryDto) {
        // const cacheKey = `articles:guest:${JSON.stringify(query)}`;
        // const cached = await this.cacheManager.get(cacheKey);
        // console.log("guest logging",query)
        // if (cached) return cached;
        console.log(query)
        const { author, tag, limit, offset } = query;
        const filters: FilterQuery<Article> = {};

        const options: FindOptions<Article> = {
            limit,
            offset,
            orderBy: { createdAt: 'desc' },
        };

        if (tag != null) {
            const tagsArray = tag.split(',').map(t => t.trim());
            filters.tagList = { $contains: tagsArray };
        }
        if (author) {
            filters.author = { username: author };
        }

        let articles = await this.em.find(Article, filters, options);

        const response = {
            articles: articles.map(article => ({
                slug: article.slug,
                title: article.title,
                description: article.description,
                tagList: article.tagList,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                favorited: false,        // guests never have favorites
                favoritesCount: article.favoritesCount,
                author: article.author.toDto(),
            })),
            articlesCount: articles.length
        };

        //await this.cacheManager.set(cacheKey, response);
        return response;
    }

    async getFeedArticles(limit: number, offset: number) {
        const options: FindOptions<Article> = {
            limit: limit ?? 20,
            offset: offset ?? 0,
            orderBy: { createdAt: 'desc' },
        };
        const currentUser = HttpContext.get().req.user;

        const followedAuthors = await this.em.find(Follows, { followerId: currentUser.id })

        const followedAuthorsIds = followedAuthors.map(f => f.followedId)

        const feeds = await this.em.find(Article, { author: { id: { $in: followedAuthorsIds.map(id => id.toString()) } } },
            { ...options, populate: ["author"] })

        return {
            articles: feeds, articlesCount: feeds.length,
        }
    }

    async getAnArticle(slug: string) {
        const article = await this.em.findOne(Article, { slug })
        if (!article) throw new NotFoundException("Article does not exist")

        const profile = await this.profileService.fetchProfile(article.author.username)

        const plainArticle = wrap(article).toObject()
        return { article: { ...plainArticle, author: profile?.profile } }
    }

    async updateArticle(slug: string, updateArticleInput: UpdateArticleInput) {

        const updateArticleDto = updateArticleInput.article

        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { author: currentUser.id, slug })

        if (!article) throw new NotFoundException("Article does not exist")

        const updatedArticle = this.em.assign(article, updateArticleDto)

        await this.em.flush()

        return { article: updatedArticle }
    }

    async deleteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { author: currentUser.id, slug })

        if (!article) throw new NotFoundException("Article does not exist")

        await this.em.remove(article).flush()
    }

    async favoriteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const favoritedArticle = await this.em.transactional(async (em) => {
            const article = await em.findOne(Article, { slug });

            if (!article) throw new NotFoundException();

            let favorite = await em.findOne(Favorite, { user: currentUser.id });

            if (!favorite) {
                favorite = em.create(Favorite, {
                    user: currentUser.id,
                    favoriteArticles: [article.id],
                });
                article.favoritesCount++;
            } else {
                if (!favorite.favoriteArticles?.includes(article.id)) {
                    favorite.favoriteArticles = [...favorite.favoriteArticles ?? [], article.id];
                    article.favoritesCount++;
                }
            }

            return article;
        });
        favoritedArticle.favorited = true
        return { article: favoritedArticle }
    }

    async unFavoriteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const unfavoriteArticle = await this.em.transactional(async (em) => {
            const article = await em.findOne(Article, { slug })

            if (!article) throw new NotFoundException()

            let favorite = await em.findOne(Favorite, { user: currentUser.id });

            if (favorite && favorite.favoriteArticles?.includes(article.id)) {
                favorite.favoriteArticles = favorite.favoriteArticles.filter(id => id !== article.id);
                article.favoritesCount--
                await this.em.flush()
            }
            return article
        })

        unfavoriteArticle.favorited = false

        return { article: unfavoriteArticle }
    }

    async fetchTags() {
        let tags
        //await this.cacheManager.clear()
        tags = await this.cacheManager.get('alltags')

        if (tags) {
            this.logger.log("Returning response from cache")
            return { tags: tags }
        }

        const articles = await this.em.findAll(Article)

        tags = articles.map(article => article.tagList)

        // await this.cacheManager.set("alltags", tags)
        return { tags: tags.flat() }
    }
}
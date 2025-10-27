import { EntityManager, FilterQuery, FindOptions, UuidType, wrap } from "@mikro-orm/core";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { ArticleDto, UpdateArticleInput } from "src/dtos/article.dto";
import { Article } from "src/entities/article-entity";
import { User } from "src/entities/user-entity";
import { JwtGuard } from "src/guards/jwt.guard";
import { HttpContext } from "src/misc/context";
import { ProfileService } from "./profile.service";
import { Follows } from "src/entities/follows-entity";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";
import { ArticleInput } from "src/dtos/articleInput";
import { ApiNoContentResponse } from "@nestjs/swagger";
import { Favorite } from "src/entities/favourites-entity";


@Injectable()
export class ArticleService {
    constructor(
        private em: EntityManager,
        private profileService: ProfileService
    ) { }

    async createArticle(articleInput: ArticleInput) {
        const createArticle = articleInput.article
        console.log("Logging incoming create article body ", createArticle)
        createArticle.slug = createArticle.title.toLowerCase().replace(/\s+/g, '-');

        const currentUser = HttpContext.get().req.user;

        const author = await this.em.findOne(User, { id: currentUser.id })
        
        if (!author) throw new NotFoundException("User does not exists")
        
        const article = this.em.create(Article, { ...createArticle, author})
        
        await this.em.flush()
        const plainArticle = wrap(article).toObject();

        return {article: {...plainArticle, ...author.toDto()}}
    }

    async getAllArticles(query: GetArticlesQueryDto) {
        const { author, tag, favorited, limit, offset } = query;
        const filters: FilterQuery<Article> = {};

        const options: FindOptions<Article> = {
            limit: limit,
            offset: offset,
            orderBy: { createdAt: 'desc' },
            
        };

        // if (author != null) {
        //     filters.author = author;
        // }

        if (tag != null) {
            const tagsArray: string[] = tag.split(',').map(t => t.trim())
            filters.tagList = { $contains: tagsArray };
        }

        if (favorited != null) {
            filters.favorited = favorited;
        }

        let articles = await this.em.find(Article, filters, {
            ...options,
            populate: ['author'] as any,
        })

        if (author != null) {
            articles = articles.filter(article => article.author.username === author)
        }
        return {articles: articles.map(article => ({
            slug: article.slug,
            title: article.title,
            description: article.description,
            tagList: article.tagList,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favorited,
            favoritesCount: article.favoritesCount,
            author: article.author.toDto(),
        })),
        articlesCount: articles.length,
        }
    }

    async getFeedArticles(limit: number, offset: number) {
        const options: FindOptions<Article> = {
            limit: limit,
            offset: offset,
            orderBy: { createdAt: 'desc' },
        };
        const currentUser = HttpContext.get().req.user;

        const isFollowing = await this.em.find(Follows, { followerId: currentUser.id as unknown as UuidType })
        
        const followedAuthors = isFollowing.map(f => f.followedId)

        const feeds = await this.em.find(Article, { author: { id: { $in: followedAuthors.map(id => id.toString()) } } },
            { ...options, populate: ["author"] })

        return {
            articles: feeds, articlesCount: feeds.length,}
    }

    async getAnArticle(slug: string) {
        //console.log("Logging slug value ", slug)
        const article = await this.em.findOne(Article, { slug }, {populate: ["author"] as any})
        if (!article) throw new NotFoundException("Article does not exist")
        console.log("Logging article of single article", article)
        const profile = await this.profileService.fetchProfile(article.author.username)
        console.log("Logging profile of article author", profile)
        const plainArticle = wrap(article).toObject()

        return { article: { ...plainArticle, author: profile?.profile } }
    }

    async updateArticle(slug: string, updateArticleInput: UpdateArticleInput) {
        const updateArticleDto = updateArticleInput.article
        const currentUser = HttpContext.get().req.user;
        console.log("Logging article to update body", updateArticleDto)

        const article = await this.em.findOne(Article, {author: currentUser.id, slug})

        if (!article) throw new NotFoundException("Article does not exist")
        
        const updatedArticle = this.em.assign(article, updateArticleDto )
        await this.em.flush()

        return { article: updatedArticle}
    }

    async deleteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, {author: currentUser.id, slug })

        if (!article) throw new NotFoundException("Article does not exist")

        await this.em.remove(article).flush()
    }

    async favoriteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { slug }, { populate: ["author"] as any })

        if (!article) throw new NotFoundException()
        
        if (currentUser.id == article?.author.id) {
            article.favoritesCount? article.favoritesCount++ : article.favoritesCount;
            article.favorited = true;
            await this.em.flush();
        }

        article.favoritesCount ? article.favoritesCount++ : article.favoritesCount;
        let favorite = await this.em.findOne(Favorite, { user: currentUser.id as unknown as UuidType });

        if (!favorite) {
            favorite = this.em.create(Favorite, {
                user: currentUser.id as unknown as UuidType,
                favoriteArticles: [article.id],
            });
        } else {
            // merge with existing ones
            favorite.favoriteArticles?.push(article.id) 
        }
        return { article: article}
    }
    async fetchTags() {
        const articles = await this.em.findAll(Article)
        console.log("Logging articles from ", articles)

        const tags = articles.map(article => article.tagList)
        console.log("Logging tags from ",tags)
        return {tags: tags.flat()}
    }
}
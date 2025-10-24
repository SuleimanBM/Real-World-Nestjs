import { EntityManager, FilterQuery, FindOptions, UuidType } from "@mikro-orm/core";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { ArticleDto, UpdateArticleDto } from "src/dtos/article.dto";
import { Article } from "src/entities/article-entity";
import { User } from "src/entities/user-entity";
import { JwtGuard } from "src/guards/jwt.guard";
import { HttpContext } from "src/misc/context";
import { ProfileService } from "./profile.service";
import { Follows } from "src/entities/follows-entity";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";


@Injectable()
export class ArticleService {
    constructor(
        private em: EntityManager,
        private profileService: ProfileService
    ) { }

    async createArticle(createArticle: ArticleDto) {
        const currentUser = HttpContext.get().req.user;

        const author = await this.em.findOne(User, { id: currentUser.id })
        
        if (!author) throw new NotFoundException("User does not exists")
        
        const article = this.em.create(Article, { ...createArticle, author })
        
        await this.em.flush()

        return article
    }

    async getAllArticles(query: GetArticlesQueryDto) {
        const { author, tag, favorited, limit, offset } = query;
        const filters: FilterQuery<Article> = {};

        const options: FindOptions<Article> = {
            limit: limit,
            offset: offset,
            orderBy: { createdAt: 'desc' },
        };

        if (author != null) {
            filters.author = author;
        }

        if (tag != null) {
            const tagsArray: string[] = tag.split(',').map(t => t.trim())
            filters.tagList = { $contains: tagsArray };
        }

        if (favorited != null) {
            filters.favorited = favorited;
        }

        const articles = await this.em.find(Article, filters , options)

        return articles
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

        const feeds = await this.em.find(Article, {author: {$in: followedAuthors.map(id => id.toString()) }}, options)

        return feeds
    }

    async getAnArticle(slug: string) {

        const articles = await this.em.findOne(Article, {slug})

        return articles
    }

    async updateArticle(slug: string, updateArticle: UpdateArticleDto) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, {author: currentUser.id, slug})

        if (!article) throw new NotFoundException("Article does not exist")
        
        const updatedArticle = this.em.assign(article, updateArticle )

        await this.em.flush()

        return updatedArticle
    }

    async deleteArticle(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, {author: currentUser.id, slug })

        if (!article) throw new NotFoundException("Article does not exist")

        const deletedArticle = this.em.remove(article).flush()

        return deletedArticle
    }
}
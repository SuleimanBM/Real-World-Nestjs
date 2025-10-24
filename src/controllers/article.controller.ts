import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ArticleDto, UpdateArticleDto } from "src/dtos/article.dto";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";
import { JwtGuard } from "src/guards/jwt.guard";
import { ArticleService } from "src/services/article.service";


@Controller("articles")
@UseGuards(JwtGuard)
export class ArticleController{
    constructor(private articleService: ArticleService) { }

    @Get()
    articles(@Query() query: GetArticlesQueryDto) {
        return this.articleService.getAllArticles(query)
    }

    @Get("feed")
    feedArticles(@Query('limit') limit: number, @Query("offset") offset: number) {
       return this.articleService.getFeedArticles(limit, offset)
    }

    @Get(":slug")
    article(@Param("slug") slug: string) {
        return this.articleService.getAnArticle(slug)
    }

    @Post()
    postArticles(@Body() articleDto: ArticleDto) {
        return this.articleService.createArticle(articleDto)
    }

    @Put(":slug")
    updateArticle(@Param("slug") slug: string, @Body() articleDto: UpdateArticleDto) {
        return this.articleService.updateArticle(slug, articleDto)
    }

    @Delete(":slug")
    deleteArticle(@Param("slug") slug: string) {
        return this.articleService.deleteArticle(slug)
    }

    @Post(":slug/comments")
    addComment() {
        return "getting all articles"
    }

    @Get()
    getComments() {
        return "getting all articles"
    }

    @Delete()
    deleteComment() {
        return "getting all articles"
    }

}
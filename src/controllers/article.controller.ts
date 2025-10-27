import { Body, Controller, Delete, Get, HttpCode, Injectable, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ArticleDto, UpdateArticleInput } from "src/dtos/article.dto";
import { ArticleInput } from "src/dtos/articleInput";
import { CommentInput } from "src/dtos/comment.dto";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";
import { JwtGuard } from "src/guards/jwt.guard";
import { ArticleService } from "src/services/article.service";
import { CommentService } from "src/services/comment.service";


@Controller("articles")
export class ArticleController {
    constructor(private articleService: ArticleService, private commentService: CommentService) { }

    @UseGuards(JwtGuard)
    @Get()
    articles(@Query() query: GetArticlesQueryDto) {
        return this.articleService.getAllArticles(query)
    }

    @UseGuards(JwtGuard)
    @Get("feed")
    feedArticles(@Query('limit') limit: number, @Query("offset") offset: number) {
        return this.articleService.getFeedArticles(limit, offset)
    }

    @Get("tags")
    tags() {
        console.log("request at tags")
        //return "This is tags route"
        return this.articleService.fetchTags()
    }

    @UseGuards(JwtGuard)
    @Get(":slug")
    article(@Param("slug") slug: string) {
        return this.articleService.getAnArticle(slug)
    }

    @UseGuards(JwtGuard)
    @Post()
    postArticles(@Body() articleInput: ArticleInput) {
        //console.log("post article route has been hit with data", articleInput)
        return this.articleService.createArticle(articleInput)
    }

    @UseGuards(JwtGuard)
    @Put(":slug")
    updateArticle(@Param("slug") slug: string, @Body() articleDto: UpdateArticleInput) {
        return this.articleService.updateArticle(slug, articleDto)
    }

    @UseGuards(JwtGuard)
    @Delete(":slug")
    @HttpCode(204)
    deleteArticle(@Param("slug") slug: string) {
        return this.articleService.deleteArticle(slug)
    }

    @UseGuards(JwtGuard)
    @Post(":slug/comments")
    addComment(@Param('slug') slug: string, @Body() commentInput: CommentInput) {
        return this.commentService.addComment(slug, commentInput)
    }

    @UseGuards(JwtGuard)
    @Get(":slug/comments")
    getComment(@Param('slug') slug: string) {
        return this.commentService.fetchComments(slug);
    }

    @UseGuards(JwtGuard)
    @Delete(":slug/:commentId/:id")
    //@HttpCode(200)
    deleteComment(@Param('slug') slug: string, @Param('id') commentId: string) {
        return this.commentService.deleteComment(slug, commentId);
    }
    
    @UseGuards(JwtGuard)
    @Post(":slug/favorite")
    favoriteArticle(@Param('slug') slug: string,) {
        return this.articleService.favoriteArticle(slug)
    }


}
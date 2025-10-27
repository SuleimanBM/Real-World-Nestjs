import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommentDto, CommentInput } from "src/dtos/comment.dto";
import { GetArticlesQueryDto } from "src/dtos/getArticlesQuery.dto";
import { JwtGuard } from "src/guards/jwt.guard";
import { ArticleService } from "src/services/article.service";
import { CommentService } from "src/services/comment.service";


@Controller("comments")
@UseGuards(JwtGuard)
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Post(":slug")
    createComment(@Param('slug') slug: string, @Body() commentDto: CommentInput) {
        return this.commentService.addComment(slug, commentDto);
    }

    @Get(":slug")
    getComment(@Param('slug') slug: string) {
        return this.commentService.fetchComments(slug );
    }

    @Delete(":slug/:commentId")
    deleteComment(@Param('slug') slug: string, @Param('commentId') commentId: string) {
        return this.commentService.deleteComment(slug, commentId);
    }

}

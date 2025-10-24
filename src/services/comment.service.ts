import { EntityManager } from "@mikro-orm/core";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentDto } from "src/dtos/comment.dto";
import { Article } from "src/entities/article-entity";
import { Comment } from "src/entities/comments-entity";
import { User } from "src/entities/user-entity";
import { HttpContext } from "src/misc/context";


@Injectable()
export class CommentService {
    constructor(
        private em: EntityManager,
    ) { }

    async createComment(slug: string, commentDto: CommentDto) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, {slug})
        
        if (!article) throw new NotFoundException("User does not exists")
        
        const comment = this.em.create(Comment, { ...commentDto, article: article.id, author: currentUser.id })
        
        await this.em.flush()

        return comment.toDto()
    }

    async fetchComments(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { slug })

        if (!article) throw new NotFoundException("User does not exists")

        const allComments = await this.em.find(Comment, {article: article.id })

        const comments = allComments.map(c => c.toDto() )

        return comments
    }
    async deleteComment(slug: string, commentId: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { slug })

        if (!article) throw new NotFoundException("User does not exists")

        const comment = await this.em.findOne(Comment, {id: commentId, author: currentUser.id, article: article.id })

        if (!comment) throw new NotFoundException("Comment does not exist")
        
        this.em.remove(comment).flush()

    }

}
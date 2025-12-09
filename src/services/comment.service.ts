import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CommentDto, CommentInput } from "src/dtos/comment.dto";
import { Article } from "src/entities/article-entity";
import { Comment } from "src/entities/comments-entity";
import { User } from "src/entities/user-entity";
import { HttpContext } from "src/misc/context";
import { ProfileService } from "./profile.service";


@Injectable()
export class CommentService {
    constructor(
        private em: EntityManager,
        private profileService: ProfileService
    ) { }
        private readonly logger = new Logger(CommentService.name)
    

    async addComment(slug: string, commentInput: CommentInput) {
        const commentDto = commentInput.comment

        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, {slug}, {populate: ["author"] as any})
        
        if (!article) throw new NotFoundException("Article does not exists")
        
        const profile = await this.profileService.fetchProfile(article.author.username)

        const comment = await this.em.create(Comment, { ...commentDto, article: article.id, author: currentUser.id },)
        
        await this.em.flush()

        return { comment: { ...comment.toDto(), author: profile?.profile } }
    }

    async fetchComments(slug: string) {
        const currentUser = HttpContext.get().req.user;

        const article = await this.em.findOne(Article, { slug })

        if (!article) throw new NotFoundException("User does not exists")

        const allComments = await this.em.find(Comment, {article}, {populate: ["author"] as any})

        const comments = allComments.map(c => c.toDto() )

        return { comments }
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
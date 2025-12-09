import { TestContext } from "test/TestContext"
import { faker } from '../faker'
import { UserFactory } from "test/factories/user.factory"
import { mockAuthUser, setupHttpContextMock } from "test/test-helper"
import { ArticleService } from "src/services/article.service"
import { ArticleInput } from "src/dtos/articleInput"
import { Article } from "src/entities/article-entity"
import { ProfileService } from "src/services/profile.service"
import { CacheModule } from "@nestjs/cache-manager"
import { EntityManager, ref } from "@mikro-orm/core"
import { createEmFork } from "../TestContext"
import { ArticleFactory } from "test/factories/article.factory"
import { CommentService } from "src/services/comment.service"
import { CommentInput } from "src/dtos/comment.dto"
import { CommentFactory } from "test/factories/comment.factory"

describe("Comments test suits", () => {
    let commentService: CommentService
    let input: CommentInput

    beforeEach(async () => {
        const modulesRef = await TestContext.createModule({
            imports: [],
            providers: [ProfileService, CommentService],
        }).compile()

        commentService = modulesRef.get(CommentService)
        input = {
            comment: {
                body: faker.word.words({ count: { min: 5, max: 20 } }),
            }
        }

    })

    it("Add comment to an article", async () => {
        const createUser = await TestContext.getFactory(UserFactory).createOne()

        mockAuthUser({ id: createUser.id, username: createUser.username })

        setupHttpContextMock(createUser)

        const article = await TestContext.getFactory(ArticleFactory).createOne({ author: createUser.id })

        const comment = await commentService.addComment(article.slug!, input)

        expect(comment.comment.body).toEqual(input.comment.body)
    })

    it("Fetch all comments for an article", async () => {
        const createUser = await TestContext.getFactory(UserFactory).createOne()

        mockAuthUser({ id: createUser.id, username: createUser.username })

        setupHttpContextMock(createUser)

        const article = await TestContext.getFactory(ArticleFactory).createOne({ author: createUser })
        await TestContext.getFactory(CommentFactory).create(3, {article, author: createUser})
    
        const fetchedComment = await commentService.fetchComments(article.slug!)
        
        expect(fetchedComment.comments).toHaveLength(3)

        fetchedComment.comments.forEach((comment) => {expect(comment.article.id).toEqual(article.id)})
    })

    it("Deletes a comment", async () => {
        const createUser = await TestContext.getFactory(UserFactory).createOne()

        mockAuthUser({ id: createUser.id, username: createUser.username })

        setupHttpContextMock(createUser)

        const article = await TestContext.getFactory(ArticleFactory).createOne({ author: createUser.id })

        const comment = await commentService.addComment(article.slug!, input)

        const deletedComment = await commentService.deleteComment(article.slug!, comment.comment.id)

        expect(deletedComment).toBeUndefined()
    })
})
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "src/guards/jwt.guard";
import { ArticleService } from "src/services/article.service";


@Controller("tags")
@ApiBearerAuth()
export class TagsController {
    constructor(private articleService: ArticleService) { }

    @Get()
    tags() {
        return this.articleService.fetchTags()
    }

}
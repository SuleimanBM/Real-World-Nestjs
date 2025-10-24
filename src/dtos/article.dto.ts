import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ArticleDto{

    @IsOptional()
    slug: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    body: string;

    @IsOptional()
    tagList: string[];

    @IsOptional()
    favorited: boolean;

    @IsOptional()
    @IsNumber()
    favoritesCount: number;
}

export class UpdateArticleDto extends PartialType(ArticleDto){}
import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ArticleDto {
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

}

export class ArticleInput{
    article: ArticleDto;
}
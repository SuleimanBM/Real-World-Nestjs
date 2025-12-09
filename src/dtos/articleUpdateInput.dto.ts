import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class Dto{

    @IsOptional()
    slug?: string;

    @IsNotEmpty()
    title?: string;

    @IsNotEmpty()
    description?: string;

    @IsNotEmpty()
    body?: string;

    @IsOptional()
    tagList?: string[];

    @IsOptional()
    favorited?: boolean;
}

export class UpdateArticleInput {
    article: Dto;
}
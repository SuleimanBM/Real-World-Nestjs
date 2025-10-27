import { UuidType } from "@mikro-orm/core";
import { IsOptional } from "class-validator";

export class CommentDto {
    @IsOptional()
    body: string;

    
}

export class CommentInput {
    comment: CommentDto;
}
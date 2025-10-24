import { Type } from "class-transformer"

export class GetArticlesQueryDto {
    author?: string;

    tag?: string;

    @Type(() => Boolean)
    favorited?: boolean;

    @Type(() => Number) 
    limit?: number;

    @Type(() => Number) 
    offset?: number;
}

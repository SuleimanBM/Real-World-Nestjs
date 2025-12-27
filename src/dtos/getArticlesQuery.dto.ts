import { Type } from 'class-transformer';

export class GetArticlesQueryDto {
  author?: string;

  tag?: string;

  favorited?: string;

  @Type(() => Number)
  limit?: number;

  @Type(() => Number)
  offset?: number;
}

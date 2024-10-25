import { IsArray, IsOptional } from 'class-validator';

export class filterArticleDto {
  @IsArray()
  readonly categories: string[];
  @IsOptional()
  readonly data: string;
  @IsArray()
  readonly authors: string[];
}

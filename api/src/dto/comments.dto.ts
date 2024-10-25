import { IsString } from 'class-validator';

export class CommentsDto {
  @IsString()
  readonly author: string;
  @IsString()
  readonly emailAuthor: string;
  @IsString()
  readonly text: string;
  @IsString()
  readonly idArticle: string;
}

//import { IsEmail } from 'class-validator';

export class ArticleDto {
  readonly backgroundImage: string;

  readonly title: string;

  readonly titleFont: string;

  readonly article: string;

  readonly textFont: string;

  readonly category: string;

  readonly status: string;

  readonly createdBy: string;
  readonly author: object;
}

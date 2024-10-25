import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { articleEditDto } from '../dto/edit_article';
import { AuthGuard } from '../auth/auth.guard';
import { Article } from 'src/schemas/articles.schema';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  addArticle(@Request() req) {
    return this.articleService.add_new_article(req.body);
  }

  @Get('all')
  getArticles(): Promise<Article[]> {
    return this.articleService.get_all_articles();
  }

  @UseGuards(AuthGuard)
  @Post('/edit')
  editArticle(@Body() dataEditDto: articleEditDto) {
    return this.articleService.edit_article(dataEditDto);
  }

  @Get('/categories')
  getCategories() {
    return this.articleService.all_categories();
  }

  @Get('/authors')
  getAuthors() {
    return this.articleService.all_authors();
  }

  @Get('/reading/:id')
  getArticle(@Param('id') id: string) {
    return this.articleService.get_article(id);
  }

  @UseGuards(AuthGuard)
  @Post('/my_articles')
  getMyArticles(@Request() req) {
    return this.articleService.get_my_articles(req.body.email);
  }

  @UseGuards(AuthGuard)
  @Post('remove')
  deleteArticle(@Request() req) {
    return this.articleService.remove_article(req.body);
  }

  @Get('last-added')
  threeLastAdded() {
    return this.articleService.last_added();
  }

  @Post('add-view')
  async views(@Request() req) {
    return this.articleService.add_views(req.body.id);
  }

  @Post('filter')
  async filteringArticles(@Request() req) {
    return this.articleService.filter_articles(req.body);
  }

  @Get('search')
  async searchArticles(@Query('q') query: string) {
    return this.articleService.searchArticle(query);
  }
}

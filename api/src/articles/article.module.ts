import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, articleSchema } from '../schemas/articles.schema';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: articleSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [ArticleController],
  exports: [ArticleService],
  providers: [ArticleService],
})
export class ArticleModule {}

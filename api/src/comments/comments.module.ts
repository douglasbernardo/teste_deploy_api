import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, commentsSchema } from 'src/schemas/comments.schema';
import { ArticleModule } from 'src/articles/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: commentsSchema,
      },
    ]),
    ArticleModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

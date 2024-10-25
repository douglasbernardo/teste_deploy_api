import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, likeSchema } from 'src/schemas/like.schema';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { ArticleModule } from 'src/articles/article.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: likeSchema,
      },
    ]),
    forwardRef(() => UserModule),
    ArticleModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}

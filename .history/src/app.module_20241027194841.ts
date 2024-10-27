import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './articles/article.module';
import { uploadModule } from './upload/upload.module';
import { LikeModule } from './likes/like.module';
import { CommentsModule } from './comments/comments.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ArticleModule),
    forwardRef(() => uploadModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [AppController],
})
export class AppModule {}

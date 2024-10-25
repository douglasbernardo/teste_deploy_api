import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { ArticleModule } from '../articles/article.module';
import { LikeModule } from 'src/likes/like.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    forwardRef(() => ArticleModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}

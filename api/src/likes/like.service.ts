import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleService } from 'src/articles/article.service';
import { Like } from 'src/schemas/like.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private like: Model<Like>,
    private articleService: ArticleService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async iLiked(data) {
    try {
      const user_id = await this.userService.find_id_user_by_email(data.user);
      const existingLike = await this.like.findOne({
        user: user_id,
        article: data.article,
      });
      if (existingLike) {
        throw new UnauthorizedException('Artigo já foi curtido por você');
      }
      const newLike = await this.like.create({
        user: user_id,
        article: data.article,
      });
      await this.articleService.increment_article_like(data.article); //passing as parameter the article id

      return newLike;
    } catch (error) {
      console.error('Erro ao curtir o artigo:', error);
      throw error;
    }
  }

  async my_likes(id) {
    try {
      if (!id) {
        throw new UnauthorizedException('ID inexistente');
      }
      return await this.like.find({ user: id }).exec();
    } catch (error) {
      throw new UnauthorizedException('Falha ao contar likes', error);
    }
  }
}

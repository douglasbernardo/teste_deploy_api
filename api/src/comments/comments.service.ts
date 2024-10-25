import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleService } from 'src/articles/article.service';
import { CommentsDto } from 'src/dto/comments.dto';
import { Comments } from 'src/schemas/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private comment: Model<Comments>,
    private articleService: ArticleService,
  ) {}

  async createComment(data: CommentsDto) {
    if (!data) {
      throw new UnauthorizedException('Falha ao comentar');
    }
    if (
      await this.check_max_comments_per_interaction(
        data.emailAuthor,
        data.idArticle,
      )
    ) {
      throw new UnauthorizedException(
        'Você só póde comentar uma vez no mesmo artigo',
      );
    }
    const add_comment = new this.comment({
      author: data.author,
      emailAuthor: data.emailAuthor,
      text: data.text,
      idArticle: data.idArticle,
    });
    await this.articleService.increment_article_comment(data.idArticle);
    return add_comment.save();
  }

  async check_max_comments_per_interaction(
    emailAuthor: string,
    idArticle: string,
  ) {
    return await this.comment
      .findOne({
        emailAuthor: emailAuthor,
        idArticle: idArticle,
      })
      .exec();
  }

  async delete_my_comment(data): Promise<any> {
    return await this.comment.deleteOne({
      idArticle: data.idArticle,
      emailAuthor: data.user,
    });
  }

  async get_all_comments(id: string): Promise<Comments[]> {
    try {
      const commentsWithUserDetails = await this.comment
        .aggregate([
          // Filtrar os comentários pelo id do artigo
          { $match: { idArticle: id } },
          // Realizar um lookup para obter os detalhes do usuário
          {
            $lookup: {
              from: 'users', // Nome da coleção de usuários
              localField: 'emailAuthor',
              foreignField: 'email',
              as: 'authorDetails',
            },
          },
          // Desconstruir o array de resultados do lookup
          { $unwind: '$authorDetails' },
          // Projetar os campos desejados
          {
            $project: {
              _id: 0, // Omitir o _id se não for necessário
              text: 1, // Manter o texto do comentário
              createdAt: 1,
              authorName: '$authorDetails.name', // Pegar o nome do usuário
              authorEmail: '$authorDetails.email',
              authorImage: '$authorDetails.urlImage', // Pegar a URL da imagem do usuário
            },
          },
        ])
        .exec();
      return commentsWithUserDetails;
    } catch (error) {
      console.error('Erro ao obter comentários:', error);
      throw error;
    }
  }

  async get_all_my_comments(email: string) {
    try {
      const my_comments = await this.comment
        .find({ emailAuthor: email })
        .exec();
      return my_comments;
    } catch (error) {
      console.log(error);
    }
  }

  async edit_comment(data) {
    return await this.comment.updateOne(
      { emailAuthor: data.user },
      { $set: { text: data.text } },
    );
  }
}

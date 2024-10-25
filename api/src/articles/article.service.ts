import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from '../schemas/articles.schema';
import { UserService } from '../user/user.service';
import { Model } from 'mongoose';
import { articleEditDto } from '../dto/edit_article';
import {
  AddArticleInterface,
  DeleteArticleInterface,
} from '../interfaces/article.interface';
import { filterArticleDto } from 'src/dto/filterArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private article: Model<Article>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async add_new_article(data: AddArticleInterface): Promise<Article> {
    return new this.article({
      backgroundImage: data.backgroundImage,
      title: data.title,
      titleFont: data.titleFont,
      article: data.article,
      textFont: data.textFont,
      category: data.category,
      status: data.status,
      createdBy: await this.userService.find_id_user_by_email(data.createdBy),
    }).save();
  }

  async get_all_articles(): Promise<Article[] | any> {
    return Promise.all(
      (await this.article.find()).map(async (article) => {
        //mapeia todos os artigos, depois procura no banco do usuario o id createdBy
        const author = await this.userService.find_article_author(
          article.createdBy,
        );
        return {
          ...article.toObject(),
          author,
        };
      }),
    );
    // a função deve mostrar todos os artigos, contendo neles o id e o nome do autor(criador) deste artigo
  }

  async get_articles_by_id(id: string): Promise<Article[]> {
    return await this.article.find({ _id: id }).exec();
  }

  async get_my_articles(email: string) {
    const user = await this.userService.find_id_user_by_email(email);
    if (!user) return [];
    return await this.article.find({ createdBy: user }).exec();
  }

  async get_article(id: string): Promise<Article> {
    const articleDoc = await this.article.findOne({ _id: id }).exec();
    return articleDoc ? (articleDoc.toObject() as Article) : null;
  }

  async edit_article(article: articleEditDto): Promise<Article> {
    const edit_article = await this.article.findById(article.id);
    const updated_fields = {
      backgroundImage: article.backgroundImage || edit_article.backgroundImage,
      title: article.title || edit_article.title,
      titleFont: article.titleFont || edit_article.titleFont,
      article: article.article || edit_article.article,
      textFont: article.textFont || edit_article.textFont,
      category: article.category || edit_article.category,
      status: article.status || edit_article.status,
    };
    Object.assign(edit_article, updated_fields);
    return await edit_article.save();
  }
  all_categories() {
    return this.article.distinct('category').exec();
  }

  async all_authors(): Promise<any> {
    const ids = await this.article.distinct('createdBy');
    const users = this.userService.getUsersByIds(ids);
    return users;
  }
  async remove_article(data: DeleteArticleInterface) {
    const [emailExists, deletedArticle] = await Promise.all([
      this.userService.verify_existing_email(data.email),
      this.article.findOneAndDelete({ _id: data.id }),
    ]);
    if (!emailExists && !deletedArticle) {
      throw new UnauthorizedException('Aconteceu uma falha ao deletar artigo!');
    }
    return deletedArticle;
  }

  async filter_articles(filters: filterArticleDto) {
    if (!filters) return [];
    const currentDate = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Definindo a data inicial e final com base no filtro
    if (filters.data === 'Mês Passado') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 30);
    } else if (filters.data === 'Semana Passada') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
    } else if (filters.data === 'Ano Passado') {
      const lastYear = currentDate.getFullYear() - 1;
      startDate = new Date(`${lastYear}-01-01T00:00:00Z`);
      endDate = new Date(`${lastYear}-12-31T23:59:59Z`);
    }

    // Ajustando a data para começar à meia-noite, se necessário
    if (startDate) startDate.setUTCHours(0, 0, 0, 0);

    // Criação da etapa de $match para a agregação
    const matchStage: any = {};

    // Aplicando o filtro de categorias, caso existam
    if (filters.categories && filters.categories.length > 0) {
      matchStage.category = { $in: filters.categories };
    }

    // Aplicando o filtro de data, caso tenha sido fornecido
    if (startDate) {
      if (endDate) {
        matchStage.createdAt = { $gte: startDate, $lte: endDate }; // Intervalo de datas
      } else {
        matchStage.createdAt = { $gte: startDate }; // Apenas a data inicial
      }
    }

    //Filtro por Autor

    if (filters.authors) {
      const users = await this.userService.getUsersByNamesFilter(
        filters.authors,
      );
      const ids = users.map((author) => author._id.toString());
      if (ids.length > 0) {
        matchStage.createdBy = { $in: ids };
        console.log(matchStage.createdBy);
      }
    }

    // Realizando a agregação com os filtros
    const optionsFilter = await this.article
      .aggregate([
        {
          $match: matchStage,
        },
      ])
      .exec();
    // Verificando se encontrou resultados
    if (!optionsFilter.length) {
      return {
        message: 'Nenhum artigo encontrado para os filtros selecionados.',
      };
    }
    return await Promise.all(
      optionsFilter.map(async (article) => {
        const author = await this.userService.find_article_author(
          article.createdBy,
        );
        return {
          ...article,
          author,
        };
      }),
    );
  }

  async searchArticle(query: string): Promise<Article[]> {
    if (!query) return [];
    return this.article
      .find({
        title: { $regex: query, $options: 'i' },
      })
      .exec();
  }

  async remove_articles(user_id): Promise<any> {
    try {
      if (!user_id) return;
      return await this.article.deleteMany({ createdBy: user_id });
    } catch (error) {
      throw error;
    }
  }

  async last_added(): Promise<Article | any> {
    // Filtra os artigos publicados que foram criados pelos autores encontrados
    return Promise.all(
      (
        await this.article
          .find({ status: 'publicado' })
          .sort({ _id: -1 })
          .limit(3)
      ).map(async (article) => {
        //mapeia todos os artigos, depois procura no banco do usuario o id createdBy
        const author = await this.userService.find_article_author(
          article.createdBy,
        );
        return {
          ...article.toObject(),
          author,
        };
      }),
    );
  }

  async add_views(id: string) {
    if (id) {
      try {
        const article = await this.article.findOne({ _id: id }).exec();
        if (article) {
          article.views += 1;
          await article.save();
        } else {
          console.log('Article not found');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async increment_article_like(article_id: string) {
    try {
      const article_liked = await this.article.findOneAndUpdate(
        { _id: article_id },
        { $inc: { likes: 1 } },
        { new: true },
      );
      if (!article_liked) {
        throw new Error('Artigo não encontrado');
      }
      return article_liked;
    } catch (e) {
      throw Error;
    }
  }
  async increment_article_comment(article_id: string) {
    try {
      const comment_increment = await this.article.findOneAndUpdate(
        { _id: article_id },
        { $inc: { comments: 1 } },
        { new: true },
      );
      if (!comment_increment) {
        throw new Error('Artigo não encontrado');
      }
      return comment_increment;
    } catch (e) {
      throw Error;
    }
  }
}

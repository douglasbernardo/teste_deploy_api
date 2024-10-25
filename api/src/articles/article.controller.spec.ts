import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

interface Article {
  _id: string;
  backgroundImage: string;
  title: string;
  titleFont: string;
  article: string;
  textFont: string;
  category: string;
  status: string;
}
describe('ArticleController', () => {
  let app;
  let articleController: ArticleController;
  let articleService: ArticleService;
  const mockArticle: Article = {
    _id: '21p5ccf11d7rt83l093d7c12',
    backgroundImage: 'http://thisimagedoesnotexists.jpg',
    title: 'testing',
    titleFont: 'big font',
    article: 'this is the article text being write in here',
    textFont: 'vinna',
    category: 'tech',
    status: 'publicado',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            get_all_articles: jest.fn().mockResolvedValue([mockArticle]),
            get_article: jest.fn().mockResolvedValueOnce(mockArticle),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    articleController = module.get<ArticleController>(ArticleController);
    articleService = module.get<ArticleService>(ArticleService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch articles', () => {
    expect(articleController).toBeDefined();
  });

  describe('get all articles', () => {
    it('should return an article list', async () => {
      const articles = await articleController.getArticles();
      expect(articles).toBeDefined();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('get article by id', () => {
    it('should return an article by id', async () => {
      const result = await articleController.getArticle(mockArticle._id);

      expect(articleService.get_article).toHaveBeenCalled();
      expect(result).toEqual(mockArticle);
    });
  });
});

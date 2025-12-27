import { TestContext } from 'test/TestContext';
import { faker } from '../faker';
import { UserFactory } from 'test/factories/user.factory';
import { mockAuthUser, setupHttpContextMock } from 'test/test-helper';
import { ArticleService } from 'src/services/article.service';
import { ArticleInput } from 'src/dtos/articleInput';
import { Article } from 'src/entities/article-entity';
import { ProfileService } from 'src/services/profile.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityManager } from '@mikro-orm/core';
import { createEmFork } from '../TestContext';
import { ArticleFactory } from 'test/factories/article.factory';
import { User } from 'src/entities/user-entity';

describe('Article test suits', () => {
  let articleService: ArticleService;
  let input: ArticleInput;

  beforeEach(async () => {
    const modulesRef = await TestContext.createModule({
      imports: [CacheModule.register()],
      providers: [ArticleService, ProfileService],
    }).compile();

    articleService = modulesRef.get(ArticleService);
    input = {
      article: {
        slug: faker.lorem.slug(),
        title: faker.book.title(),
        body: faker.internet.password(),
        description: faker.word.words({ count: { min: 10, max: 30 } }),
        tagList: [faker.word.words({ count: 5 })],
      },
    };
  });

  it('Create article', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });
    setupHttpContextMock(createUser);

    await articleService.createArticle(input);
    const article = await TestContext.em.findOne(Article, {
      slug: input.article.slug,
    });

    expect(article?.slug).toBe(input.article.slug);
  });
  it('should get all articles', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });
    setupHttpContextMock(createUser);

    const createArticles =
      await TestContext.getFactory(ArticleFactory).create(10);

    const getArticles = await articleService.getAllArticles({});

    expect(getArticles).not.toBeNull();
  });
  it('Should update an article', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });

    setupHttpContextMock(createUser);

    const createArticle = await TestContext.getFactory(
      ArticleFactory,
    ).createOne({ author: createUser.id });

    const updateArticleData = { article: { title: 'Testing with Nestjs' } };

    const updatedArticle = await articleService.updateArticle(
      createArticle.slug!,
      updateArticleData,
    );

    expect(updatedArticle.article).not.toBeNull();
  });

  describe('Delete article', () => {
    let createUser1: User;
    let createUser2: User;

    beforeEach(async () => {
      createUser1 = await TestContext.getFactory(UserFactory).createOne();
      createUser2 = await TestContext.getFactory(UserFactory).createOne();

      mockAuthUser({ id: createUser1.id, username: createUser1.username });
      setupHttpContextMock(createUser1);
    });

    it('Delete article by author', async () => {
      const createArticle1 = await TestContext.getFactory(
        ArticleFactory,
      ).createOne({ author: createUser1.id });

      await articleService.deleteArticle(createArticle1.slug!);

      const found = await TestContext.em.findOne(Article, {
        slug: createArticle1.slug,
      });

      expect(found).toBeNull();
    });
    it('Should throw an error if user is not author of article', async () => {
      const createArticle = await TestContext.getFactory(
        ArticleFactory,
      ).createOne({ author: createUser2.id });

      expect(articleService.deleteArticle(createArticle.slug!)).rejects.toThrow(
        'Article does not exist',
      );
    });
  });

  it('Fetch all tags', async () => {
    await TestContext.getFactory(ArticleFactory).create(10);

    const tags = await articleService.fetchTags();

    expect(tags.tags).toBeInstanceOf(Array);

    expect(tags.tags.length).toBeGreaterThan(0);
  });

  it('Favorite an article', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });

    setupHttpContextMock(createUser);

    const article = await TestContext.getFactory(ArticleFactory).createOne();

    const favoritedArticle = await articleService.favoriteArticle(
      article.slug!,
    );

    expect(favoritedArticle.article.favorited).toBe(true);
    expect(favoritedArticle.article.favoritesCount).toBe(1);
  });
  it('Unfavorite an article', async () => {
    const createUser = await TestContext.getFactory(UserFactory).createOne();

    mockAuthUser({ id: createUser.id, username: createUser.username });

    setupHttpContextMock(createUser);

    const article = await TestContext.getFactory(ArticleFactory).createOne();

    const favoritedArticle = await articleService.favoriteArticle(
      article.slug!,
    );

    const unfavoritedArticle = await articleService.unFavoriteArticle(
      article.slug!,
    );

    expect(unfavoritedArticle.article.favorited).toBe(false);
    expect(favoritedArticle.article.favoritesCount).toBe(0);
  });
});

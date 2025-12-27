import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { faker } from '../faker';
import { Article } from 'src/entities/article-entity';
import { TestContext } from 'test/TestContext';
import { UserFactory } from './user.factory';

export class ArticleFactory extends Factory<Article> {
  model = Article;

  protected definition(): EntityData<Article> {
    return {
      slug: faker.lorem.slug(),
      title: faker.book.title(),
      body: faker.word.words({ count: { min: 100, max: 200 } }),
      author: TestContext.getFactory(UserFactory).makeOne(),
      description: faker.word.words({ count: { min: 10, max: 30 } }),
      favoritesCount: faker.number.int({ min: 0, max: 0 }),
      favorited: faker.datatype.boolean(),
      tagList: faker.word.words({ count: 5 }).split(','),
    };
  }
}

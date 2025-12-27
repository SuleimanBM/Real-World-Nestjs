import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { Comment } from 'src/entities/comments-entity';
import { faker } from '../faker';
import { TestContext } from 'test/TestContext';
import { ArticleFactory } from './article.factory';
import { UserFactory } from './user.factory';

export class CommentFactory extends Factory<Comment> {
  model = Comment;

  protected definition(): EntityData<Comment> {
    return {
      body: faker.word.words({ count: { min: 5, max: 20 } }),
      article: TestContext.getFactory(ArticleFactory).makeOne(),
      author: TestContext.getFactory(UserFactory).makeOne(),
    };
  }
}

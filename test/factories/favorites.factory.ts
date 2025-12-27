import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { Favorite } from 'src/entities/favourites-entity';
import { TestContext } from 'test/TestContext';
import { UserFactory } from './user.factory';
import { faker } from 'test/faker';
import { ArticleFactory } from './article.factory';

export class FavoriteFactory extends Factory<Favorite> {
  model = Favorite;

  protected definition(
    input?: EntityData<Favorite> | undefined,
  ): EntityData<Favorite> {
    return {
      user: faker.person.middleName(),
      favoriteArticles: TestContext.getFactory(ArticleFactory)
        .make(3)
        .map((x) => x.id),
    };
  }
}

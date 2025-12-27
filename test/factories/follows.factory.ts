import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { Follows } from 'src/entities/follows-entity';
import { TestContext } from 'test/TestContext';
import { UserFactory } from './user.factory';

export class FollowsFactory extends Factory<Follows> {
  model = Follows;

  protected definition(
    input?: EntityData<Follows> | undefined,
  ): EntityData<Follows> {
    return {
      followerId: TestContext.getFactory(UserFactory).makeOne().id,
      followedId: TestContext.getFactory(UserFactory).makeOne().id,
    };
  }
}

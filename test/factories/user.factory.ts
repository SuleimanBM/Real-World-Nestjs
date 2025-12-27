import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { User } from 'src/entities/user-entity';
import { faker } from '../faker';
import { count } from 'console';

export class UserFactory extends Factory<User> {
  model = User;

  protected definition(): EntityData<User> {
    return {
      bio: faker.lorem.sentence(10),
      email: faker.internet.email({ provider: 'yopmail.com' }),
      username: faker.person.middleName().toLowerCase(),
      password: faker.word.interjection({ length: { min: 8, max: 10 } }),
      image: faker.image.avatar(),
    };
  }
}

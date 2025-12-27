import { PrimaryKey, Property } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';

export abstract class CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', onCreate: () => uuidv7() })
  id: string = uuidv7().toString();

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date = new Date();
}

import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { CustomBaseEntity } from './base-entities';
import { User } from './user-entity';
import { Article } from './article-entity';

@Entity()
export class Comment extends CustomBaseEntity {
  @ManyToOne(() => Article, { ref: true })
  article: Article;

  @Property({ nullable: true })
  body: string;

  @ManyToOne(() => User, { ref: true })
  author: User;

  toDto() {
    return {
      id: this.id,
      author: this.author,
      article: this.article,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";
import { User } from "./user-entity";
import { Article } from "./article-entity";

@Entity()
export class Comment extends CustomBaseEntity {
    @ManyToOne(() => Article, { nullable: false })
    article: Article

    @Property({ nullable: true })
    body: string;

    @ManyToOne(() => User, { nullable: false })
    author: User;

    toDto() {
        return {
            id: this.id,
            author: this.author,
            article: this.article.title,
            body: this.body,
            createdAt: this.createdAt
        }
    }
}
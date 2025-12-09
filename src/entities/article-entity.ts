import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";
import { User } from "./user-entity";

@Entity()
export class Article extends CustomBaseEntity{
    @Index()
    @Property({nullable: true})
    slug?: string;

    @Property()
    title: string;

    @Property()
    description: string;

    @Property({type: "text"})
    body: string;

    @Index()
    @Property()
    tagList: string[];

    @Property({nullable: false})
    favorited?: boolean = false;

    @Property({nullable: false, default: 0})
    favoritesCount: number = 0;

    @Index()
    @ManyToOne(() => User, { nullable: false, eager: true },)
    author!: User;

}
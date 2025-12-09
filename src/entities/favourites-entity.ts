import { Entity, Property, Unique, UuidType } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";

@Entity()
export class Favorite extends CustomBaseEntity{
    @Property({ type: 'string', unique: true})
    user: string;

    @Property({type: "array", nullable: true})
    favoriteArticles?: string[];

}
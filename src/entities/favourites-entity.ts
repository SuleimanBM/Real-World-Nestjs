import { Entity, Property, Unique, UuidType } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";

@Entity()
export class Favorite extends CustomBaseEntity{
    @Property({ type: 'uuid', unique: true})
    user: UuidType;

    @Property({type: "array", nullable: true})
    favoriteArticles?: string[];

}
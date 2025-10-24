import { Entity, Property, UuidType } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";

@Entity()
export class Follows extends CustomBaseEntity{
    @Property({type: 'uuid'})
    followerId: UuidType;

    @Property({type: 'uuid'})
    followedId: UuidType;
}
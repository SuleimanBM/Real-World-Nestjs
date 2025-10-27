import { Entity, Property, Unique, UuidType } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";

@Entity()
@Unique({ properties: ['followerId', 'followedId'] })
export class Follows extends CustomBaseEntity{
    @Property({type: 'uuid'})
    followerId: UuidType;

    @Property({type: 'uuid'})
    followedId: UuidType;

}
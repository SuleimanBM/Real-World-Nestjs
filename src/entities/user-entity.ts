import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";

@Entity()
export class User extends CustomBaseEntity {
    @Property()
    username: string

    @Property()
    email: string

    @Property({hidden: true})
    password: string

    @Property({ nullable: true })
    bio?: string

    @Property({ nullable: true })
    image?: string

    toDto() {
        return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        }
                
    }
}
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base-entities";
import { UserRepository } from "../repositories/user.repository";
import { SoftDeletable } from "mikro-orm-soft-delete";

@SoftDeletable(() => User, "deletedAt", () => new Date())
@Entity({ repository: () => UserRepository })
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
    image?: string = "https://i.pravatar.cc/150"

    @Property({ nullable: true })
    deletedAt?: Date;

    toDto() {
        return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        }
                
    }
}
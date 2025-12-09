import { UuidType } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import { Follows } from "src/entities/follows-entity";
import { User } from "src/entities/user-entity";
import { HttpContext } from "src/misc/context";
import { MiscFunction } from "src/misc/miscfunction";

@Injectable()
export class ProfileService{
    constructor(
        private em: EntityManager,
    ) { }
    private readonly logger = new Logger(ProfileService.name)



    async fetchProfile(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following: boolean;

        const userInfo = await this.em.findOne(User,
            { username: userName },
            {
                filters: { [SOFT_DELETABLE_FILTER]: false }
            });

        if (!userInfo) throw new NotFoundException("User does not exists")

        const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id, followerId: currentUser.id })


        if (!isFollowing) {
            following = false
        } else {
            following = true
        }

        return { profile: { ...userInfo.toDto(), following } }

    }

    async followUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        const instance = new MiscFunction()
        instance.timeConsuming()
        const checkIsFollowing = await this.em.findOne(Follows, { followedId: userInfo.id, followerId: currentUser.id })
        if (checkIsFollowing) {
            return
        }

        const follow = this.em.create(Follows, { followedId: userInfo.id, followerId: currentUser.id })
        let following: boolean;
        if (follow) {
            following = true
        } else {
            following = false
        }
        await this.em.flush()

        return { profile: { ...userInfo.toDto(), following } }
    }

    async unfollowUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following: boolean;
        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id, followerId: currentUser.id })

        if (isFollowing) {
            await this.em.remove(isFollowing).flush()
            following = false
        }else {
            following = true
        }

        return { profile: { ...userInfo.toDto(), following } }
    }





}
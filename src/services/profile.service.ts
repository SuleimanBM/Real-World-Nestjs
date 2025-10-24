import { EntityManager, UuidType } from "@mikro-orm/core";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Follows } from "src/entities/follows-entity";
import { User } from "src/entities/user-entity";
import { HttpContext } from "src/misc/context";

@Injectable()
export class ProfileService {
    constructor(
        private em: EntityManager,
    ) { }

    async checkFollowing(followedId?: string, followerId?: string) {
        let query = {} as any;
        if (followerId) {
            query.followerId = followerId;
        }
        if (followedId) {
            query.followedId = followedId;
        }
        const isFollowing = await this.em.findOne(Follows, query)
        
        return isFollowing;
    }

    async fetchProfile(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following;

        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")
        
        console.log("Found userInfo in profileservice", userInfo)

        const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })
        console.log(isFollowing)

        if (!isFollowing) {
            following = false
        } else {
            following = true
        }

        return { ...userInfo.toDto(), following }

    }

    async followUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        this.em.create(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })

        await this.em.flush()

        return { ...userInfo.toDto(), following: true }
    }

    async unfollowUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following = true;
        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        //const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })
        const isFollowing = this.checkFollowing(userInfo.id, currentUser.id)

        if (isFollowing) {
            await this.em.remove(isFollowing).flush()
            following = false
        }

        return { ...userInfo.toDto(), following }
    }





}
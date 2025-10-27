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


    async fetchProfile(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following;

        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")
        
        //console.log("Found userInfo in profileservice", userInfo)

        const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })
        console.log(isFollowing)

        if (!isFollowing) {
            following = false
        } else {
            following = true
        }

        return {profile:{ ...userInfo.toDto(), following }}

    }

    async followUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        this.em.create(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })

        await this.em.flush()

        return {profile: { ...userInfo.toDto(), following: true }}
    }

    async unfollowUser(userName: string) {
        const currentUser = HttpContext.get().req.user;

        let following = true;
        const userInfo = await this.em.findOne(User, { username: userName });

        if (!userInfo) throw new NotFoundException("User does not exists")

        const isFollowing = await this.em.findOne(Follows, { followedId: userInfo.id as unknown as UuidType, followerId: currentUser.id as unknown as UuidType })

        if (isFollowing) {
            await this.em.remove(isFollowing).flush()
            following = false
        }

        return { profile: { ...userInfo.toDto(), following: false } }
    }





}
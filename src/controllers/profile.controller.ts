import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { UserDto } from 'src/dtos/user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ProfileService } from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';


@Controller("profiles")
@UseGuards(JwtGuard)
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get(":username")
    fetchProfile(@Param("username") username: string) {
        console.log("Request hitting controller and username is ", username);
        return this.profileService.fetchProfile(username)
    }

    @Post(":username/follow")
    follow(@Param("username") username: string) {
        return this.profileService.followUser(username)
    }
    @Delete(":username/follow")
    unFollow(@Param("username") username: string) {
        return this.profileService.unfollowUser(username)
    }

}

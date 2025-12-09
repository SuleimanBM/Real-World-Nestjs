import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IsNotEmpty } from 'class-validator';
import type { Request, Response } from 'express';
import { LoginUserInput, VerifyTokenInput } from 'src/dtos/login.dto';
import { RegisterUserInput } from 'src/dtos/register.dto';
import { UpdateUserInput } from 'src/dtos/user.dto';
import { GoogleOauthGuard } from 'src/guards/googleOauth.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/services/user.service';




@Controller("users")
@Throttle({ default: { ttl: 3000, limit: 4 } })
export class UserController {
    constructor(private userService: UserService) { }

    @Get("google")
    @UseGuards(GoogleOauthGuard)
    async gooogleAuth() { }

    @Get("google/callback")
    @UseGuards(GoogleOauthGuard)
    async gooogleAuthCallBack(@Req() req: Request, @Res() res: Response) {
        console.log({ user: req.user })
        res.send('http://localhost:3000/home')
    }

    @Post("google/mobile")
    async verifyGoogleToken(@Body() input: VerifyTokenInput) {
        return this.userService.decodeGoogleToken(input)

    }

    @Put()
    @UseGuards(JwtGuard)
    updateUser(@Body() input: UpdateUserInput) {
        return this.userService.updateUser(input)
    }

    @Post("login")
    login(@Body() loginDto: LoginUserInput) {
        console.log(loginDto)
        return this.userService.loginUser(loginDto)
    }

    @Post()
    register(@Body() registerDto: RegisterUserInput) {
        return this.userService.registerUser(registerDto)
    }

    @Get()
    @UseGuards(JwtGuard)
    getUser() {
        return this.userService.getUser()
    }

    @Delete()
    @UseGuards(JwtGuard)
    deleteUser() {
        return this.userService.removeUser()
    }




}

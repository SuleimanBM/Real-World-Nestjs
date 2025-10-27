import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LoginDto, LoginUserInput } from 'src/dtos/login.dto';
import { RegisterUserInput } from 'src/dtos/register.dto';
import { UpdateUserDto } from 'src/dtos/user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/services/user.service';


@Controller("users")
export class UserController {
    constructor(private userService: UserService) { }

    @Post("login")
    login(@Body() loginDto: LoginUserInput) {
        return this.userService.loginUser(loginDto)
    }

    @Post()
    register(@Body() registerDto: RegisterUserInput) {
       // console.log("logging register details from user controller ", registerDto)
        return this.userService.registerUser(registerDto)
    }

    @Get()
    @UseGuards(JwtGuard)
    getUser() {
        console.log('getting user')
        return this.userService.getUser()
    }

    @UseGuards(JwtGuard)
    @Put()
    updateUser(@Body() userDto: UpdateUserDto) {
        return this.userService.updateUser(userDto)
    }


}

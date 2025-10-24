import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { UpdateUserDto, UserDto } from 'src/dtos/user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/services/user.service';


@Controller("users")
export class UserController {
    constructor(private userService: UserService) { }

    @Post("login")
    login(@Body() loginDto: LoginDto) {
        return this.userService.loginUser(loginDto)
    }

    @Post()
    register(@Body() registerDto: RegisterDto) {
        console.log("logging register details from user controller ",registerDto)
        return this.userService.registerUser(registerDto)
    }

    @UseGuards(JwtGuard)
    @Get()
    getUser() {
        return this.userService.getUser()
    }

    @UseGuards(JwtGuard)
    @Put()
    updateUser(@Body () userDto: UpdateUserDto) {
        return this.userService.updateUser(userDto)
    }

        
    }

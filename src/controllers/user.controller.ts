import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  getUser() {
    return this.userService.getUser();
  }

  @Put()
  @UseGuards(JwtGuard)
  updateUser(@Body() input: UpdateUserInput) {
    console.log('update received ', input);
    return this.userService.updateUser(input);
  }
}

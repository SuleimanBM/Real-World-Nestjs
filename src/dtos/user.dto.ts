import { IsEmail, IsNotEmpty, Length } from "class-validator"
import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from "./register.dto";

// export class RegisterUserInput {
//     user: RegisterDto;
// }


export class UserDto {

    @Length(3, 25)
    username?: string;

    @IsEmail()
    email?: string;

    @Length(8)
    password?: string;

    @IsNotEmpty()
    bio?: string;

    @IsNotEmpty()
    image?: string;
}

export class UpdateUserInput {
    user: UserDto;
}
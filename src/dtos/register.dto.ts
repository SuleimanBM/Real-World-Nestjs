import { PickType } from "@nestjs/swagger"
import { UserDto } from "./user.dto";
import { IsEmail, Length } from "class-validator";


//export class RegisterDto extends PickType(UserDto, ["username", "email", "password"] as const) { }

export class RegisterDto {
    @Length(3, 25)
    username: string;

    @IsEmail()
    email: string;

    @Length(8)
    password: string;
}

export class RegisterUserInput {
    user: RegisterDto
}
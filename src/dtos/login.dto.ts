import { PickType } from "@nestjs/swagger"
import { UserDto } from "./user.dto";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginUserInput {
    user: LoginDto 
}


export class LoginDto {
    @IsEmail()
    email: string;

    @Length(8)
    password: string;
}

export class VerifyTokenInput {
    @IsNotEmpty()
    token: string
}
import { PickType } from "@nestjs/swagger"
import { UserDto } from "./user.dto";

export class LoginUserInput {
    user: LoginDto 
}


export class LoginDto extends PickType(UserDto, ["email", "password"] as const){}
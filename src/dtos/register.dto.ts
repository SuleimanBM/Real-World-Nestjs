import { PickType } from "@nestjs/swagger"
import { UserDto } from "./user.dto";


export class RegisterDto extends PickType(UserDto, ["username", "email", "password"] as const){}
import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto, LoginUserInput } from "src/dtos/login.dto";
import { RegisterUserInput } from "src/dtos/register.dto";
import { User } from "src/entities/user-entity";
import bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpContext } from "src/misc/context"
import { UpdateUserDto, UserDto } from "src/dtos/user.dto";

@Injectable()
export class UserService {
    constructor(
        private em: EntityManager,
        private jwtService: JwtService,
    ) { }


    async registerUser(registerDto: RegisterUserInput) {
        const userInput = registerDto.user

        //console.log("userInput from userService ", userInput)

        const userExists = await this.em.findOne(User, { email: userInput.email })

        if (userExists) {
            throw new BadRequestException("User already exists");
        }
        //console.log("logging user from user services", userInput);

        const hashedPassword = await bcrypt.hash(userInput.password, 10)

        const user = this.em.create(User, { ...userInput, password: hashedPassword });

        await this.em.flush()

        const token = await this.jwtService.sign({ id: user.id, username: user.username })

        return {user:{ ...user.toDto(), token }};
    }

    async loginUser(input: LoginUserInput) {
        const loginDto = input.user
        const user = await this.em.findOne(User, { email: loginDto.email })

        if (!user) {
            throw new NotFoundException("User does not exists");
        }
        const isValidPassword = bcrypt.compare(loginDto.password, user.password!)
        if (!isValidPassword) {
            throw new BadRequestException("Invalid credentials");
        }
        const token = await this.jwtService.sign({ id: user.id, username: user.username })

        return { user: { ...user.toDto(), token } };
    }

    async getUser() {
        const currentUser = HttpContext.get().req.user;

        const user = await this.em.findOne(User, { id: currentUser.id })
        return {user: user?.toDto()}
    }

    async updateUser(userDto: UpdateUserDto) {
        const currentUser = HttpContext.get().req.user;

        const user = await this.em.findOne(User, { id: currentUser.id })
        if (!user) throw new NotFoundException("User does not exists");
        const updatedUser = this.em.assign(user, userDto);
        await this.em.flush()
        // const updatedUser = await this.em.upsert(User, { id: currentUser.id, ...userDto })

        return updatedUser.toDto()
    }

}
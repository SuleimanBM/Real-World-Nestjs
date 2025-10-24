import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto } from "src/dtos/login.dto";
import { RegisterDto } from "src/dtos/register.dto";
import { User } from "src/entities/user-entity";
import bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {HttpContext} from "src/misc/context"
import { UpdateUserDto, UserDto } from "src/dtos/user.dto";

@Injectable()
export class UserService {
    constructor(
        private em: EntityManager,
        private jwtService: JwtService,
    ) { }
    
    
    async registerUser(registerDto: RegisterDto) {
        const userExists = await this.em.findOne(User, { email: registerDto.email })

        if (userExists) {
            throw new BadRequestException("User already exists");
        }
        console.log("logging user from user services", registerDto);
        const hashedPassword = await bcrypt.hash(registerDto.password, 10)
        const user = this.em.create(User, {...registerDto,password: hashedPassword });
        await this.em.flush()
        return user;
     }

    async loginUser(loginDto: LoginDto) { 
        const user = await this.em.findOne(User, { email: loginDto.email })

        if (!user) {
            throw new NotFoundException("User does not exists");
        }
        const isValidPassword = bcrypt.compare(loginDto.password, user.password!)
        if (!isValidPassword) {
            throw new BadRequestException("Invalid credentials");
        }
        const token = await this.jwtService.sign({ id: user.id, username: user.username })
        
        return {...user.toDto(), token}
    }

    async getUser() {
        const currentUser = HttpContext.get().req.user;

        const user = await this.em.findOne(User, { id: currentUser.id })
        return user?.toDto()
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
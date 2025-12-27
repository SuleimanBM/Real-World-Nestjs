import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, LoginUserInput, VerifyTokenInput } from 'src/dtos/login.dto';
import { RegisterUserInput } from 'src/dtos/register.dto';
import { User } from 'src/entities/user-entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpContext } from 'src/misc/context';
import { UpdateUserInput, UserDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';

import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UserService {
  constructor(
    private em: EntityManager,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}
  private readonly logger = new Logger(UserService.name);
  private client: OAuth2Client = new OAuth2Client();

  async decodeGoogleToken(input: VerifyTokenInput) {
    console.log({ input });
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: input.token,
        audience: [process.env.GOOGLE_ID as string],
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google ID Token');
      }

      return payload;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async registerUser(registerDto: RegisterUserInput) {
    try {
      const userInput = registerDto.user;

      const userExists = await this.em.findOne(User, {
        $or: [{ email: userInput.email }, { username: userInput.username }],
      });

      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(userInput.password, 10);

      const user = this.em.create(User, {
        ...userInput,
        password: hashedPassword,
      });

      await this.em.flush();

      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
      });

      return { user: { ...user.toDto(), token } };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginUser(input: LoginUserInput) {
    const loginDto = input.user;

    const user = await this.userRepository.verifyUser(
      loginDto.email,
      loginDto.password,
    );

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return { user: { ...user.toDto(), token } };
  }

  async getUser() {
    const currentUser = HttpContext.get().req.user;

    try {
      const user = await this.em.findOne(User, { id: currentUser.id });
      return { user: user?.toDto() };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(input: UpdateUserInput) {
    try {
      const userDto = input.user;

      const currentUser = HttpContext.get().req.user;

      const user = await this.em.findOneOrFail(
        User,
        { id: currentUser.id },
        { failHandler: () => new BadRequestException() },
      );
      if (!user) {
        throw new BadRequestException('User already exists');
      }
      if (userDto.password) {
        userDto.password = await bcrypt.hash(userDto.password, 10);
      }
      console.log(userDto);
      const updatedUser = this.em.assign(user, userDto);
      await this.em.flush();
      // const updatedUser = await this.em.upsert(User, { id: currentUser.id, ...userDto })

      return { user: updatedUser.toDto() };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeUser() {
    const currentUser = HttpContext.get().req.user;

    try {
      const user = await this.em.findOne(User, { id: currentUser.id });

      if (!user) throw new NotFoundException('User does not exist');

      this.em.remove(user);

      await this.em.flush();
    } catch (error) {
      this.logger.error('Could not delete user', error);
      throw new InternalServerErrorException(
        'Could not delete user',
        error.message,
      );
    }
  }
}

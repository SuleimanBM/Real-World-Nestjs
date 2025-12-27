import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user-entity';
import bcrypt from 'bcrypt';

export class UserRepository extends EntityRepository<User> {
  public async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}

import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ProfileService } from 'src/services/profile.service';

@Controller('profiles')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private profileService: ProfileService) {}

  @Get(':username')
  fetchProfile(@Param('username') username: string) {
    return this.profileService.fetchProfile(username);
  }

  @Post(':username/follow')
  follow(@Param('username') username: string) {
    return this.profileService.followUser(username);
  }
  @Delete(':username/follow')
  unFollow(@Param('username') username: string) {
    return this.profileService.unfollowUser(username);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor() {}
}

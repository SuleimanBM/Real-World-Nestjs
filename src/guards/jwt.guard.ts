import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //     return super.canActivate(context)
  // }
  // handleRequest(err: any, user: any) {
  //     if (err) throw new BadRequestException("Unauthorized")
  //     //console.log("Logging user from guard",user)
  //     return user;
  // }
}

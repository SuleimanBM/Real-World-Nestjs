import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, of, tap, timeout } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = new Date().getTime();
    console.log(
      'Request hitting the server',
      context.switchToHttp().getRequest().method,
      context.switchToHttp().getRequest().url,
    );
    // console.log("Request hitting the server", context.switchToHttp().getRequest().headers)
    // console.log("Request hitting the server", context.switchToHttp().getRequest().method)

    return next.handle().pipe(
      tap((data) => {
        const timetaken = new Date().getTime() - start;
      }),
      timeout(5000),
      // map((data) => ({
      //     statusCode: context.switchToHttp().getResponse().statusCode,
      //     timeStamp: new Date().toISOString(),
      //     data,
      // }))
    );
  }
}

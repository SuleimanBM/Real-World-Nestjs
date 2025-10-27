import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, of, tap, timeout } from "rxjs";


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const start = new Date().getTime();
        //console.log(`Request has hit the endpoint at ${start}`);
        console.log("Request hitting the server", context.switchToHttp().getRequest().url)

        return next.handle().
            pipe(
                tap((data) => {
                    const timetaken = new Date().getTime() - start;
                    //console.log(`Some side effects like logging how long the response took. This one took ${timetaken}ms`);
                    console.log("Logging response status code ", context.switchToHttp().getResponse().statusCode)
                    console.log("Logging data from response ", data)
                }
                ),
                timeout(5000),
                // map((data) => ({
                //     statusCode: context.switchToHttp().getResponse().statusCode,
                //     timeStamp: new Date().toISOString(),
                //     data,
                // }))
            )
    }
}
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,
        });
        //console.log('JwtStrategy initialized ✅');
    }

     validate(payload: any) {
       // console.log("Logging payload from strategy", payload);
        return payload
    }
}
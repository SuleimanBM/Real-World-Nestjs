import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { RequestContext } from "nestjs-request-context";

interface UserDto { id: string, username: string }

@Injectable()
export class HttpContext {
    static get(): RequestContext<Request & { user: UserDto }, Response> {
       //console.log("logging from httpcontext",RequestContext.currentContext.req.user)
        return RequestContext.currentContext
    }
    
}
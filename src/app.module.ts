import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs"
import mikroOrmConfig from "./mikro-orm.config"
import { UserController } from './controllers/user.controller';
import { ArticleController } from './controllers/article.controller';
import { UserService } from './services/user.service';
import { ArticleService } from './services/article.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpContext } from './misc/context';
import { RequestContextModule } from 'nestjs-request-context';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: "./../.env"}),
    MikroOrmModule.forRoot(mikroOrmConfig),
    RequestContextModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: "1h"}
    })
  ],
  controllers: [AppController, UserController, ArticleController,ProfileController,CommentController],
  providers: [
    AppService,
    UserService,
    ArticleService,
    ProfileService,
    CommentService,
    JwtStrategy,
    { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}

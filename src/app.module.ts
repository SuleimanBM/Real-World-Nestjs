import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs"
import mikroOrmConfig from "./mikro-orm.config"
import { UserController } from './controllers/user.controller';
import { ArticleController } from './controllers/article.controller';
import { UserService } from './services/user.service';
import { ArticleService } from './services/article.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RequestContextModule } from 'nestjs-request-context';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { CommentService } from './services/comment.service';
import { User } from './entities/user-entity';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleAuthStrategy } from './strategies/googleOauth.strategy';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { UserRepository } from './repositories/user.repository';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { TagsController } from './controllers/tag.controller';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "./../.env" }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forMiddleware(),
    RequestContextModule,
    RequestContext,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "24h" }
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000,
          limit: 5
        }
      ]
    })
  ],
  controllers: [AppController, UserController, ArticleController, ProfileController, TagsController],
  providers: [
    AppService,
    UserService,
    ArticleService,
    ProfileService,
    CommentService,
    JwtStrategy,
    GoogleAuthStrategy,
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private orm: MikroORM
  ) { }
  async onModuleInit() {
    const environment = this.configService.getOrThrow("ENV")
    if (environment !== "DEVELOPMENT") {
      await this.orm.migrator.up()
      await this.orm.seeder.seed()
    }
  }

}

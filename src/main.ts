import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptors';
import { RequestContextMiddleware } from 'nestjs-request-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: "*"});
  app.useGlobalInterceptors(new ResponseInterceptor);
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

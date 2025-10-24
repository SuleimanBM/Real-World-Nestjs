import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptors';
import { RequestContextMiddleware } from 'nestjs-request-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

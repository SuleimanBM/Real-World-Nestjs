import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RequestContextMiddleware } from 'nestjs-request-context';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      prefix: 'Logger',
      json: false,
      timestamp: true,
      logLevels: ['error', 'log'],
    }),
  });
  app.enableCors({ origin: '*' });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api');
  app.use;

  const config = new DocumentBuilder()
    .setTitle('Real-World')
    .setDescription('The Real-World API docs')
    .setVersion('1.0')
    .addTag('Conduit')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

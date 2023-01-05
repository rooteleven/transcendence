import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* CORS is a security feature implemented by web browsers that blocks web pages from making requests to a different domain than the one that served the web page. */
  /* By calling app.enableCors(), you are allowing your Express.js app to make requests to other domains. */

  app.enableCors(); 

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(3000);
}
bootstrap();

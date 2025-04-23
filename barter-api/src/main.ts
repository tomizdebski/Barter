import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 Cookie-parser musi być tu:
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN, // np. http://localhost:3000
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();


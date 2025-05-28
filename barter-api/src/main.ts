
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ 1. Ustaw CORRECT origins – bez slasha na końcu!
  const allowedOrigins = [
    'http://localhost:3000',
    'https://barter-self.vercel.app', // ❌ nie dawaj `/` na końcu!
  ];

  // ✅ 2. Enable CORS jako pierwszy middleware
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // ✅ 3. CookieParser po CORS
  app.use(cookieParser());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Barter API')
    .setDescription('API documentation for the Barter project')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Globalne walidacje
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Uruchomienie serwera
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();

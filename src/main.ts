import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unwanted fields
      forbidNonWhitelisted: true, // Throws an error if extra fields are provided
      transform: true, // Automatically transforms input data to match DTO types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

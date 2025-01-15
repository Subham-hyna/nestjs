import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './common/exception/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unwanted fields
      forbidNonWhitelisted: true, // Throws an error if extra fields are provided
      transform: true, // Automatically transforms input data to match DTO types
    }),
  );
  app.use(new LoggingMiddleware().use);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://hosteddomain.com'], // currently backend is not hosted, and there is not site such as hosteddomain.com
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

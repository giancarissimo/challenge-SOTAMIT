import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './common/exceptions/http-custom-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform-interceptors.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor global para transformar las respuestas de éxito
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Filtro global de excepciones para formatear los errores
  app.useGlobalFilters(new CustomExceptionFilter());

  // Pipe global para validaciones con class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(envs.app_port);
  console.log(`Server running on http://localhost:${envs.app_port}`);
}
bootstrap();

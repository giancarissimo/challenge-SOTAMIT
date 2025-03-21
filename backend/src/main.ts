import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './common/exceptions/http-custom-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform-interceptors.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Documentación de API y Schemas Dto con Swagger
  const config = new DocumentBuilder()
    .setTitle('Challenge SOTAMIT - API')
    .setDescription('Documentación de los endpoints de la API y de los schemas Dto')
    .setVersion('1.0')
    .addBearerAuth() // Al utilizarse JWT, se agrega un botón para autenticarse en Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Habilitación de CORS para el frontend
  app.enableCors({
    origin: envs.frontend_url,
    credentials: true,
  });

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

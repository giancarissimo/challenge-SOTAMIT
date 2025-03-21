import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.app_port);
  console.log(`Server running on http://localhost:${envs.app_port}`);
}
bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envs } from './config/envs.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Conexión a MongoDB de forma asíncrona
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: envs.mongo_uri,
      }),
      inject: [ConfigService],
    }),
    // Módulos de Usuarios y de Auth
    UsersModule, AuthModule
  ],
})
export class AppModule { };

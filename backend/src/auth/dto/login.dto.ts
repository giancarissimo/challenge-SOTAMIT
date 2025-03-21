import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Documento Nacional de Identidad (DNI) del usuario registrado' })
  @IsNotEmpty()
  @IsNumber()
  readonly dni: number;

  @ApiProperty({ description: 'Contraseña del usuario registrado' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
};

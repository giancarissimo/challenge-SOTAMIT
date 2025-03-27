import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Min, Max, IsNumber, MaxLength, IsDateString, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario', minLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  first_name: string;

  @ApiProperty({ description: 'Apellido del usuario', minLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  last_name: string;

  @ApiProperty({ description: 'Documento Nacional de Identidad (DNI) del usuario', minimum: 1000000, maximum: 999999999, type: Number })
  @IsNotEmpty()
  @Min(1000000)
  @Max(999999999)
  @IsNumber()
  dni: number;

  @ApiProperty({ description: 'Fecha de nacimiento del usuario', example: '1990-01-01' })
  @IsNotEmpty()
  @IsDateString()
  birthdate: string;

  @ApiProperty({ description: 'Indica si el usuario es desarrollador' })
  @IsNotEmpty()
  @IsBoolean()
  is_developer: boolean;

  @ApiProperty({ description: 'Descripción breve del usuario', minLength: 2, maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  description: string;

  @ApiProperty({ description: 'Área de trabajo del usuario', minLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  work_area: string;

  @ApiProperty({ description: 'Contraseña del usuario', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ description: 'Rol del usuario. Valores permitidos: "user" o "admin". Por defecto es "user".', enum: ['user', 'admin'], default: 'user' })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;
};

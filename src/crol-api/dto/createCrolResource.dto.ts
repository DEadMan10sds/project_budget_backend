import { Optional } from '@nestjs/common';
import {
  IsNumber,
  IsIn,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateCrolResourceDto {
  @IsNumber()
  metodoCosteo: number;

  @IsNumber()
  @IsIn([1, 2])
  tipo: number;

  @IsOptional()
  @IsNumber()
  marcaId: number;

  @IsNumber()
  umBaseId: number;

  @IsNumber()
  umId: number;

  @IsString()
  @MinLength(1)
  codigo: string;

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  claveProdServ: string;

  @Optional()
  @IsNumber()
  clasificacionId: number;

  @Optional()
  @IsNumber()
  agrupadorServicio: number;
}

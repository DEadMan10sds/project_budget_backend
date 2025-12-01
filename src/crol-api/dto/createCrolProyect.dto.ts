import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCrolProyect {
  @IsOptional()
  @IsNumber()
  @Min(0)
  divisionId: number;

  @IsString()
  @MinLength(1)
  divisionNombre: string;

  @IsString()
  @MinLength(1)
  divisionCodigo: string;

  @IsNumber()
  @IsOptional()
  centroCostoNombre: number;

  @IsNumber()
  @Min(0)
  centroCostoId: number;

  @IsBoolean()
  divisionActiva: boolean;

  @IsBoolean()
  exentoIVA: boolean;

  @IsBoolean()
  controlActivosFijos: boolean;

  @IsNumber()
  @Min(0)
  divisionIdPadre: number;
}

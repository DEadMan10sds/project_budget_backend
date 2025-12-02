import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProyectDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  crol_id: string;

  @IsString()
  @MinLength(1)
  external_id: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  client: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimated_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  real_price: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @MinLength(1)
  seller: string;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  divisionId: number;

  @IsNumber()
  @Min(1)
  budget: number;

  /*@IsArray()
  @IsOptional()
  @IsString({ each: true })
  resources?: string[];
  */
}

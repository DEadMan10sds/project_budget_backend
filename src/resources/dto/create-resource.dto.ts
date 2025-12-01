import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

enum Coins {
  MXN = 'MXN',
  USD = 'USD',
}

export class CreateResourceDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  crol_id: string;

  @IsNumber()
  service_group: number;

  @IsNumber()
  @IsOptional()
  cost_method: number;

  @IsNumber()
  @IsIn([1, 2])
  @IsOptional()
  type: number;

  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(0)
  estimated_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  real_price: number;

  @IsString()
  @MinLength(1)
  measurement_unit: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @MinLength(1)
  status: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  bougth_on: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  eta: Date;

  @IsString()
  @MinLength(1)
  sat_code: string;

  @IsString()
  @MinLength(1)
  link: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes: string;

  @IsString()
  @MinLength(1)
  sku: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  @IsEnum(Coins)
  coin: string;

  // @IsString()
  // @MinLength(1)
  // clasification: string;

  @IsOptional()
  @IsBoolean()
  approved: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  subtotal: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsUUID()
  proyect: string;

  @IsString()
  @IsUUID()
  user: string;

  @IsString()
  @IsUUID()
  supplier: string;

  @IsString()
  @IsUUID()
  category: string;
}

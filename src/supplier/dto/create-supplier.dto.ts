import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  logo: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

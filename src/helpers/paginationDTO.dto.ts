import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  skip: number;

  @Min(0)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit: number;
}

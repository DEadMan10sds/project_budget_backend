import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateActivityLogDto {
  @IsString()
  @MinLength(1)
  action: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  fromState: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  toState: string;

  @IsString()
  @IsUUID()
  project: string;

  @IsString()
  @IsUUID()
  user: string;

  @IsString()
  @IsUUID()
  product: string;

  @IsDate()
  date: Date;
}

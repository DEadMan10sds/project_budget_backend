import {
  IsArray,
  IsBoolean,
  IsEmail,
  //IsIn,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
//import { Roles } from '../static/roles';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  surname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  //@IsIn(Roles)
  roles: string[];

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  /*
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  proyects?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  resources?: string[];
  */
}

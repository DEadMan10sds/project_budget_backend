import { PartialType } from '@nestjs/mapped-types';
import { CreateCrolProyect } from './createCrolProyect.dto';

export class UpdateCrolProyectDto extends PartialType(CreateCrolProyect) {}

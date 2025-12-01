import { Controller, Post } from '@nestjs/common';
import { DbinitService } from './dbinit.service';
@Controller('dbinit')
export class DbinitController {
  constructor(private readonly dbinitService: DbinitService) {}
}

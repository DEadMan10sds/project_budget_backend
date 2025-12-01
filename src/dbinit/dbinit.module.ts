import { Module } from '@nestjs/common';
import { DbinitService } from './dbinit.service';
import { DbinitController } from './dbinit.controller';

@Module({
  controllers: [DbinitController],
  providers: [DbinitService],
  exports: [DbinitService],
})
export class DbinitModule {}

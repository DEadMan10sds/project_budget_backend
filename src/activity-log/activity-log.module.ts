import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ActivityLogController],
  imports: [TypeOrmModule.forFeature([ActivityLog]), AuthModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}

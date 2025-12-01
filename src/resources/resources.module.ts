import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';
import { ProyectsModule } from 'src/proyects/proyects.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { CrolApiModule } from 'src/crol-api/crol-api.module';
//import { SatModule } from 'src/sat/sat.module';
import { AuthModule } from 'src/auth/auth.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ResourceCounter } from './entities/resource_counter.entity';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { Category } from './entities/category.entity';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports: [
    TypeOrmModule.forFeature([Resource, ResourceCounter, Category]),
    ErrorHandlingModule,
    ProyectsModule,
    UsersModule,
    CommonModule,
    CrolApiModule,
    AuthModule,
    SupplierModule,
    ActivityLogModule,
    //SatModule,
  ],
  exports: [ResourcesService],
})
export class ResourcesModule {}

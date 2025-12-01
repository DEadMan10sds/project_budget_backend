import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [
    TypeOrmModule.forFeature([Supplier]),
    ErrorHandlingModule,
    CommonModule,
    AuthModule,
  ],
  exports: [SupplierService],
})
export class SupplierModule {}

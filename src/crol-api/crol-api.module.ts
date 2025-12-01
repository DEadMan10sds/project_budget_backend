import { Module } from '@nestjs/common';
import { CrolApiService } from './crol-api.service';
import { CrolApiController } from './crol-api.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrolToken } from './entities/crol-api.entity';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CrolApiController],
  providers: [CrolApiService],
  imports: [
    ConfigModule,
    CommonModule,
    TypeOrmModule.forFeature([CrolToken]),
    ErrorHandlingModule,
    AuthModule,
  ],
  exports: [CrolApiService],
})
export class CrolApiModule {}

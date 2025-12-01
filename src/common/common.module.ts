import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { CommonService } from './common.service';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';

@Module({
  providers: [AxiosAdapter, CommonService],
  imports: [ErrorHandlingModule],
  exports: [AxiosAdapter, CommonService],
})
export class CommonModule {}

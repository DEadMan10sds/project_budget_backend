import { Injectable } from '@nestjs/common';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { DataSource } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async handleTransaction(queryToSave: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(queryToSave);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorHandler.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }
}

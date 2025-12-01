import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';

@Injectable()
export class DbinitService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    const sqlPath = path.join(__dirname, '../../src/dbinit/', 'triggers.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    await this.dataSource.query(sql);
    console.log('Triggers and Stored Procedures initialized');
  }
}

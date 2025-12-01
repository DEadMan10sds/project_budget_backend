import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';
import { AuthModule } from './auth/auth.module';
import { CrolApiModule } from './crol-api/crol-api.module';
import { CommonModule } from './common/common.module';
import { ProyectsModule } from './proyects/proyects.module';
//import { SatModule } from './sat/sat.module';
import { ResourcesModule } from './resources/resources.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailsModule } from './emails/emails.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SupplierModule } from './supplier/supplier.module';
import { DbinitModule } from './dbinit/dbinit.module';
import { DbinitService } from './dbinit/dbinit.service';
import { ActivityLogModule } from './activity-log/activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, '/emails/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    UsersModule,
    ErrorHandlingModule,
    AuthModule,
    CrolApiModule,
    CommonModule,
    ProyectsModule,
    //SatModule,
    ResourcesModule,
    NotificationsModule,
    EmailsModule,
    SupplierModule,
    DbinitModule,
    ActivityLogModule,
  ],
  providers: [DbinitService],
})
export class AppModule {}

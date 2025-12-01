import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';
import { AuthModule } from 'src/auth/auth.module';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { PasswordToken } from './entities/token.entity';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User, Proyect, PasswordToken]),
    ErrorHandlingModule,
    AuthModule,
    EmailsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

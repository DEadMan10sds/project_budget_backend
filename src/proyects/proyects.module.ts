import { Module } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { ProyectsController } from './proyects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyect } from './entities/proyect.entity';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ErrorHandlingModule } from 'src/error-handling/error-handling.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AuthModule } from 'src/auth/auth.module';
import { CrolApiModule } from 'src/crol-api/crol-api.module';
import { ProjectCounter } from './entities/project-counter.entity';
@Module({
  controllers: [ProyectsController],
  imports: [
    TypeOrmModule.forFeature([Proyect, ProjectCounter]),
    UsersModule,
    CommonModule,
    AuthModule,
    ErrorHandlingModule,
    NotificationsModule,
    CrolApiModule,
  ],
  providers: [ProyectsService],
  exports: [ProyectsService],
})
export class ProyectsModule {}

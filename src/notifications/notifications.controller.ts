import { Controller, Sse, Query, BadRequestException } from '@nestjs/common';
import { merge, Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { MessageEvent } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse()
  sse(
    @Query('userId') userId?: string,
    @Query('roles') roles?: string,
    @Query('broadcast') broadcast?: string,
  ): Observable<any> {
    const streams: Observable<any>[] = [];

    if (userId) {
      streams.push(this.notificationsService.getUserStream(userId));
    }

    if (roles) {
      const roleList = roles.split(',').map((r) => r.trim());
      for (const role of roleList) {
        streams.push(this.notificationsService.getRoleStream(role));
      }
    }

    if (broadcast === 'true') {
      streams.push(this.notificationsService.getBroadcastStream());
    }

    if (streams.length === 0) {
      throw new BadRequestException(
        'Must provide at least one of: userId, roles or broadcast=true',
      );
    }

    return merge(...streams);
  }
}

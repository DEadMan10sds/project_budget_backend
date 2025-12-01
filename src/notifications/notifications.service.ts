import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NotificationsService implements OnModuleDestroy {
  private userStreams = new Map<string, Subject<any>>();
  private roleStreams = new Map<string, Subject<any>>();
  private broadcastStream = new Subject<any>();

  private getStream(map: Map<string, Subject<any>>, key: string): Subject<any> {
    if (!map.has(key)) {
      map.set(key, new Subject<any>());
    }

    const stream = map.get(key);
    if (!stream) {
      throw new Error(`Failed to create or retrieve stream for key: ${key}`);
    }

    return stream;
  }

  // Streams
  getUserStream(userId: string): Observable<any> {
    return this.getStream(this.userStreams, userId).asObservable();
  }

  getRoleStream(role: string): Observable<any> {
    return this.getStream(this.roleStreams, role).asObservable();
  }

  getBroadcastStream(): Observable<any> {
    return this.broadcastStream.asObservable();
  }

  // Notificaciones
  notifyUser(userIds: string | string[], data: any) {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    for (const id of ids) {
      this.userStreams.get(id)?.next({ type: 'user', userId: id, data });
    }
  }

  notifyRole(roles: string | string[], data: any) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    for (const role of roleList) {
      this.roleStreams.get(role)?.next({ type: 'role', role, data });
    }
  }

  notifyBroadcast(data: any) {
    this.broadcastStream.next({ type: 'broadcast', data });
  }

  onModuleDestroy() {
    for (const stream of this.userStreams.values()) stream.complete();
    for (const stream of this.roleStreams.values()) stream.complete();
    this.broadcastStream.complete();
  }
}

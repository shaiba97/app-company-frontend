import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';
import { WsService } from './ws.service';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  readonly #http = inject(HttpClient);
  readonly #auth = inject(AuthService);
  readonly #ws = inject(WsService);

  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadCount = signal(0);

  #pollTimer: ReturnType<typeof setInterval> | null = null;
  #cleanup: (() => void) | null = null;

  async init(): Promise<void> {
    await this.fetch();
    this.#listen();
    this.#startPolling();
  }

  #listen(): void {
    const userId = this.#auth.currentUser()?.id;
    if (!userId) return;

    this.#cleanup = this.#ws.on<NotificationItem>('notification:new', (n) => {
      this.notifications.update(list => [n, ...list]);
      if (!n.isRead) this.unreadCount.update(c => c + 1);
    });
  }

  #startPolling(): void {
    this.#pollTimer = setInterval(() => this.fetch(), 15000);
  }

  stopPolling(): void {
    if (this.#pollTimer) clearInterval(this.#pollTimer);
    this.#pollTimer = null;
    this.#cleanup?.();
  }

  async fetch(): Promise<void> {
    try {
      const [list, { count }] = await Promise.all([
        firstValueFrom(this.#http.get<{ notifications: NotificationItem[]; unreadCount: number }>(
          `${environment.apiUrl.company}/notifications?limit=30`,
        )),
        firstValueFrom(this.#http.get<{ count: number }>(
          `${environment.apiUrl.company}/notifications/unread-count`,
        )),
      ]);
      this.notifications.set(list.notifications);
      this.unreadCount.set(count);
    } catch {}
  }

  async markAsRead(id: string): Promise<void> {
    await firstValueFrom(this.#http.patch(`${environment.apiUrl.company}/notifications/${id}/read`, {}));
    this.notifications.update(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
    this.unreadCount.update(c => Math.max(0, c - 1));
  }

  async markAllAsRead(): Promise<void> {
    await firstValueFrom(this.#http.patch(`${environment.apiUrl.company}/notifications/read-all`, {}));
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    this.unreadCount.set(0);
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.#http.delete(`${environment.apiUrl.company}/notifications/${id}`));
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  async clearAll(): Promise<void> {
    await firstValueFrom(this.#http.delete(`${environment.apiUrl.company}/notifications/clear-all`));
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
}

import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBell, LucideBellOff, LucideLoaderCircle, LucideAlertCircle, LucideRefreshCw, LucideArrowLeft, LucideCheck, LucideCheckCheck } from '@lucide/angular';
import { NotificationsService } from '../../../core/services/notifications.service';
import { toArabicNumerals, formatArabicDate } from '../../../pipes/arabic-number/arabic-number.util';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, LucideBell, LucideBellOff, LucideLoaderCircle, LucideAlertCircle, LucideRefreshCw, LucideArrowLeft, LucideCheck, LucideCheckCheck],
  templateUrl: './notifications.html',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  protected readonly svc = inject(NotificationsService);

  notifications = this.svc.notifications;
  unreadCount = this.svc.unreadCount;
  isLoading = computed(() => this.svc.notifications().length === 0);
  error = signal<string>('');

  ngOnInit() {
    this.svc.init();
  }

  ngOnDestroy() {
    this.svc.stopPolling();
  }

  load() { this.svc.fetch(); }
  markRead(id: string) { this.svc.markAsRead(id); }
  markAllRead() { this.svc.markAllAsRead(); }
  toArabic = (n: number | string) => toArabicNumerals(n);
  fmtDate = (d: string) => formatArabicDate(d);
}

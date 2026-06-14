import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../core/services/auth';
import { WsService } from '../../core/services/ws.service';
import { NotificationService, NotificationItem } from '../../core/services/notification.service';
import { LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideBell, LucideBellOff } from '@lucide/angular';
import { ThemeService } from '../../core/services/theme';
import { toArabicNumerals, formatArabicDate } from '../../pipes/arabic-number/arabic-number.util';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector:    'app-layout',
  imports:     [RouterOutlet, RouterLink, RouterLinkActive, SidebarComponent, LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideBell, LucideBellOff],
  templateUrl: './layout.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = signal<boolean>(false);
  toggleSidebar = () => this.sidebarOpen.update(v => !v);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private ws = inject(WsService);
  private notificationSvc = inject(NotificationService);
  private wsCleanups: (() => void)[] = [];

  showNotifications = signal<boolean>(false);
  unreadCount = signal<number>(0);
  notifications = signal<NotificationItem[]>([]);
  loadingNotifs = signal(false);

  navItems: NavItem[] = [
    { path: '/dashboard',  label: 'الرئيسية', icon: 'layout-dashboard' },
    { path: '/buses',      label: 'الحافلات', icon: 'bus' },
    { path: '/trips',      label: 'الرحلات',  icon: 'route' },
    { path: '/financials', label: 'المالية',  icon: 'wallet' },
    { path: '/profile',    label: 'الشخصية',  icon: 'user' },
  ];

  toArabic = (n: number | string) => toArabicNumerals(n);
  fmtDate = (d: string) => formatArabicDate(d);

  ngOnInit() {
    this.loadNotifications();
    this.wsCleanups.push(this.ws.on('notification:new', () => this.loadNotifications()));
  }

  ngOnDestroy() { this.wsCleanups.forEach(fn => fn()); }

  loadNotifications() {
    this.notificationSvc.findAll().subscribe({
      next: r => {
        this.notifications.set(r.notifications);
        this.unreadCount.set(r.unreadCount);
        this.loadingNotifs.set(false);
      },
    });
  }

  markRead(id: string) {
    this.notificationSvc.markRead(id).subscribe(() => this.loadNotifications());
  }

  markAllRead() {
    this.notificationSvc.markAllRead().subscribe(() => this.loadNotifications());
  }
}
import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideSun, LucideMoon, LucideLogOut, LucideX, LucideBell } from '@lucide/angular';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification.service';

interface NavItem {
  path:  string;
  label: string;
}

@Component({
  selector:    'app-sidebar',
  standalone:  true,
  imports:     [RouterLink, RouterLinkActive, LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideSun, LucideMoon, LucideLogOut, LucideX, LucideBell],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  isOpen       = input<boolean>(false);
  closeSidebar = output<void>();
  themeService = inject(ThemeService);
  authService  = inject(AuthService);
  private notificationSvc = inject(NotificationService);

  unreadCount = signal(0);

  navItems: NavItem[] = [
    { path: '/dashboard',  label: 'الرئيسية' },
    { path: '/buses',      label: 'الحافلات' },
    { path: '/trips',      label: 'الرحلات' },
    { path: '/financials', label: 'المالية' },
    { path: '/notifications', label: 'الإشعارات' },
    { path: '/profile',   label: 'الشخصية' },
  ];

  ngOnInit() {
    this.notificationSvc.getUnreadCount().subscribe({
      next: r => this.unreadCount.set(r.count),
    });
  }
}
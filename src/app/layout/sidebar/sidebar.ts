import { Component, input, output, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideSun, LucideMoon, LucideLogOut, LucideX, LucideBell } from '@lucide/angular';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';
import { NotificationsService } from '../../core/services/notifications.service';

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
export class SidebarComponent {
  isOpen       = input<boolean>(false);
  closeSidebar = output<void>();
  themeService = inject(ThemeService);
  authService  = inject(AuthService);
  protected readonly notifSvc = inject(NotificationsService);

  unreadCount = computed(() => this.notifSvc.unreadCount());

  navItems: NavItem[] = [
    { path: '/dashboard',  label: 'الرئيسية' },
    { path: '/buses',      label: 'الحافلات' },
    { path: '/trips',      label: 'الرحلات' },
    { path: '/financials', label: 'المالية' },
    { path: '/notifications', label: 'الإشعارات' },
    { path: '/profile',   label: 'الشخصية' },
  ];
}
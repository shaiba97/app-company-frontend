import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../core/services/auth';
import { NotificationsService } from '../../core/services/notifications.service';
import { LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideBell } from '@lucide/angular';
import { ThemeService } from '../../core/services/theme';
import { toArabicNumerals } from '../../pipes/arabic-number/arabic-number.util';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector:    'app-layout',
  imports:     [RouterOutlet, RouterLink, RouterLinkActive, SidebarComponent, LucideLayoutDashboard, LucideBus, LucideRoute, LucideWallet, LucideUser, LucideBell],
  templateUrl: './layout.html',
})
export class LayoutComponent implements OnInit {
  sidebarOpen = signal<boolean>(false);
  toggleSidebar = () => this.sidebarOpen.update(v => !v);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  protected readonly notifSvc = inject(NotificationsService);

  unreadCount = computed(() => this.notifSvc.unreadCount());

  navItems: NavItem[] = [
    { path: '/dashboard',  label: 'الرئيسية', icon: 'layout-dashboard' },
    { path: '/buses',      label: 'الحافلات', icon: 'bus' },
    { path: '/trips',      label: 'الرحلات',  icon: 'route' },
    { path: '/financials', label: 'المالية',  icon: 'wallet' },
    { path: '/notifications', label: 'الإشعارات', icon: 'bell' },
    { path: '/profile',    label: 'الشخصية',  icon: 'user' },
  ];

  toArabic = (n: number | string) => toArabicNumerals(n);

  ngOnInit() {
    this.notifSvc.init();
  }
}
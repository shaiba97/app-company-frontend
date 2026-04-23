import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';

interface NavItem {
  path:  string;
  label: string;
  icon:  string;
}

@Component({
  selector:    'app-sidebar',
  standalone:  true,
  imports:     [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  isOpen       = input<boolean>(false);
  closeSidebar = output<void>();
  themeService = inject(ThemeService);
  authService  = inject(AuthService);

  navItems: NavItem[] = [
    { path: '/dashboard',  label: 'الرئيسية',         icon: '📊' },
    { path: '/buses',      label: 'الحافلات',          icon: '🚌' },
    { path: '/trips',      label: 'الرحلات',           icon: '🗺️' },
    { path: '/financials', label: 'التقارير المالية', icon: '💰' },
    { path: '/profile',   label: 'الملف الشخصي',    icon: '👤' },
  ];
}
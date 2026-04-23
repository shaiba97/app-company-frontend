import { Component, output, inject, computed, signal, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../core/services/auth';

@Component({
  selector:    'app-topbar',
  standalone:  true,
  templateUrl: './topbar.html',
})
export class TopbarComponent {
  toggleSidebar  = output<void>();
  themeService   = inject(ThemeService);
  authService    = inject(AuthService);
  private router = inject(Router);

  showNotifications = signal<boolean>(false);
  showUserMenu      = signal<boolean>(false);
  unreadCount       = signal<number>(0);

  private pageMap: Record<string, { title: string; icon: string }> = {
    '/dashboard':  { title: 'الرئيسية',         icon: '📊' },
    '/buses':      { title: 'الحافلات',          icon: '🚌' },
    '/trips':      { title: 'الرحلات',           icon: '🗺️' },
    '/tickets':    { title: 'التذاكر',           icon: '🎫' },
    '/bookings':   { title: 'الحجوزات',         icon: '📅' },
    '/financials': { title: 'التقارير المالية', icon: '💰' },
    '/profile':    { title: 'الملف الشخصي',    icon: '👤' },
  };

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  currentPageTitle = computed(() => {
    const url = this.currentUrl() ?? '/dashboard';
    const key = Object.keys(this.pageMap).find(k => url.startsWith(k)) ?? '/dashboard';
    return this.pageMap[key].title;
  });

  currentPageIcon = computed(() => {
    const url = this.currentUrl() ?? '/dashboard';
    const key = Object.keys(this.pageMap).find(k => url.startsWith(k)) ?? '/dashboard';
    return this.pageMap[key].icon;
  });

  companyName = computed(() => this.authService.companyName());

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const t = e.target as HTMLElement;
    if (!t.closest('[data-dropdown]')) {
      this.showNotifications.set(false);
      this.showUserMenu.set(false);
    }
  }
}
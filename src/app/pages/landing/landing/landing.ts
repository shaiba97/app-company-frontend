import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LucideLogIn } from '@lucide/angular';

interface Benefit {
  title: string;
  desc: string;
  icon: 'clock' | 'seats' | 'manual' | 'central' | 'reports' | 'reach';
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, NgOptimizedImage, LucideLogIn],
  templateUrl: './landing.html',
})
export class LandingComponent {
  readonly benefits: Benefit[] = [
    { title: 'حجوزات على مدار الساعة', desc: 'المسافر يحجز دون انتظار ساعات عمل المكتب.', icon: 'clock' },
    { title: 'عرض الرحلات والمقاعد', desc: 'رحلاتك ومقاعدك ظاهرة رقمياً للبحث والاختيار.', icon: 'seats' },
    { title: 'تقليل العمل اليدوي', desc: 'تقليل الاعتماد على المكالمات والسجلات الورقية.', icon: 'manual' },
    { title: 'إدارة مركزية للحجوزات', desc: 'إدارة الحجوزات وبيانات المسافرين من نظام واحد.', icon: 'central' },
    { title: 'بيانات وتقارير أوضح', desc: 'رؤية أوضح للحجوزات والرحلات والأداء.', icon: 'reports' },
    { title: 'وصول أكبر للعملاء', desc: 'رحلاتك قابلة للاكتشاف خارج مكتب التذاكر.', icon: 'reach' },
  ];
}

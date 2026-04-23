import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Bus {
  id: string;
  name: string;
  chairs: number;
  seatStartFrom: 'LEFT' | 'RIGHT';
  plate: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-buses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './buses.html',
})
export class BusesComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3001/api';

  buses = signal<Bus[]>([]);
  showForm = signal(false);
  editingBus = signal<Bus | null>(null);
  loading = signal(false);

  formData = signal({
    name: '',
    chairs: 0,
    seatStartFrom: 'RIGHT' as 'LEFT' | 'RIGHT',
  });

  constructor() {
    this.loadBuses();
  }

  private getBuses() {
    return this.http.get<Bus[]>(`${this.apiUrl}/buses/get-buses`);
  }

  private createBus(data: Partial<Bus>) {
    return this.http.post<Bus>(`${this.apiUrl}/buses/post-bus`, data);
  }

  private updateBus(id: string, data: Partial<Bus>) {
    return this.http.patch<Bus>(`${this.apiUrl}/buses/update-bus/${id}`, data);
  }

  private removeBus(id: string) {
    return this.http.delete(`${this.apiUrl}/buses/delete-bus/${id}`);
  }

  loadBuses() {
    this.getBuses().subscribe({
      next: (buses: Bus[]) => this.buses.set(buses),
      error: () => {},
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }

  openCreateForm() {
    this.editingBus.set(null);
    this.formData.set({
      name: '',
      chairs: 0,
      seatStartFrom: 'RIGHT',
    });
    this.showForm.set(true);
  }

  openEditForm(bus: Bus) {
    this.editingBus.set(bus);
    this.formData.set({
      name: bus.name,
      chairs: bus.chairs,
      seatStartFrom: bus.seatStartFrom,
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingBus.set(null);
    this.formData.set({
      name: '',
      chairs: 0,
      seatStartFrom: 'RIGHT',
    });
  }

  submitForm() {
    const data = this.formData();
    if (!data.name || !data.chairs) return;

    this.loading.set(true);

    const request = this.editingBus()
      ? this.updateBus(this.editingBus()!.id, data)
      : this.createBus(data);

    request.subscribe({
      next: () => {
        this.loadBuses();
        this.closeForm();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  removeBusItem(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الحاقية؟')) return;

    this.removeBus(id).subscribe({
      next: () => {
        const currentBuses = this.buses();
        this.buses.set(currentBuses.filter(b => b.id !== id));
      },
      error: () => {},
    });
  }

  goToBusDetails(busId: string) {
    this.router.navigate(['/buses/bus', busId]);
  }
}
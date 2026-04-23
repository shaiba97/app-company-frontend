import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Trip {
  id: string;
  busId: string;
  fromCity: string;
  fromStation: string;
  toCity: string;
  toStation: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  availableChairs: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTripsByProperty(property: string, value: string) {
    return this.http.get<Trip[]>(
      `${this.apiUrl}/buses/get-trips/property/${property}/value/${value}`
    );
  }

  getTripsByBusId(busId: string) {
    return this.http.get<Trip[]>(
      `${this.apiUrl}/buses/get-trips/property/busId/value/${busId}`
    );
  }
}
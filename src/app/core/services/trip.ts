import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface Trip {
  id: string;
  busId: string;
  fromState: string;
  toState: string;
  fromCity: string;
  fromStation: string;
  toCity: string;
  toStation: string;
  departureDate: any;
  departureTime: any;
  arrivalDate: any;
  arrivalTime: any;
  price: number;
  availableChairs: number;
  status: string;
  bus?: {
    id: string;
    name: string;
    chairs: number;
    seatStartFrom: string;
    plate: {
      arabic: string;
      english: string;
      numbers: string;
    };
  };
  bookings?: Booking[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  seatNumber: number;
  status: string;
}

export interface CreateTripData {
  fromState: string;
  toState: string;
  fromCity: string;
  fromStation: string;
  toCity: string;
  toStation: string;
  departureDate: any;
  departureTime: any;
  arrivalDate: any;
  arrivalTime: any;
  price: number;
  status: string;
  busId: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl.company;

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/trips/get-trips`);
  }


  getTripsByProperty(property: string, value: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(
      `${this.apiUrl}/trips/get-trips/property/${property}/value/${value}`
    );
  }

  getTripByProperty(property: string, value: string): Observable<Trip> {
    return this.http.get<Trip>(
      `${this.apiUrl}/trips/get-trip/property/${property}/value/${value}`
    );
  }

  createTrip(data: CreateTripData): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiUrl}/trips/post-trip`, data);
  }

  updateTrip(id: string, data: Partial<Trip>): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/trips/update-trip/${id}`, data);
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/trips/delete-trip/${id}`);
  }
}
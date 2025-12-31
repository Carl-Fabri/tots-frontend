import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReservationsResponse,
  ReservationResponse,
  CreateReservationRequest,
  UpdateReservationRequest
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getReservations(filters?: {
    space_id?: number;
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Observable<ReservationsResponse> {
    let params = new HttpParams();
    if (filters?.space_id) {
      params = params.set('space_id', filters.space_id.toString());
    }
    if (filters?.start_date) {
      params = params.set('start_date', filters.start_date);
    }
    if (filters?.end_date) {
      params = params.set('end_date', filters.end_date);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    return this.http.get<ReservationsResponse>(`${this.apiUrl}/reservations`, { params });
  }

  getReservation(id: number): Observable<ReservationResponse> {
    return this.http.get<ReservationResponse>(`${this.apiUrl}/reservations/${id}`);
  }

  getCalendarReservations(startDate: string, endDate: string, spaceId?: number): Observable<ReservationsResponse> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);
    if (spaceId) {
      params = params.set('space_id', spaceId.toString());
    }
    return this.http.get<ReservationsResponse>(`${this.apiUrl}/reservations/calendar`, { params });
  }

  createReservation(reservation: CreateReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.apiUrl}/reservations`, reservation);
  }

  updateReservation(id: number, reservation: UpdateReservationRequest): Observable<ReservationResponse> {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/reservations/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`);
  }
}


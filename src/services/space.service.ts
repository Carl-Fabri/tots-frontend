import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpacesResponse, SpaceResponse, Space } from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getSpaces(isActive?: boolean): Observable<SpacesResponse> {
    let params = new HttpParams();
    if (isActive !== undefined) {
      params = params.set('is_active', isActive.toString());
    }
    return this.http.get<SpacesResponse>(`${this.apiUrl}/spaces`, { params });
  }

  getSpace(id: number): Observable<SpaceResponse> {
    return this.http.get<SpaceResponse>(`${this.apiUrl}/spaces/${id}`);
  }

  createSpace(space: Partial<Space>): Observable<SpaceResponse> {
    return this.http.post<SpaceResponse>(`${this.apiUrl}/spaces`, space);
  }

  updateSpace(id: number, space: Partial<Space>): Observable<SpaceResponse> {
    return this.http.put<SpaceResponse>(`${this.apiUrl}/spaces/${id}`, space);
  }

  deleteSpace(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/spaces/${id}`);
  }
}


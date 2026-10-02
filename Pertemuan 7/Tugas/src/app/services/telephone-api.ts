import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Telephone, TelephoneRequest } from '../models/telephone';

@Injectable({ providedIn: 'root' })
export class TelephoneApi {
  private http = inject(HttpClient);
  private baseUrl = '/api/Telephone';

  getAll() {
    return this.http.get<Telephone[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Telephone>(`${this.baseUrl}/${id}`);
  }

  create(data: TelephoneRequest) {
    return this.http.post<Telephone>(this.baseUrl, data);
  }

  update(id: number, data: TelephoneRequest) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

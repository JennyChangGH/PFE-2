import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Mahasiswa, MahasiswaRequest } from '../models/mahasiswa';

@Injectable({ providedIn: 'root' })
export class MahasiswaApi {
  private http = inject(HttpClient);
  private baseUrl = '/api/Pertemuan6';

  getAll() {
    return this.http.get<Mahasiswa[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Mahasiswa>(`${this.baseUrl}/${id}`);
  }

  create(data: MahasiswaRequest) {
    return this.http.post<Mahasiswa>(this.baseUrl, data);
  }

  update(id: number, data: MahasiswaRequest) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

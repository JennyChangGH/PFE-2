import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodoApi {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  getAll() {
    return this.http.get<Todo[]>(this.baseUrl);
  }
}

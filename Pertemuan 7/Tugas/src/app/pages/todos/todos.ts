import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodoApi } from '../../services/todo-api';

type StatusFilter = 'semua' | 'selesai' | 'belum';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.html',
  styleUrl: './todos.css',
})
export class TodosPage {
  private api = inject(TodoApi);

  items = signal<Todo[]>([]);
  loaded = signal(false);
  loading = signal(false);
  error = signal('');
  keyword = signal('');
  status = signal<StatusFilter>('semua');

  totalSelesai = computed(() => this.items().filter((t) => t.completed).length);

  filtered = computed(() => {
    const q = this.keyword().trim().toLowerCase();
    const status = this.status();
    return this.items().filter(
      (t) =>
        (status === 'semua' || t.completed === (status === 'selesai')) &&
        (!q || t.title.toLowerCase().includes(q)),
    );
  });

  tampilkan(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 0
            ? 'Gagal memuat data todos: periksa koneksi internet.'
            : `Gagal memuat data todos (${err.status}).`,
        );
        this.loading.set(false);
      },
    });
  }

  sembunyikan(): void {
    this.items.set([]);
    this.loaded.set(false);
    this.keyword.set('');
    this.status.set('semua');
  }
}

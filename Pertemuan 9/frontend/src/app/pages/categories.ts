import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { API_URL } from '../core/config';
import { errorMessage } from '../core/util';

interface Category {
  id: number;
  name: string;
}
interface CategoryForm {
  id: number | null;
  name: string;
}

const URL = `${API_URL}/categories`;

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  template: `
    <div class="page-head">
      <h1>Kategori</h1>
      @if (priv()?.create) {
        <button class="btn primary" (click)="add()">+ Tambah</button>
      }
    </div>

    @if (error()) {
      <div class="alert">{{ error() }}</div>
    }

    @if (form(); as f) {
      <form class="card form" (ngSubmit)="save(f)">
        <h3>{{ f.id ? 'Edit' : 'Tambah' }} Kategori</h3>
        <label>Nama <input name="name" [(ngModel)]="f.name" required /></label>
        <div class="actions">
          <button class="btn primary">Simpan</button>
          <button type="button" class="btn" (click)="form.set(null)">Batal</button>
        </div>
      </form>
    }

    <div class="card">
      <table>
        <thead><tr><th>#</th><th>Nama</th>@if (showActions()) { <th>Aksi</th> }</tr></thead>
        <tbody>
          @for (c of items(); track c.id) {
            <tr>
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              @if (showActions()) {
                <td class="actions">
                  @if (priv()?.update) { <button class="btn sm" (click)="edit(c)">Edit</button> }
                  @if (priv()?.delete) { <button class="btn sm danger" (click)="remove(c)">Hapus</button> }
                </td>
              }
            </tr>
          } @empty {
            <tr><td colspan="3">Belum ada data.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Categories {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  protected readonly priv = computed(() => this.auth.privilegeFor('/categories'));
  protected readonly showActions = computed(() => !!(this.priv()?.update || this.priv()?.delete));
  protected readonly items = signal<Category[]>([]);
  protected readonly form = signal<CategoryForm | null>(null);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  private async run(action: () => Promise<unknown>) {
    this.error.set('');
    try {
      await action();
    } catch (e) {
      this.error.set(errorMessage(e));
    }
  }

  protected load() {
    return this.run(async () => this.items.set(await firstValueFrom(this.http.get<Category[]>(URL))));
  }

  protected add() {
    this.form.set({ id: null, name: '' });
  }

  protected edit(c: Category) {
    this.form.set({ id: c.id, name: c.name });
  }

  protected save(f: CategoryForm) {
    return this.run(async () => {
      const body = { name: f.name };
      await firstValueFrom(f.id ? this.http.put(`${URL}/${f.id}`, body) : this.http.post(URL, body));
      this.form.set(null);
      await this.load();
    });
  }

  protected remove(c: Category) {
    if (!confirm(`Hapus kategori "${c.name}"?`)) return;
    return this.run(async () => {
      await firstValueFrom(this.http.delete(`${URL}/${c.id}`));
      await this.load();
    });
  }
}

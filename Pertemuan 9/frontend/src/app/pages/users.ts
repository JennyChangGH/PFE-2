import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { API_URL } from '../core/config';
import { errorMessage } from '../core/util';

interface User {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
}
interface UserForm {
  id: number | null;
  username: string;
  fullName: string;
  password: string;
  isActive: boolean;
}

const URL = `${API_URL}/users`;

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  template: `
    <div class="page-head">
      <h1>Manajemen User</h1>
      @if (priv()?.create) {
        <button class="btn primary" (click)="add()">+ Tambah</button>
      }
    </div>

    @if (error()) {
      <div class="alert">{{ error() }}</div>
    }

    @if (form(); as f) {
      <form class="card form" (ngSubmit)="save(f)">
        <h3>{{ f.id ? 'Edit' : 'Tambah' }} User</h3>
        <label>Username <input name="username" [(ngModel)]="f.username" [disabled]="!!f.id" required /></label>
        <label>Nama lengkap <input name="fullName" [(ngModel)]="f.fullName" required /></label>
        <label>Password {{ f.id ? '(kosongkan bila tidak diubah)' : '' }}
          <input name="password" type="password" [(ngModel)]="f.password" [required]="!f.id" minlength="6" autocomplete="new-password" />
        </label>
        <label class="check"><input name="isActive" type="checkbox" [(ngModel)]="f.isActive" /> Aktif</label>
        <div class="actions">
          <button class="btn primary">Simpan</button>
          <button type="button" class="btn" (click)="form.set(null)">Batal</button>
        </div>
      </form>
    }

    <div class="card">
      <table>
        <thead>
          <tr><th>#</th><th>Username</th><th>Nama</th><th>Status</th>@if (showActions()) { <th>Aksi</th> }</tr>
        </thead>
        <tbody>
          @for (u of items(); track u.id) {
            <tr>
              <td>{{ u.id }}</td>
              <td>{{ u.username }}</td>
              <td>{{ u.fullName }}</td>
              <td>{{ u.isActive ? 'Aktif' : 'Nonaktif' }}</td>
              @if (showActions()) {
                <td class="actions">
                  @if (priv()?.update) { <button class="btn sm" (click)="edit(u)">Edit</button> }
                  @if (priv()?.delete) { <button class="btn sm danger" (click)="remove(u)">Hapus</button> }
                </td>
              }
            </tr>
          } @empty {
            <tr><td colspan="5">Belum ada data.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Users {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  protected readonly priv = computed(() => this.auth.privilegeFor('/users'));
  protected readonly showActions = computed(() => !!(this.priv()?.update || this.priv()?.delete));
  protected readonly items = signal<User[]>([]);
  protected readonly form = signal<UserForm | null>(null);
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
    return this.run(async () => this.items.set(await firstValueFrom(this.http.get<User[]>(URL))));
  }

  protected add() {
    this.form.set({ id: null, username: '', fullName: '', password: '', isActive: true });
  }

  protected edit(u: User) {
    this.form.set({ id: u.id, username: u.username, fullName: u.fullName, password: '', isActive: u.isActive });
  }

  protected save(f: UserForm) {
    return this.run(async () => {
      await firstValueFrom(
        f.id
          ? this.http.put(`${URL}/${f.id}`, { fullName: f.fullName, isActive: f.isActive, password: f.password || null })
          : this.http.post(URL, { username: f.username, password: f.password, fullName: f.fullName, isActive: f.isActive }),
      );
      this.form.set(null);
      await this.load();
    });
  }

  protected remove(u: User) {
    if (!confirm(`Hapus user "${u.username}"?`)) return;
    return this.run(async () => {
      await firstValueFrom(this.http.delete(`${URL}/${u.id}`));
      await this.load();
    });
  }
}

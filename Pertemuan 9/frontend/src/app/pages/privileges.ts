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
}
interface PrivilegeRow {
  menuId: number;
  menuName: string;
  parentName: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

type Flag = 'read' | 'create' | 'update' | 'delete';

@Component({
  selector: 'app-privileges',
  imports: [FormsModule],
  template: `
    <div class="page-head">
      <h1>Hak Akses</h1>
    </div>

    @if (error()) {
      <div class="alert">{{ error() }}</div>
    }
    @if (info()) {
      <div class="alert ok">{{ info() }}</div>
    }

    <div class="card">
      <label class="inline">User
        <select [ngModel]="userId()" (ngModelChange)="selectUser($event)">
          <option [ngValue]="null">- Pilih user -</option>
          @for (u of users(); track u.id) {
            <option [ngValue]="u.id">{{ u.fullName }} ({{ u.username }})</option>
          }
        </select>
      </label>
    </div>

    @if (userId() !== null) {
      <div class="card">
        <table>
          <thead>
            <tr><th>Parent</th><th>Menu</th><th>Read</th><th>Create</th><th>Update</th><th>Delete</th></tr>
          </thead>
          <tbody>
            @for (r of rows(); track r.menuId) {
              <tr>
                <td>{{ r.parentName }}</td>
                <td>{{ r.menuName }}</td>
                @for (f of flags; track f) {
                  <td>
                    <input type="checkbox" [checked]="r[f]" [disabled]="!canEdit()" (change)="toggle(r, f, $any($event.target).checked)" />
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
        @if (canEdit()) {
          <div class="actions pad">
            <button class="btn primary" (click)="save()">Simpan</button>
          </div>
        }
        <p class="hint">Create / Update / Delete otomatis mengaktifkan Read. Menu parent tampil sendiri bila ada child yang boleh diakses.</p>
      </div>
    }
  `,
})
export class Privileges {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  protected readonly flags: Flag[] = ['read', 'create', 'update', 'delete'];
  protected readonly canEdit = computed(() => !!this.auth.privilegeFor('/privileges')?.update);
  protected readonly users = signal<User[]>([]);
  protected readonly userId = signal<number | null>(null);
  protected readonly rows = signal<PrivilegeRow[]>([]);
  protected readonly error = signal('');
  protected readonly info = signal('');

  constructor() {
    this.run(async () => this.users.set(await firstValueFrom(this.http.get<User[]>(`${API_URL}/users`))));
  }

  private async run(action: () => Promise<unknown>) {
    this.error.set('');
    this.info.set('');
    try {
      await action();
    } catch (e) {
      this.error.set(errorMessage(e));
    }
  }

  protected selectUser(id: number | null) {
    this.userId.set(id);
    this.rows.set([]);
    if (id === null) return;
    return this.run(async () =>
      this.rows.set(await firstValueFrom(this.http.get<PrivilegeRow[]>(`${API_URL}/privileges/users/${id}`))),
    );
  }

  protected toggle(row: PrivilegeRow, flag: Flag, value: boolean) {
    row[flag] = value;
    if (value && flag !== 'read') row.read = true;
    if (!value && flag === 'read') {
      row.create = row.update = row.delete = false;
    }
    this.rows.update((r) => [...r]); // refresh checkbox lain pada baris yang sama
  }

  protected save() {
    const id = this.userId();
    if (id === null) return;
    return this.run(async () => {
      const body = this.rows().map((r) => ({
        menuId: r.menuId,
        read: r.read,
        create: r.create,
        update: r.update,
        delete: r.delete,
      }));
      await firstValueFrom(this.http.put(`${API_URL}/privileges/users/${id}`, body));
      if (id === this.auth.user()?.id) await this.auth.loadMenus(true); // menu sendiri ikut berubah
      this.info.set('Hak akses berhasil disimpan.');
    });
  }
}

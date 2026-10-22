import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { API_URL } from '../core/config';
import { errorMessage } from '../core/util';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number | null;
  categoryName: string | null;
}
interface Category {
  id: number;
  name: string;
}
interface ProductForm {
  id: number | null;
  name: string;
  price: number;
  stock: number;
  categoryId: number | null;
}

const URL = `${API_URL}/products`;

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: `
    <div class="page-head">
      <h1>Produk</h1>
      @if (priv()?.create) {
        <button class="btn primary" (click)="add()">+ Tambah</button>
      }
    </div>

    @if (error()) {
      <div class="alert">{{ error() }}</div>
    }

    @if (form(); as f) {
      <form class="card form" (ngSubmit)="save(f)">
        <h3>{{ f.id ? 'Edit' : 'Tambah' }} Produk</h3>
        <label>Nama <input name="name" [(ngModel)]="f.name" required /></label>
        <label>Harga <input name="price" type="number" min="0" [(ngModel)]="f.price" required /></label>
        <label>Stok <input name="stock" type="number" min="0" [(ngModel)]="f.stock" required /></label>
        <label>Kategori
          <select name="categoryId" [(ngModel)]="f.categoryId">
            <option [ngValue]="null">- Tanpa kategori -</option>
            @for (c of categories(); track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select>
        </label>
        <div class="actions">
          <button class="btn primary">Simpan</button>
          <button type="button" class="btn" (click)="form.set(null)">Batal</button>
        </div>
      </form>
    }

    <div class="card">
      <table>
        <thead>
          <tr><th>#</th><th>Nama</th><th>Kategori</th><th class="num">Harga</th><th class="num">Stok</th>@if (showActions()) { <th>Aksi</th> }</tr>
        </thead>
        <tbody>
          @for (p of items(); track p.id) {
            <tr>
              <td>{{ p.id }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.categoryName ?? '-' }}</td>
              <td class="num">{{ p.price }}</td>
              <td class="num">{{ p.stock }}</td>
              @if (showActions()) {
                <td class="actions">
                  @if (priv()?.update) { <button class="btn sm" (click)="edit(p)">Edit</button> }
                  @if (priv()?.delete) { <button class="btn sm danger" (click)="remove(p)">Hapus</button> }
                </td>
              }
            </tr>
          } @empty {
            <tr><td colspan="6">Belum ada data.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Products {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  protected readonly priv = computed(() => this.auth.privilegeFor('/products'));
  protected readonly showActions = computed(() => !!(this.priv()?.update || this.priv()?.delete));
  protected readonly items = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly form = signal<ProductForm | null>(null);
  protected readonly error = signal('');

  constructor() {
    this.load();
    this.run(async () =>
      this.categories.set(await firstValueFrom(this.http.get<Category[]>(`${API_URL}/categories`))),
    );
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
    return this.run(async () => this.items.set(await firstValueFrom(this.http.get<Product[]>(URL))));
  }

  protected add() {
    this.form.set({ id: null, name: '', price: 0, stock: 0, categoryId: null });
  }

  protected edit(p: Product) {
    this.form.set({ id: p.id, name: p.name, price: p.price, stock: p.stock, categoryId: p.categoryId });
  }

  protected save(f: ProductForm) {
    return this.run(async () => {
      const body = { name: f.name, price: f.price, stock: f.stock, categoryId: f.categoryId };
      await firstValueFrom(f.id ? this.http.put(`${URL}/${f.id}`, body) : this.http.post(URL, body));
      this.form.set(null);
      await this.load();
    });
  }

  protected remove(p: Product) {
    if (!confirm(`Hapus produk "${p.name}"?`)) return;
    return this.run(async () => {
      await firstValueFrom(this.http.delete(`${URL}/${p.id}`));
      await this.load();
    });
  }
}

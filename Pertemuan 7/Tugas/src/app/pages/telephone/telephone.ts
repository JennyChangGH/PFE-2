import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Telephone, TelephoneRequest } from '../../models/telephone';
import { TelephoneApi } from '../../services/telephone-api';

const emptyForm = (): TelephoneRequest => ({
  namaUser: '',
  alamat: '',
  noTelp: '',
  kodePost: '',
  dateTime: '',
});

@Component({
  selector: 'app-telephone',
  imports: [FormsModule, DatePipe],
  templateUrl: './telephone.html',
})
export class TelephonePage implements OnInit {
  private api = inject(TelephoneApi);

  items = signal<Telephone[]>([]);
  loading = signal(false);
  saving = signal(false);
  message = signal('');
  error = signal('');
  editId = signal<number | null>(null);
  keyword = signal('');

  form: TelephoneRequest = emptyForm();

  filtered = computed(() => {
    const q = this.keyword().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((t) =>
      [t.namaUser, t.alamat, t.noTelp, t.kodePost].some((v) => v?.toLowerCase().includes(q)),
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Gagal memuat data telephone', err);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (!this.form.namaUser.trim()) {
      this.error.set('Nama user wajib diisi.');
      return;
    }

    const payload: TelephoneRequest = {
      ...this.form,
      dateTime: this.form.dateTime || null,
    };
    const id = this.editId();
    const request: Observable<unknown> =
      id === null ? this.api.create(payload) : this.api.update(id, payload);

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.showMessage(
          id === null
            ? 'Data telephone berhasil ditambahkan.'
            : 'Data telephone berhasil diperbarui.',
        );
        this.resetForm();
        this.saving.set(false);
        this.load();
      },
      error: (err) => {
        this.showError('Gagal menyimpan data telephone', err);
        this.saving.set(false);
      },
    });
  }

  edit(item: Telephone): void {
    this.editId.set(item.id);
    this.form = {
      namaUser: item.namaUser,
      alamat: item.alamat,
      noTelp: item.noTelp,
      kodePost: item.kodePost,
      dateTime: item.dateTime ? item.dateTime.slice(0, 16) : '',
    };
    this.message.set('');
    this.error.set('');
  }

  remove(item: Telephone): void {
    if (!confirm(`Hapus data telephone "${item.namaUser}"?`)) return;

    this.api.delete(item.id).subscribe({
      next: () => {
        if (this.editId() === item.id) this.resetForm();
        this.showMessage('Data telephone berhasil dihapus.');
        this.load();
      },
      error: (err) => this.showError('Gagal menghapus data telephone', err),
    });
  }

  resetForm(): void {
    this.editId.set(null);
    this.form = emptyForm();
  }

  private showMessage(text: string): void {
    this.error.set('');
    this.message.set(text);
  }

  private showError(text: string, err: HttpErrorResponse): void {
    this.message.set('');
    this.error.set(
      err.status === 0 ? `${text}: API tidak dapat dihubungi.` : `${text} (${err.status}).`,
    );
  }
}

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Mahasiswa, MahasiswaRequest } from '../../models/mahasiswa';
import { MahasiswaApi } from '../../services/mahasiswa-api';

const emptyForm = (): MahasiswaRequest => ({
  nama: '',
  alamat: '',
  pesanpesan: '',
  dateTime: '',
});

@Component({
  selector: 'app-mahasiswa',
  imports: [FormsModule, DatePipe],
  templateUrl: './mahasiswa.html',
})
export class MahasiswaPage implements OnInit {
  private api = inject(MahasiswaApi);

  items = signal<Mahasiswa[]>([]);
  loading = signal(false);
  saving = signal(false);
  message = signal('');
  error = signal('');
  editId = signal<number | null>(null);
  keyword = signal('');

  form: MahasiswaRequest = emptyForm();

  filtered = computed(() => {
    const q = this.keyword().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((m) =>
      [m.nama, m.alamat, m.pesanpesan].some((v) => v?.toLowerCase().includes(q)),
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
        this.showError('Gagal memuat data mahasiswa', err);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (!this.form.nama.trim()) {
      this.error.set('Nama wajib diisi.');
      return;
    }

    const payload: MahasiswaRequest = {
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
            ? 'Data mahasiswa berhasil ditambahkan.'
            : 'Data mahasiswa berhasil diperbarui.',
        );
        this.resetForm();
        this.saving.set(false);
        this.load();
      },
      error: (err) => {
        this.showError('Gagal menyimpan data mahasiswa', err);
        this.saving.set(false);
      },
    });
  }

  edit(item: Mahasiswa): void {
    this.editId.set(item.id);
    this.form = {
      nama: item.nama,
      alamat: item.alamat,
      pesanpesan: item.pesanpesan,
      dateTime: item.dateTime ? item.dateTime.slice(0, 16) : '',
    };
    this.message.set('');
    this.error.set('');
  }

  remove(item: Mahasiswa): void {
    if (!confirm(`Hapus mahasiswa "${item.nama}"?`)) return;

    this.api.delete(item.id).subscribe({
      next: () => {
        if (this.editId() === item.id) this.resetForm();
        this.showMessage('Data mahasiswa berhasil dihapus.');
        this.load();
      },
      error: (err) => this.showError('Gagal menghapus data mahasiswa', err),
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

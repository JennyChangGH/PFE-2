import { HttpErrorResponse } from '@angular/common/http';

/** Ubah error HTTP menjadi pesan yang ramah untuk ditampilkan. */
export function errorMessage(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) return 'Tidak dapat terhubung ke server.';
    if (e.status === 403) return 'Anda tidak memiliki hak akses untuk aksi ini.';
    if (e.error?.message) return e.error.message;
  }
  return 'Terjadi kesalahan.';
}

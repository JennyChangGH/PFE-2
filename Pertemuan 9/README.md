# Sistem Menu Dinamis dan Hak Akses

Web API ASP.NET Core 8, Angular 21, dan MySQL/MariaDB. Pengguna login dengan JWT; hak akses baca, tambah, ubah, dan hapus diperiksa oleh API.

## Persiapan

- .NET 8 SDK
- Node.js dan npm
- MySQL atau MariaDB

### Database

Jalankan `database/schema.sql` melalui phpMyAdmin atau klien MySQL. **Skrip ini menghapus lalu membuat ulang tabel aplikasi**, sehingga jangan jalankan ulang jika ingin mempertahankan data yang sudah ada.

Koneksi lokal bawaan berada pada `ConnectionStrings:Default` di `backend/MenuApi/appsettings.json`. Jika MySQL memerlukan password, lebih aman atur koneksi melalui environment variable `ConnectionStrings__Default` daripada menyimpan password di Git.

### Backend dan Scalar

Buka PowerShell di folder `backend/MenuApi`:

```powershell
$bytes = New-Object byte[] 32
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:Jwt__Key = [Convert]::ToBase64String($bytes)
$rng.Dispose()
dotnet run
```

Profil `dotnet run` lokal mengatur environment ke `Development` dan URL ke `http://localhost:5000`. Signing key dibuat acak di terminal dan **tidak disimpan di repository**. Biarkan terminal backend tetap terbuka.

- Scalar: http://localhost:5000/scalar/v1
- OpenAPI JSON: http://localhost:5000/openapi/v1.json

Di Scalar, kirim `POST /api/auth/login`, lalu gunakan **Authorize** dengan token yang diterima untuk mencoba endpoint terlindungi.

### Frontend

Buka terminal terpisah di folder `frontend`:

```powershell
npm ci
npm start
```

Frontend tersedia di http://localhost:4200 dan menggunakan API di `http://localhost:5000/api` (diatur di `frontend/src/app/core/config.ts`).

## Akun contoh

Akun berikut dibuat oleh `database/schema.sql` untuk pengujian lokal:

| Username | Password | Hak akses |
|---|---|---|
| `admin` | `admin123` | Semua menu dan hak CRUD |
| `kasir` | `kasir123` | Produk: baca/tambah/ubah; kategori: baca |
| `viewer` | `viewer123` | Produk dan kategori: baca |

Jangan gunakan password contoh untuk deployment atau data sungguhan.

## Endpoint autentikasi

Login:

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Respons sukses berisi `token` dan `user`. Kirim token pada request yang memerlukan autentikasi:

```http
Authorization: Bearer <token>
```

Token berlaku 120 menit secara default. Refresh token dan pencabutan token di sisi server belum tersedia.

## Menambah menu

1. Tambahkan menu di tabel `table_menu` dan tetapkan hak akses.
2. Daftarkan halaman Angular dengan path yang sesuai di `frontend/src/app/app.routes.ts`.
3. Lindungi endpoint API dengan `[Authorize]` dan, bila perlu, `[RequirePrivilege(...)]`.

## Catatan sebelum deployment

Konfigurasi bawaan ditujukan untuk pengembangan lokal (HTTP, key JWT dari environment variable, dan akun contoh). Untuk deployment, gunakan HTTPS, secret yang dikelola di luar repository, kredensial database terpisah, serta ubah CORS agar hanya mengizinkan origin aplikasi yang benar.

# Sistem Menu Dinamis (Parent–Child) + Hak Akses User

ASP.NET Core 8 (Web API) + Angular 21 + SQL Server.

## Konsep (sesuai catatan papan tulis)

| Tabel | Kolom |
|---|---|
| `table_user` | id, username, password_hash, full_name, is_active |
| `table_menu` | id, menu_name, url_menu, parent_id, sort_order, is_active |
| `table_privilege_user` | id, id_user, id_menu, is_active, can_read, can_create, can_update, can_delete |

- Menu **parent**: `parent_id = 0`, `url_menu = '#'` (hanya pengelompok, tidak punya halaman).
- Menu **child**: `parent_id` = `id` menu parent-nya.
- Menu tampil di sidebar bila user punya privilege **read** aktif; parent tampil bila punya child yang tampil.
- Aksi create / update / delete diperiksa di backend (`[RequirePrivilege("/products", PrivilegeAction.Create)]`)
  dan tombolnya disembunyikan di frontend sesuai privilege.

## Menjalankan

1. **Database** (MySQL/MariaDB, mis. XAMPP/Laragon): nyalakan MySQL, buka phpMyAdmin →
   tab **Import** → pilih `database/schema.sql` → Kirim. Database `db_menu_privilege` terbentuk otomatis.
2. **Backend** (butuh .NET 8 SDK): `cd backend\MenuApi` lalu `dotnet run` → http://localhost:5000
   Koneksi DB diatur di `appsettings.json` → `ConnectionStrings:Default`
   (default: `Server=localhost;Port=3306;Database=db_menu_privilege;User=root;Password=;`).
   Bila root punya password, isi `Password=`. Bila server MySQL asli (bukan MariaDB), ubah `MariaDbServerVersion`
   di `Program.cs` menjadi `new MySqlServerVersion(new Version(8, 0, 36))`.
3. **Frontend**: `cd frontend` → `npm install` → `npm start` → http://localhost:4200

## Akun contoh

| Username | Password | Hak akses |
|---|---|---|
| admin | admin123 | semua menu, CRUD penuh |
| kasir | kasir123 | Produk: read/create/update · Kategori: read |
| viewer | viewer123 | Produk & Kategori: read saja |

## Menambah menu baru

1. Tambah baris di `table_menu` (child: isi `parent_id`).
2. Beri privilege di halaman **Hak Akses**.
3. Buat halaman Angular dan daftarkan route dengan path = `url_menu` (tanpa `/`) di `app.routes.ts`.
4. Di controller pakai `[RequirePrivilege("<url_menu>", ...)]`.

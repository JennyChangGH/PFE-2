-- =====================================================================
-- Database : db_menu_privilege  (MySQL / MariaDB)
-- Cara pakai: phpMyAdmin -> tab "Import" -> pilih file ini -> Kirim
--             (database dibuat otomatis oleh script ini)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS db_menu_privilege
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_menu_privilege;

-- ---------- reset (aman dijalankan ulang) ----------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS table_privilege_user;
DROP TABLE IF EXISTS table_product;
DROP TABLE IF EXISTS table_category;
DROP TABLE IF EXISTS table_menu;
DROP TABLE IF EXISTS table_user;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------- 1. table_user ----------
CREATE TABLE table_user (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,            -- BCrypt
    full_name     VARCHAR(100) NOT NULL,
    is_active     TINYINT(1)   NOT NULL DEFAULT 1
);

-- ---------- 2. table_menu ----------
-- Parent  : parent_id = 0, url_menu = '#'
-- Submenu : parent_id mengacu ke id menu parent
-- (parent_id tidak diberi FOREIGN KEY karena parent memakai nilai 0)
CREATE TABLE table_menu (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    menu_name  VARCHAR(100) NOT NULL,
    url_menu   VARCHAR(100) NOT NULL,
    parent_id  INT          NOT NULL DEFAULT 0,
    sort_order INT          NOT NULL DEFAULT 0,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1
);

-- ---------- 3. table_privilege_user ----------
-- Hak akses 1 user terhadap 1 menu: read / create / update / delete
CREATE TABLE table_privilege_user (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    id_user    INT        NOT NULL,
    id_menu    INT        NOT NULL,
    is_active  TINYINT(1) NOT NULL DEFAULT 1,
    can_read   TINYINT(1) NOT NULL DEFAULT 0,
    can_create TINYINT(1) NOT NULL DEFAULT 0,
    can_update TINYINT(1) NOT NULL DEFAULT 0,
    can_delete TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_priv_user FOREIGN KEY (id_user) REFERENCES table_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_priv_menu FOREIGN KEY (id_menu) REFERENCES table_menu(id) ON DELETE CASCADE,
    CONSTRAINT uq_priv_user_menu UNIQUE (id_user, id_menu)
);

-- ---------- data contoh untuk halaman CRUD ----------
CREATE TABLE table_category (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE table_product (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)  NOT NULL,
    price       DECIMAL(18,2) NOT NULL DEFAULT 0,
    stock       INT           NOT NULL DEFAULT 0,
    category_id INT NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES table_category(id) ON DELETE SET NULL
);

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Menu (2 tingkat)
--   1 Master Data (#)  -> 2 Produk, 3 Kategori
--   4 Pengaturan  (#)  -> 5 Manajemen User, 6 Hak Akses
INSERT INTO table_menu (id, menu_name, url_menu, parent_id, sort_order, is_active) VALUES
 (1, 'Master Data',    '#',           0, 1, 1),
 (2, 'Produk',         '/products',   1, 1, 1),
 (3, 'Kategori',       '/categories', 1, 2, 1),
 (4, 'Pengaturan',     '#',           0, 2, 1),
 (5, 'Manajemen User', '/users',      4, 1, 1),
 (6, 'Hak Akses',      '/privileges', 4, 2, 1),
 (7, 'Tentang Aplikasi', '/about',    4, 3, 1);

-- User: admin / admin123, kasir / kasir123, viewer / viewer123
INSERT INTO table_user (id, username, password_hash, full_name, is_active) VALUES
 (1, 'admin',  '$2b$10$Dtvsp.Zo2O.UI/5WJpu.oedzvE51prtdnR8KWh3vpJIVR/3yVpOti', 'Administrator', 1),
 (2, 'kasir',  '$2b$10$rLCFSXyfFpgomfGltKdde.hcQAEkvTvKQc/duYE7uaBgSxSqLmS3W', 'Kasir Toko',    1),
 (3, 'viewer', '$2b$10$aEemEZTvOOqZQmuuYZJW9.1E.5FcfXI7Hi6ZD00s..qjA.xP6AqT6', 'Pengamat',      1);

-- Privilege
--   admin  : semua menu, CRUD penuh
--   kasir  : Produk (read+create+update), Kategori (read saja)
--   viewer : Produk & Kategori (read saja)
INSERT INTO table_privilege_user (id_user, id_menu, is_active, can_read, can_create, can_update, can_delete) VALUES
 (1, 2, 1, 1, 1, 1, 1),
 (1, 3, 1, 1, 1, 1, 1),
 (1, 5, 1, 1, 1, 1, 1),
 (1, 6, 1, 1, 1, 1, 1),
 (2, 2, 1, 1, 1, 1, 0),
 (2, 3, 1, 1, 0, 0, 0),
 (3, 2, 1, 1, 0, 0, 0),
 (3, 3, 1, 1, 0, 0, 0),
 -- menu "Tentang Aplikasi": semua user boleh melihat
 (1, 7, 1, 1, 0, 0, 0),
 (2, 7, 1, 1, 0, 0, 0),
 (3, 7, 1, 1, 0, 0, 0);

INSERT INTO table_category (name) VALUES ('Makanan'), ('Minuman'), ('Alat Tulis');
INSERT INTO table_product (name, price, stock, category_id) VALUES
 ('Roti Tawar',  15000, 40, 1),
 ('Teh Botol',    5000, 120, 2),
 ('Pulpen Hitam', 3500, 200, 3);

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pesanan',
  imports: [DatePipe],
  templateUrl: './pesanan.html',
  styleUrl: './pesanan.css'
})
export class Pesanan {
  orders = [
    {
      id: 'ORD-001',
      produk: 'ASUS ROG Strix G16',
      pelanggan: 'Budi Santoso',
      tanggal: new Date('2026-09-15'),
      status: 'Selesai'
    },
    {
      id: 'ORD-002',
      produk: 'MacBook Air M2',
      pelanggan: 'Siti Aminah',
      tanggal: new Date('2026-09-16'),
      status: 'Diproses'
    },
    {
      id: 'ORD-003',
      produk: 'Lenovo ThinkPad X1 Carbon',
      pelanggan: 'Andi Wijaya',
      tanggal: new Date('2026-09-17'),
      status: 'Menunggu Pembayaran'
    },
    {
      id: 'ORD-004',
      produk: 'Acer Aspire 5',
      pelanggan: 'Dewi Lestari',
      tanggal: new Date('2026-09-18'),
      status: 'Selesai'
    }
  ];

  statusClass(status: string): string {
    switch (status) {
      case 'Selesai':
        return 'status-done';
      case 'Diproses':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  }
}

import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-beranda',
  imports: [CurrencyPipe],
  templateUrl: './beranda.html',
  styleUrl: './beranda.css'
})
export class Beranda {
  stats = [
    { label: 'Total Produk', value: '24', icon: 'laptop' },
    { label: 'Pesanan Baru', value: '8', icon: 'cart' },
    { label: 'Pendapatan Bulan Ini', value: 45000000, icon: 'money', isCurrency: true }
  ];
}

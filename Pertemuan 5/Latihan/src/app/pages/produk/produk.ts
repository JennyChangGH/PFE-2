import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-produk',
  imports: [CurrencyPipe],
  templateUrl: './produk.html',
  styleUrl: './produk.css'
})
export class Produk {
  laptops = [
    {
      name: 'ASUS ROG Strix G16',
      spec: 'Intel Core i7 · RTX 4060 · 16GB RAM · 512GB SSD',
      price: 18500000,
      stock: 5
    },
    {
      name: 'MacBook Air M2',
      spec: 'Apple M2 · 8GB RAM · 256GB SSD',
      price: 15500000,
      stock: 3
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      spec: 'Intel Core i5 · 16GB RAM · 512GB SSD',
      price: 21000000,
      stock: 2
    },
    {
      name: 'Acer Aspire 5',
      spec: 'AMD Ryzen 5 · 8GB RAM · 512GB SSD',
      price: 8500000,
      stock: 10
    }
  ];
}

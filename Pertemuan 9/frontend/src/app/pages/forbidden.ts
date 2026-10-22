import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink],
  template: `
    <h1>Akses ditolak</h1>
    <p>Anda tidak memiliki hak akses ke halaman ini.</p>
    <a routerLink="/">Kembali ke beranda</a>
  `,
})
export class Forbidden {}

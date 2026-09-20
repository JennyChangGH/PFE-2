import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Beranda } from './pages/beranda/beranda';
import { Produk } from './pages/produk/produk';
import { Pesanan } from './pages/pesanan/pesanan';
import { LaporanDetail } from './pages/laporan-detail/laporan-detail';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'beranda', pathMatch: 'full' },
      { path: 'beranda', component: Beranda },
      { path: 'produk', component: Produk },
      { path: 'pesanan', component: Pesanan },
      { path: 'laporan', component: LaporanDetail },
      { path: '**', redirectTo: 'beranda' }
    ]
  }
];

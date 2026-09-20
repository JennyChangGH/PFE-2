import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LaporanState, LaporanVariant } from '../../services/laporan-state';

interface LaporanContent {
  variant: LaporanVariant;
  title: string;
  description: string;
  stats: { label: string; value: string | number; isCurrency?: boolean }[];
}

@Component({
  selector: 'app-laporan-detail',
  imports: [CurrencyPipe],
  templateUrl: './laporan-detail.html',
  styleUrl: './laporan-detail.css'
})
export class LaporanDetail {
  protected readonly state = inject(LaporanState);

  private readonly contents: Record<LaporanVariant, LaporanContent> = {
    harian: {
      variant: 'harian',
      title: 'Laporan Harian',
      description: 'Ringkasan penjualan laptop hari ini di Jenny\'s Laptop.',
      stats: [
        { label: 'Laptop Terjual', value: '3 unit' },
        { label: 'Pesanan Masuk', value: '5 pesanan' },
        { label: 'Pendapatan', value: 34000000, isCurrency: true }
      ]
    },
    bulanan: {
      variant: 'bulanan',
      title: 'Laporan Bulanan',
      description: 'Rekap performa penjualan selama bulan ini di Jenny\'s Laptop.',
      stats: [
        { label: 'Laptop Terjual', value: '46 unit' },
        { label: 'Pesanan Masuk', value: '58 pesanan' },
        { label: 'Pendapatan', value: 612000000, isCurrency: true }
      ]
    }
  };

  protected readonly visibleContents = computed(() =>
    [...this.state.selected()].map((variant) => this.contents[variant])
  );

  toggle(variant: LaporanVariant): void {
    this.state.toggle(variant);
  }
}

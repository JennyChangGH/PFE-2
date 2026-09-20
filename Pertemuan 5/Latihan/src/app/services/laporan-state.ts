import { Injectable, signal } from '@angular/core';

export type LaporanVariant = 'harian' | 'bulanan';

@Injectable({ providedIn: 'root' })
export class LaporanState {
  readonly selected = signal<ReadonlySet<LaporanVariant>>(new Set());

  isSelected(variant: LaporanVariant): boolean {
    return this.selected().has(variant);
  }

  toggle(variant: LaporanVariant): void {
    this.selected.update((current) => {
      const next = new Set(current);
      next.has(variant) ? next.delete(variant) : next.add(variant);
      return next;
    });
  }
}

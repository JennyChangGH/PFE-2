import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LaporanState, LaporanVariant } from '../services/laporan-state';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private router = inject(Router);
  protected readonly laporanState = inject(LaporanState);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  isLaporanActive = computed(() => this.currentUrl().includes('/laporan'));
  laporanOpen = signal(this.router.url.includes('/laporan'));

  toggleLaporan(): void {
    const nextOpen = !this.laporanOpen();
    this.laporanOpen.set(nextOpen);
    if (nextOpen) {
      this.router.navigate(['/laporan']);
    }
  }

  selectLaporan(variant: LaporanVariant): void {
    this.laporanState.toggle(variant);
    this.router.navigate(['/laporan']);
  }
}

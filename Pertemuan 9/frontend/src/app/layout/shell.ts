import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

/** Kerangka halaman: sidebar berisi menu dinamis (parent -> child) dari database. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">Sistem Toko</div>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Beranda</a>
          @for (m of auth.menus(); track m.id) {
            @if (m.url === '#') {
              <details open>
                <summary>{{ m.name }}</summary>
                @for (c of m.children; track c.id) {
                  <a [routerLink]="c.url" routerLinkActive="active">{{ c.name }}</a>
                }
              </details>
            } @else {
              <a [routerLink]="m.url" routerLinkActive="active">{{ m.name }}</a>
            }
          }
        </nav>
      </aside>

      <div class="main">
        <header class="topbar">
          <span>{{ auth.user()?.fullName }} <small>({{ auth.user()?.username }})</small></span>
          <button class="btn" (click)="auth.logout()">Keluar</button>
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Shell {
  protected auth = inject(AuthService);
}

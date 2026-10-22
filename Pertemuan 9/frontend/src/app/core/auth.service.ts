import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './config';

export interface UserInfo {
  id: number;
  username: string;
  fullName: string;
}

export interface PrivilegeFlags {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface MenuNode {
  id: number;
  name: string;
  url: string; // '#' untuk menu parent
  privilege: PrivilegeFlags | null;
  children: MenuNode[];
}

function readUser(): UserInfo | null {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly user = signal<UserInfo | null>(readUser());
  /** Menu dinamis milik user yang login; null = belum dimuat. */
  readonly menus = signal<MenuNode[] | null>(null);
  readonly isLoggedIn = computed(() => !!this.token());

  async login(username: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: UserInfo }>(`${API_URL}/auth/login`, { username, password }),
    );
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.token.set(res.token);
    this.user.set(res.user);
    this.menus.set(null);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.user.set(null);
    this.menus.set(null);
    this.router.navigateByUrl('/login');
  }

  async loadMenus(force = false) {
    if (this.menus() && !force) return;
    this.menus.set(await firstValueFrom(this.http.get<MenuNode[]>(`${API_URL}/menu/my`)));
  }

  /** Hak akses user pada menu dengan url tertentu (null = tidak punya akses). */
  privilegeFor(url: string): PrivilegeFlags | null {
    for (const parent of this.menus() ?? []) {
      if (parent.url === url) return parent.privilege;
      const child = parent.children.find((c) => c.url === url);
      if (child) return child.privilege;
    }
    return null;
  }
}

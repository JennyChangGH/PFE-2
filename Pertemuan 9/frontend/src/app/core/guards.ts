import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Harus login; sekaligus memuat menu dinamis user. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return router.parseUrl('/login');
  try {
    await auth.loadMenus();
  } catch {
    auth.logout();
    return false;
  }
  return true;
};

/** Halaman hanya bisa dibuka bila user punya privilege read pada menu dengan url yang sama dengan path route. */
export const privilegeGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const url = '/' + route.routeConfig?.path;
  return auth.privilegeFor(url)?.read ? true : router.parseUrl('/forbidden');
};

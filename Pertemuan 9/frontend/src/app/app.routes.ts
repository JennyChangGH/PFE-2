import { Routes } from '@angular/router';
import { authGuard, privilegeGuard } from './core/guards';

// Path route harus sama dengan url_menu di table_menu (mis. '/products' -> path 'products').
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
      { path: 'forbidden', loadComponent: () => import('./pages/forbidden').then((m) => m.Forbidden) },
      {
        path: 'products',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/products').then((m) => m.Products),
      },
      {
        path: 'categories',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/categories').then((m) => m.Categories),
      },
      {
        path: 'users',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/users').then((m) => m.Users),
      },
      {
        path: 'about',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/about').then((m) => m.About),
      },
      {
        path: 'test',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/test').then((m) => m.Test),
      },
      {
        path: 'privileges',
        canActivate: [privilegeGuard],
        loadComponent: () => import('./pages/privileges').then((m) => m.Privileges),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

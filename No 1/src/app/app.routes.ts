import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  }, 
  {
    path: 'home',
    component: Home
  },
  {
    path: 'admin',
    component: Admin
  }
];
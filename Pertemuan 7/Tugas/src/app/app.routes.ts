import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { MahasiswaPage } from './pages/mahasiswa/mahasiswa';
import { TelephonePage } from './pages/telephone/telephone';
import { TodosPage } from './pages/todos/todos';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'mahasiswa', pathMatch: 'full' },
      { path: 'mahasiswa', component: MahasiswaPage },
      { path: 'telephone', component: TelephonePage },
      { path: 'todos', component: TodosPage },
      { path: '**', redirectTo: 'mahasiswa' },
    ],
  },
];

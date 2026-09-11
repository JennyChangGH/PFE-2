import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'validation', pathMatch: 'full' },
  {
    path: 'validation',
    loadComponent: () =>
      import('./reactive-form-validation/registration-form/registration-form').then(
        (m) => m.RegistrationForm,
      ),
  },
  {
    path: 'dynamic-forms',
    loadComponent: () =>
      import('./dynamic-forms/dynamic-form-page/dynamic-form-page').then(
        (m) => m.DynamicFormPage,
      ),
  },
  {
    path: 'cross-field',
    loadComponent: () =>
      import('./cross-field-signal-forms/event-registration-form/event-registration-form').then(
        (m) => m.EventRegistrationForm,
      ),
  },
  {
    path: 'registrasi',
    loadComponent: () =>
      import('./project-mini-registration/registrasi-form/registrasi-form').then(
        (m) => m.RegistrasiForm,
      ),
  },
];

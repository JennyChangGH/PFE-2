import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeId from '@angular/common/locales/id';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

registerLocaleData(localeId);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'id-ID' },
  ],
};

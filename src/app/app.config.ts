import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { securityInterceptor } from 'src/app/shared/security';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { deAT } from 'date-fns/locale';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ErrorHandlerService } from '@app/core/error-handler.service';
import {
  loadingInterceptor,
  sharedUiMessagingProvider,
} from '@app/shared/ui-messaging';
import { baseUrlInterceptor, errorInterceptor } from '@app/shared/http';
import { Configuration } from '@app/shared/config';
import { sharedMasterDataProvider } from '@app/shared/master-data';
import { IMAGE_CONFIG } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideClientHydration(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideStore(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        baseUrlInterceptor,
        loadingInterceptor,
        errorInterceptor,
        securityInterceptor,
      ]),
    ),
    provideStoreDevtools({ connectInZone: true }),
    ...sharedMasterDataProvider,
    ...sharedUiMessagingProvider,
    importProvidersFrom([MatDateFnsModule]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: deAT,
    },
    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: Configuration,
      useValue: new Configuration('http://localhost:8080', true, false),
    },
  ],
};

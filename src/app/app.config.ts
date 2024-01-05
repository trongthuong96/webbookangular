import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter, RouterModule, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions, withNoHttpTransferCache } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { SignatureInterceptor } from './config/SignatureInterceptor';
import { ApiInterceptor } from './config/api.interceptor';
import { CustomReuseStrategy } from './custom.reuse.strategy';
import { CsrfInterceptor } from './config/CsrfInterceptor';
import { IMAGE_CONFIG } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      }),
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SignatureInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: CsrfInterceptor, 
      multi: true 
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
  ],
};

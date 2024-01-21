import { ApplicationConfig, isDevMode } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { SignatureInterceptor } from './config/SignatureInterceptor';
import { ApiInterceptor } from './config/api.interceptor';
import { CustomReuseStrategy } from './custom.reuse.strategy';
import { IMAGE_CONFIG } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';
import { CsrfInterceptor } from './config/CsrfInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
        provide: 'HYDRATION_CONFIG', // Tên dịch vụ cấu hình hydration
        useFactory: (networkStatus: boolean) => {
            return networkStatus
                ? provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: true }))
                : null;
        },
        deps: ['NETWORK_STATUS'],
    },
    
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
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
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};

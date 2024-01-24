import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, RouteReuseStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { SignatureInterceptor } from './config/SignatureInterceptor';
import { ApiInterceptor } from './config/api.interceptor';
import { IMAGE_CONFIG } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';
import { CsrfInterceptor } from './config/CsrfInterceptor';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { CustomReuseStrategy } from './custom.reuse.strategy';

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  };
  
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
    
  providers: [
    provideRouter(routes, inMemoryScrollingFeature),
    provideClientHydration(
        withHttpTransferCacheOptions({
        includePostRequests: true
    })),
    
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(NgHttpLoaderModule.forRoot()),
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
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    {
        provide: IMAGE_CONFIG,
        useValue: {
            disableImageSizeWarning: true,
            disableImageLazyLoadWarning: true
        }
    },
    provideServiceWorker('ngsw.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};

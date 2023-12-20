// api.interceptor.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (isPlatformServer(this.platformId) && (req.method === 'POST' || req.method === 'GET')) {
          if (event instanceof HttpResponse && (event.status === 200 || event.status === 202)) {
            let key: any = "";
            if (req.url !== null) {
              key = req.url;
            }
            this.transferState.set(makeStateKey(key), event.body);
          }
        }
      })
    );
  }
}

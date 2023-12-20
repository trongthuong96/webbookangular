// api.interceptor.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class BrowserStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platformId) && (req.method === 'POST' || req.method === 'GET')) {
      let postKey: any = "";
      if (req.url !== null) {
        postKey = req.url as string;
      }
      const key = makeStateKey(postKey);
      const storedResponse = this.transferState.get(key, null);
      if (storedResponse) {
        const response = new HttpResponse({ body: storedResponse, status: 200 });
        return of(response);
      }
    }
    return next.handle(req);
  }
}

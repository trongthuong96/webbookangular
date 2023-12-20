// api.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = request.clone({
      setHeaders: {
        'chrome-proxy': 'block'  
      }
    });
    
    // Cho phép request nếu là ở server side
    if (isPlatformServer(this.platformId)) {
      return next.handle(request);
    }

    return next.handle(request);
   
    // Ngăn chặn request nếu là browser
    // return throwError('API not accessible from browser'); 
  }

}

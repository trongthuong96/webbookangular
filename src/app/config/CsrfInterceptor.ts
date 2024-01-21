import { Inject, Injectable, PLATFORM_ID, makeStateKey } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsrfTokenService } from '../services/csrf-token.service';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  cookie = "Meoco";
  cookieKey = makeStateKey<string>('token');

  constructor(
    private csrfTokenService: CsrfTokenService,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url === environment.apiUrlImage)
    {
      return next.handle(req);
    }

    if (isPlatformServer(this.platformId)) {
      // Thêm header vào yêu cầu HTTP
      const modifiedReq = req.clone({
        setHeaders: {
          "X-APP-SOURCE": environment.XAPPSOURCEVALUE
        }
      });
      return next.handle(modifiedReq); // Trả về việc gọi `next.handle` với `modifiedReq`
    } else {
      const token = this.csrfTokenService.getCsrfToken();
      const modifiedReq = req.clone({
        setHeaders: {
          "X-XSRF-TOKEN": token !== null ? token : this.cookie
        },
        withCredentials: true
      });
      return next.handle(modifiedReq); // Trả về việc gọi `next.handle` với `modifiedReq`
    }
  }
}
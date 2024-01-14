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
      const token = this.csrfTokenService.getCsrfToken();
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
        }
      });
      return next.handle(modifiedReq); // Trả về việc gọi `next.handle` với `modifiedReq`
  }
    
  //   return next.handle(req).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.log("lỗi crfs1: " + this.csrfTokenService.getCsrfToken())
  //       if (error.status === 400) {
  //         // Nếu lỗi 403 (Forbidden) do token CSRF hết hạn, thực hiện refresh token và thử lại yêu cầu
  //         this.csrfTokenService.refreshCsrfToken().pipe(
  //           switchMap((response) => {
  //             this.transferState.set(this.cookieKey, response.token);
  //             this.csrfTokenService.setCsrfToken(response.token);

  //             const modifiedRequest = req.clone({
  //               setHeaders: {
  //                 'X-CSRF-TOKEN': response.token,
  //               },
  //             });
  //             return next.handle(modifiedRequest);
  //           })
  //         );
      
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }  
  }
}
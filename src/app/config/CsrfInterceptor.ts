import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CsrfTokenService } from '../services/csrf-token.service';
import { CsrfToken } from '../models/csrftoken/csrf.token.model';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  private csrtToken!: CsrfToken;

  constructor(private csrfTokenService: CsrfTokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.csrfTokenService.getCsrfToken();
    if (csrfToken !== null) {
      req = req.clone({
        setHeaders: {
          'X-CSRF-TOKEN': csrfToken
        }
      });
    } 

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          // Nếu lỗi 403 (Forbidden) do token CSRF hết hạn, thực hiện refresh token và thử lại yêu cầu
          const csrfToken = this.csrfTokenService.getCsrfToken();
          if (csrfToken !== null) {
            req = req.clone({
              setHeaders: {
                'X-CSRF-TOKEN': csrfToken
              }
            });
            window.location.reload()
          } 
        }
        return throwError(error);
      })
    );
  }  
}
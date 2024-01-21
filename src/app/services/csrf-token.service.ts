import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { CsrfToken } from '../models/csrftoken/csrf.token.model';

@Injectable({
  providedIn: 'root'
})
export class CsrfTokenService {

  private readonly csrfCookieName = 'XSRF-TOKEN';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getCsrfToken(): string | null {
    return this.cookieService.get(this.csrfCookieName) || null;
  }

  setCsrfToken(token: string | null): void {
    if (token) {
      this.cookieService.set(this.csrfCookieName, token, undefined, "/");
    } else {
      this.cookieService.delete(this.csrfCookieName);
    }
  }

  refreshCsrfToken(): Observable<CsrfToken> {
    // Gửi yêu cầu HTTP để lấy token mới từ server
    return this.http.post<CsrfToken>(`${environment.apiUrl}/csrf/refresh-token`, {}, {  withCredentials: true  });
  }
}

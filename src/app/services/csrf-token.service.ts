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
  private csrfToken?: CsrfToken;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getCsrfToken(): string | null {
    return this.cookieService.get(this.csrfCookieName) || null;
  }

  setCsrfToken(token: string | null): void {
    if (token) {
      this.cookieService.set(this.csrfCookieName, token);
    } else {
      this.cookieService.delete(this.csrfCookieName);
    }
  }

  refreshCsrfToken(): Observable<any> {
    // Gửi yêu cầu HTTP để lấy token mới từ server
    return this.http.get<any>(`${environment.apiUrl}/csrf/refresh-token`);
  }
}

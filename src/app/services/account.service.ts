import { Injectable, afterNextRender } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginModel } from '../models/user/login.model';
import { loginUrl, registerUrl } from '../config/api.config';
import { UserProfileModel } from '../models/user/user.profile.model';
import { CookieService } from 'ngx-cookie-service';
import { RegisterModel } from '../models/user/register.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // Thêm mã xác thực vào header nếu cần
  private headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.cookieService.get(environment.UserCookie)  // Hàm này để lấy token từ cookie hoặc nơi bạn đã lưu
  });

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  private urlBase = `${environment.apiUrl}/account`;  

  login(user: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlBase}/${loginUrl}`, user);
  }

  register(user: RegisterModel): Observable<RegisterReponse> {
    return this.http.post<RegisterReponse>(`${this.urlBase}/${registerUrl}`, user);
  }

  getUserProfile(): Observable<UserProfileModel> {
    return this.http.get<UserProfileModel>(`${this.urlBase}/profile`, {headers: this.headers});
  }

  editUserProfile(userProfile: UserProfileModel): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.urlBase}/edit`, userProfile, {headers: this.headers});
  }
}

// Assuming your server response includes a token
interface LoginResponse {
  token: string;
}

interface RegisterReponse {
  message: string;
  token: string;
}

interface Reponse {
  message: string;
}



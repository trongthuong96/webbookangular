import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
// import { loginUrl, registerUrl, logoutUrl, userProfileUrl } from '../config/api.config';
import { LoginModel } from '../models/user/login.model';
// import { RegisterModel } from '../models/user/register.model';
// import { UserProfileModel } from '../models/user/user-profile.model';
import { loginUrl, registerUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) {}

  private urlBase = `${environment.apiUrl}`;  

  login(user: LoginModel): Observable<string> {
    return this.http.post<string>(`${this.urlBase}/${loginUrl}`, user);
  }

  // register(user: RegisterModel): Observable<string> {
  //   return this.getDataFromServer<string>(`/${registerUrl}`, user);
  // }

  // logout(): Observable<void> {
  //   return this.getDataFromServer<void>(`/${logoutUrl}`);
  // }

  // getUserProfile(): Observable<UserProfileModel> {
  //   return this.getDataFromServer<UserProfileModel>(`/${userProfileUrl}`);
  // }
}

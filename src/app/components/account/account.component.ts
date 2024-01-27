import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { LoginModel } from '../../models/user/login.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterModel } from '../../models/user/register.model';
import { CookieService } from 'ngx-cookie-service';
import { UserProfileModel } from '../../models/user/user.profile.model';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { SD } from '../../Utility/SD';
import { Subject, takeUntil } from 'rxjs';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  
  loginModel: LoginModel = new LoginModel();
  registerModel: RegisterModel = new RegisterModel();
  userProfile: UserProfileModel = new UserProfileModel();
  private ngUnsubscribe = new Subject<void>();

  token: string = "";

  //
  isLoginOrRegister = 0;

  loginForm = new FormGroup({
    loginEmail: new FormControl(""),
    loginPassword: new FormControl("")
  })

  registerForm = new FormGroup({
    registerEmail: new FormControl(""),
    registerUsername: new FormControl(""),
    registerPassword: new FormControl(""),
    registerPasswordConfirm: new FormControl("")
  })

  constructor(
    private accountService: AccountService,
    private cookieService: CookieService,
    private router: Router,
    private appComponent: AppComponent,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.cookieService.check(environment.UserCookie)){
        if (localStorage.getItem(environment.UserProfileLocal)) {
          const storedUserProfile = localStorage.getItem(environment.UserProfileLocal);
        
          if (storedUserProfile) {
            // Chuyển đổi chuỗi thành đối tượng
            this.userProfile = JSON.parse(storedUserProfile)!;
          }
  
        } else {
          this.appComponent.refreshCsrfTokenSubject.pipe(
            takeUntil(this.ngUnsubscribe)
          ).subscribe(() => {
            this.getUserProfile(); // Gọi hàm khi refresh token hoàn thành
          });
        }
      }
    }
  }

  //start login user
  submitLogin() {
    
    this.loginModel.EmailOrUserName = this.loginForm.value.loginEmail;

    // check email
    if (this.loginModel.EmailOrUserName!.length <= 0) {
      alert("Tên đăng nhập hoặc email không được để trống");
      return;
    }

    this.loginModel.password = this.loginForm.value.loginPassword;
    // check password
    if (this.loginModel.password!.length <= 0) {
      alert("Mật khẩu không được để trống");
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.login(this.loginModel);
    }
  }

  login(user: LoginModel) {
    this.accountService.login(user).subscribe({
      next: (reponse) => {
        this.token = reponse.token
        this.cookieService.set(environment.UserCookie, this.token, undefined, "/" );
        window.location.reload();
      },
      error: (e) => {
        if (e.status === 401) {
          alert("Tài khoản hoặc mật khẩu chưa đúng!");
          return;
        }
      }
    });
  }
  // end login user

  // START REGISTER
  submitRegister() {

    const email = this.registerForm.value.registerEmail;

    // check email
    if (email!.length <= 0) {
      alert("Email không được để trống");
      return;
    }

    if (!SD.isValidEmail(email!)) {
      alert("Email không hợp lệ");
      return;
    }

    const userName = this.registerForm.value.registerUsername;

    if (userName!.length <= 0) {
      alert("Tên tài khoản không được để trống!");
      return;
    }

    if (!SD.isValidUserName(userName!)) {
      alert("Tên tài khoản chỉ chứa chữ cái và số!");
      return;
    }

    const password = this.registerForm.value.registerPassword!;
    // Validate password
    const passwordErrors = SD.validatePassword(password);
    if (passwordErrors.length > 0) {
      alert(passwordErrors.join('\n'));
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== this.registerForm.value.registerPasswordConfirm) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    this.registerModel.userName = userName!;
    this.registerModel.email = email!;
    this.registerModel.password = password!;

    this.register(this.registerModel);
  }

  register(userRegister: RegisterModel) {
    this.accountService.register(userRegister).subscribe({
      next: (reponse) => {
        this.token = reponse.token
        this.cookieService.set(environment.UserCookie, this.token, undefined, "/" );
        window.location.reload();
        alert(reponse.message);
      },
      error: (e) => {
        if (e.error.message === "Email is already registered") {
          alert("Đã tồn tại email này!");
        } else if (e.error.message === "UserName is already registered") {
          alert("Đã tồn tại tên tài khoản này!");
        }
      }
    });
  }
  // END REGISTER

  // START LOGOUT
  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      console.log("logout: " + this.cookieService.check(environment.UserCookie))
      this.cookieService.delete(environment.UserCookie, "/");
      localStorage.removeItem(environment.UserProfileLocal);

      window.location.reload();
    }
  }
  // END LOGOUT

  getUserProfile() {
    this.accountService.getUserProfile().subscribe((reponse) => {
     this.userProfile = reponse;
     localStorage.setItem(environment.UserProfileLocal, JSON.stringify(reponse))
    });
  }

  isLogin() {
    this.isLoginOrRegister = 1
  }

  isRegister() {
    this.isLoginOrRegister = 2;
  }

  @HostListener('keydown.enter') 
  onEnter() {
    if (this.isLoginOrRegister === 1) {
      this.submitLogin(); 
    }
    
    if (this.isLoginOrRegister === 2) {
      this.submitRegister();
    }
  }
}

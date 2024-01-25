import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfileModel } from '../../models/user/user.profile.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../services/account.service';
import { ImageService } from '../../services/image.service';
import { FreeImageHost } from '../../models/image/freeImage.model';
import { SD } from '../../Utility/SD';
import { parseISO } from 'date-fns';


@Component({
  selector: 'app-user.profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
  ],
  providers: [DatePipe], 
  templateUrl: './user.profile.component.html',
  styleUrl: './user.profile.component.css'
})

export class UserProfileComponent implements OnInit{

  userProfile: UserProfileModel = new UserProfileModel();

  createdAt!: Date;
  updatedAt!: Date;
  waitingForResponse = false;

  // image
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  freeImageHost!: FreeImageHost;

  // user form profile
  profileForm = new FormGroup({
    inputFullName: new FormControl("", [Validators.required]),
    inputBirthday: new FormControl("", [SD.dateValidator]),
    inputEmail: new FormControl("", [Validators.required, Validators.email]),
    inputPhone: new FormControl("", [Validators.pattern(/^[0-9]{10}$/)])
  })

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private datePipe: DatePipe,
    private accountService: AccountService,
    private imageService: ImageService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserProfile = localStorage.getItem(environment.UserProfileLocal);
    
      if (storedUserProfile) {
        // Chuyển đổi chuỗi thành đối tượng
        this.userProfile = JSON.parse(storedUserProfile);

      // Chuyển đổi createdAt
      let dateStringWithZ = this.userProfile.createdAt + 'Z';
      this.createdAt = parseISO(dateStringWithZ);

      // Xử lý updatedAt
      const formattedValue = this.userProfile.updatedAt.toString().replace("Z", "");
      dateStringWithZ = formattedValue + 'Z';

      this.updatedAt = parseISO(dateStringWithZ);

        this.profileForm.get('inputFullName')!.setValue(this.userProfile.fullName);
        this.profileForm.get('inputEmail')!.setValue(this.userProfile.email);
        this.profileForm.get('inputBirthday')!.setValue(this.userProfile.birthDay === undefined ? "" : this.datePipe.transform(this.userProfile.birthDay, 'dd/MM/yyyy'));
        this.profileForm.get('inputPhone')!.setValue(this.userProfile.phoneNumber);
      }
      else {
        this.router.navigate(['/']);
      }
    }
  }

  submitSaveChange() {
    // button reponse
    this.waitingForResponse = true;

    // Kiểm tra xem form có hợp lệ không
    if (this.profileForm.valid) {
      this.userProfile.email = this.profileForm.value.inputEmail!;
      this.userProfile.fullName = this.profileForm.value.inputFullName!;
      this.userProfile.phoneNumber = this.profileForm.value.inputPhone!;

      let dateString = this.profileForm.value.inputBirthday!;
      // Tách ngày, tháng, năm từ chuỗi
      let dateParts = dateString.split('/');
      // Chuyển đổi thành đối tượng Date
      let dateObject = new Date(Date.UTC(+dateParts[2], +dateParts[1] - 1, +dateParts[0]));

      this.userProfile.birthDay = dateObject;

      const updatedAt = new Date();

      this.userProfile.updatedAt = updatedAt;

       // Hiển thị cảnh báo và chờ người dùng chọn Yes hoặc No
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn lưu thông tin?");
    
      // Nếu người dùng chọn Yes, thực hiện lưu thông tin
      if (isConfirmed) {
        if (this.selectedFile) {
          this.uploadImage(this.userProfile);
        } else {
          this.editUserProfile(this.userProfile);
        }        
      }
    }
    else {
      alert("Form không hợp lệ. Vui lòng kiểm tra và điền đầy đủ thông tin.");
    }
  }

  // edit
  editUserProfile(userProfile: UserProfileModel) {
   
      this.accountService.editUserProfile(userProfile).subscribe(
        (response) => {
          localStorage.setItem(environment.UserProfileLocal, JSON.stringify(this.userProfile));
          window.location.reload();
          this.waitingForResponse = false;
          alert("Lưu thành công!");
        },
        (error) => {
          if (error.error.message === "FullName is already in use") {
            alert("Tên hiển thị đã tồn tại!");
          } else if (error.error.message === "Email already exists") {
            alert("Email đã tồn tại!");
          }
          this.waitingForResponse = false;
        }
      );
    
  }

  // upload image avatar
  onFileSelected(event: any): void {
    const file = event.target.files[0];

     // Kiểm tra kích thước của file
     if (file && file.size > 1024 * 1024) {
      alert('File ảnh không được lớn hơn 1MB');
      // Bạn có thể xử lý thông báo hoặc thực hiện hành động khác ở đây
      // Ví dụ: reset input để người dùng chọn lại ảnh
      event.target.value = null;
      return;
    }

    this.selectedFile = file;
    // Handle the selected file, you may want to preview it or perform other operations
    // For now, you can set it to userProfile.avatar for preview
    this.userProfile.avatar = URL.createObjectURL(file);
  }

  openFileInput(): void {
    document.getElementById('avatarInput')?.click();
  }

  uploadImage(userProfile: UserProfileModel): void {
    if (this.selectedFile) {
      this.imageService.uploadImage(this.selectedFile, "avatar").subscribe({
        next: (response) => {
            this.freeImageHost = response;
            userProfile.avatar = this.freeImageHost.data.display_url;
            this.editUserProfile(userProfile);
          },
        error: (error) => {
            console.error('Error:', error.error.message);
          }
      });
    }
  }  
}

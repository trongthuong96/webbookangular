import { AbstractControl } from "@angular/forms";

export class SD {
    static isUrl(input: string): boolean {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
        return urlRegex.test(input);
    }

    static extractSlugFromUrl(url: string): string | null {
        const parts = url.split('/');
        return parts[parts.length - 1] || null;
    }

    // kiểm tra email
    static isValidEmail(email: string): boolean {
        const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

  // kiểm tra mật khẩu
  static validatePassword(password: string): string[] {
    const errors: string[] = [];

    // Kiểm tra độ dài
    if (password.length < 6) {
      errors.push('Mật khẩu ít nhất 6 ký tự!');
    }

    // Kiểm tra ký tự đặc biệt
    const specialChar = /[!@#$%^&*()`~]/;
    if (!specialChar.test(password)) {
      errors.push('Mật khẩu phải chứa ký tự đặc biệt!');
    }

    /// Kiểm tra chữ hoa 
    const upperCase = /[A-Z]/;
    if (!upperCase.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 chữ hoa!");
    }

    // Kiểm tra chữ thường
    const lowerCase = /[a-z]/;
    if (!lowerCase.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 chữ thường!");
    }

    // Kiểm tra số
    const number = /\d/;
    if (!number.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất 1 số!");
    }

    return errors;
  }

  // Kiểm tra username
  static isValidUserName(userName: string): boolean {
    // Biểu thức chính quy để kiểm tra chuỗi chỉ chứa chữ cái và số
    const regex = /^[a-zA-Z0-9]+$/;
  
    return regex.test(userName);
  }

    // Hàm validator cho ngày sinh
  static dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputValue = control.value;
  
    // Kiểm tra xem giá trị là một ngày hợp lệ theo định dạng dd/MM/yyyy hay không
    if (inputValue) {
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = inputValue.match(regex);
  
      if (!match) {
        return { invalidDate: true };
      }
  
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
  
      // Kiểm tra xem ngày, tháng, năm có hợp lệ không
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        return { invalidDate: true };
      }
    }
  
    return null;
  }
}

  
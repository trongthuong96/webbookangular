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
}

  
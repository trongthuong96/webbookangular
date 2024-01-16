import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private readonly sharedSecretKey: string = '85d1a303708926b1c1598289020565e9eb3d9918ae87847f158833862171dee3';

  async generateSignatureAsync(dataForSignature: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const hashedData = CryptoJS.HmacSHA256(dataForSignature, this.sharedSecretKey);
        const signature = CryptoJS.enc.Hex.stringify(hashedData);
        resolve(signature);
      } catch (error) {
        reject(error);
      }
    });
  }
  

  decryptionHmacSHA256(encodedString: string) {
    const decrypted = CryptoJS.HmacSHA256(encodedString, this.sharedSecretKey).toString();
    return decrypted;
  }

  // Hàm giải mã tương tự DecryptAsync
  async decryptAESAsync(encryptedText: string): Promise<string> {

    const key = CryptoJS.enc.Base64.parse('DA8AAgQFCQcIOAsMDQ4tEC8wDBQVFhcYGRobHB0zHyA='); // Thay thế key bằng khóa thực tế của bạn
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Thay thế iv bằng iv thực tế của bạn

    const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);  
    
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
      iv: iv,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}

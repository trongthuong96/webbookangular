import { Injectable } from '@angular/core';

import CryptoES from 'crypto-es';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private readonly sharedSecretKey: string = '85d1a303708926b1c1598289020565e9eb3d9918ae87847f158833862171dee3';

  async generateSignatureAsync(dataForSignature: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const hashedData = CryptoES.HmacSHA256(dataForSignature, this.sharedSecretKey);
        const signature = CryptoES.enc.Hex.stringify(hashedData);
        resolve(signature);
      } catch (error) {
        reject(error);
      }
    });
  }
  

  decryptionHmacSHA256(encodedString: string) {
    const decrypted = CryptoES.HmacSHA256(encodedString, this.sharedSecretKey).toString();
    return decrypted;
  }

  // Hàm giải mã tương tự DecryptAsync
  async decryptAESAsync(encryptedText: string): Promise<string> {

    const key = CryptoES.enc.Base64.parse('DA8AAgQFCQcIOAsMDQ4tEC8wDBQVFhcYGRobHB0zHyA='); // Thay thế key bằng khóa thực tế của bạn
    const iv = CryptoES.enc.Utf8.parse('1234567890123456'); // Thay thế iv bằng iv thực tế của bạn

    const encryptedData = CryptoES.enc.Base64.parse(encryptedText);  
    
    const cipherParams = CryptoES.lib.CipherParams.create({
      ciphertext: encryptedData,
      iv: iv,
    });

    const decrypted = CryptoES.AES.decrypt(cipherParams, key, {
      iv: iv,
    });

    return decrypted.toString(CryptoES.enc.Utf8);
  }

}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private readonly sharedSecretKey: string = '85d1a303708926b1c1598289020565e9eb3d9918ae87847f158833862171dee3';

  // async generateSignatureAsync(dataForSignature: string): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     try {
  //       const hashedData = CryptoJS.HmacSHA256(dataForSignature, this.sharedSecretKey);
  //       const signature = CryptoJS.enc.Hex.stringify(hashedData);
  //       resolve(signature);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  async generateSignatureAsync(dataForSignature: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const keyBuffer = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.sharedSecretKey),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );

      const dataBuffer = encoder.encode(dataForSignature);
      const signature = await crypto.subtle.sign('HMAC', keyBuffer, dataBuffer);

      // Convert the signature ArrayBuffer to a hex string
      const signatureArray = Array.from(new Uint8Array(signature));
      const signatureHex = signatureArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

      return signatureHex;
    } catch (error) {
      throw error;
    }
  }
  

  // decryptionHmacSHA256(encodedString: string) {
  //   const decrypted = CryptoJS.HmacSHA256(encodedString, this.sharedSecretKey).toString();
  //   return decrypted;
  // }

  // Hàm giải mã tương tự DecryptAsync
  // async decryptAESAsync(encryptedText: string): Promise<string> {

  //   const key = CryptoJS.enc.Base64.parse('DA8AAgQFCQcIOAsMDQ4tEC8wDBQVFhcYGRobHB0zHyA='); // Thay thế key bằng khóa thực tế của bạn
  //   const iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Thay thế iv bằng iv thực tế của bạn

  //   const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);  
    
  //   const cipherParams = CryptoJS.lib.CipherParams.create({
  //     ciphertext: encryptedData,
  //     iv: iv,
  //   });

  //   const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
  //     iv: iv,
  //   });

  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }

  async decryptAESAsync(encryptedText: string): Promise<string> {
    // Dưới đây là một hàm giải mã AES đơn giản sử dụng crypto API:

    const key = await crypto.subtle.generateKey(
      { name: 'AES-CBC', length: 128 },
      false,
      ['encrypt', 'decrypt']
    );

    const iv = new Uint8Array(16); // Độ dài của iv phải là 16 bytes

    const encryptedData = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      encryptedData
    );

    const decryptedText = new TextDecoder().decode(decrypted);
    return decryptedText;
  }
}

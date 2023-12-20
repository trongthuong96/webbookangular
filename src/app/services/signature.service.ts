import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private sharedSecretKey = '85d1a303708926b1c1598289020565e9eb3d9918ae87847f158833862171dee3';

  generateSignature(dataForSignature: string): string {
    const hashedData = CryptoJS.HmacSHA256(dataForSignature, this.sharedSecretKey);
    //console.log(dataForSignature + " " + CryptoJS.enc.Hex.stringify(hashedData))
    return CryptoJS.enc.Hex.stringify(hashedData);
  }
}

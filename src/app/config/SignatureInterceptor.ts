import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignatureService } from '../services/signature.service';

@Injectable()
export class SignatureInterceptor implements HttpInterceptor {
  
  private lastSignatureTime: number = 0; // Lưu thời điểm cuối cùng chữ ký được tạo

  constructor(private signatureService: SignatureService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Import thư viện Date từ thư viện JavaScript
    const currentDate = new Date();

    // Lấy số phút
    const minutes = currentDate.getMinutes() + 1026;

    const dataForSignature = minutes.toString();
    // Tạo chữ ký sử dụng service hoặc logic bạn đã có
    const signature = this.signatureService.generateSignature(dataForSignature);

    // Thêm chữ ký vào header
    const signedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
    });

    // Chuyển tiếp yêu cầu đã được ký đến next handler
    return next.handle(signedRequest);
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retryWhen, delay, mergeMap } from 'rxjs/operators';
import { SignatureService } from '../services/signature.service';

@Injectable()
export class SignatureInterceptor implements HttpInterceptor {
  
  private maxRetryAttempts = 2; // Số lần thử lại tối đa
  private retryDelay = 1000; // Thời gian chờ giữa các lần thử lại (ms)

  constructor(private signatureService: SignatureService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Intercept và thử lại lần 1
    return next.handle(this.addSignature(request))
      .pipe(
        retryWhen(errors => errors.pipe(
          mergeMap((error, i) => {
            if (i < this.maxRetryAttempts - 1 && error instanceof HttpResponse && error.status === 401) {
              // Thử lại nếu là lỗi 401 (Unauthorized)
              return of(error);
            }
            return throwError(error);
          }),
          delay(this.retryDelay)
        )),
        catchError((error) => {
          // Xử lý lỗi sau khi đã thử lại
          // Có thể thêm logic xử lý lỗi ở đây
          // Nếu muốn thử lại, gọi this.intercept() lại ở đây
          // return this.intercept(request, next);
          return throwError(error);
        })
      );
  }

  private addSignature(request: HttpRequest<any>): HttpRequest<any> {
    // Import thư viện Date từ thư viện JavaScript
    const currentDate = new Date();

    // Lấy số phút
    const minutes = currentDate.getMinutes() + 1026;

    const dataForSignature = minutes.toString();
    // Tạo chữ ký sử dụng service hoặc logic bạn đã có
    const signature = this.signatureService.generateSignature(dataForSignature);

    // Thêm chữ ký vào header
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
    });
  }
}

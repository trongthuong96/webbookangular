import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of, from } from 'rxjs';
import { catchError, retryWhen, delay, mergeMap } from 'rxjs/operators';
import { SignatureService } from '../services/signature.service';
import { environment } from '../../environments/environment.development';

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
    return from(this.addSignature(request)).pipe(
      mergeMap(signedRequest =>
        next.handle(signedRequest).pipe(
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
        )
      )
    );
  }

  private async addSignature(request: HttpRequest<any>): Promise<HttpRequest<any>> {
    // Import thư viện Date từ thư viện JavaScript
    const currentDate = new Date();

    // Lấy số phút
    const hour = currentDate.getUTCHours() + 1026;

    const dataForSignature = hour.toString();
    // Tạo chữ ký sử dụng service hoặc logic bạn đã có
    const signature = await this.signatureService.generateSignatureAsync(dataForSignature);
    
    if (request.url === environment.apiUrlImage)
    {
      return request;
    }
     // Thêm chữ ký vào header
     return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
    });
  }
}

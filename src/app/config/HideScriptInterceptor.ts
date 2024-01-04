import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";


@Injectable()
export class HideScriptInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpResponse<any>> {
    console.log("xin chào")
    return next.handle(req).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse && req.url.includes(`/api/book`)) {
          // Tạo một bản sao của HttpResponse
          console.log("xin chào")
          const modifiedResponse = event.clone({ body: {} });
          // Sử dụng bản sao để thay đổi 'body'
          event = modifiedResponse;
          console.log(event.body)
        }
      })
    ) as Observable<HttpResponse<any>>;
  }
}
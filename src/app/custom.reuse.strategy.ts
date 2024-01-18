// import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

// export class CustomReuseStrategy implements RouteReuseStrategy {
//   private routeCache = new Map<string, DetachedRouteHandle>();

//   shouldDetach(route: ActivatedRouteSnapshot): boolean {
//     return route?.data?.['reuse'] ?? false;
//   }  

//   store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
//     if (handle) {
//       this.routeCache.set(this.getRouteKey(route), handle);
//     }
//   }
  
//   shouldAttach(route: ActivatedRouteSnapshot): boolean {
//     const routeKey = this.getRouteKey(route);
//     return this.routeCache.has(routeKey);
//   }  

//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
//     const routeKey = this.getRouteKey(route);
//     return this.routeCache.get(routeKey) || null;
//   }

//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//     console.log(curr.routeConfig)
//     return future.routeConfig === curr.routeConfig;
//   }

//   private getRouteKey(route: ActivatedRouteSnapshot): string {
//     return route?.routeConfig?.path || 'default'; // Sử dụng giá trị mặc định 'default'
//   }
   
// }

import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route?.data?.['reuse'] ?? false;
  }  

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      this.routeCache.set(this.getRouteKey(route), handle);
    }
  }
  
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const routeKey = this.getRouteKey(route);
    return this.routeCache.has(routeKey);
  }  

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const routeKey = this.getRouteKey(route);
    return this.routeCache.get(routeKey) || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.getRouteKey(future) === this.getRouteKey(curr);
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    // Tạo khóa route dựa trên các giá trị tham số quan trọng
    // Lấy đoạn đường URL từ ActivatedRouteSnapshot
    const urlSegments = route.url;

    // Dùng map để chuyển đổi mỗi đoạn đường thành chuỗi
    const urlSegmentStrings = urlSegments.map(segment => segment.toString());

    // Sử dụng join để chuyển đổi mảng thành một chuỗi
    let key = urlSegmentStrings.join('-');

    if (key === "truyen") {
      const genre = route.queryParams["the-loai"] || 'tl';
      const keyWord = route.queryParams["tu-tim-kiem"] || 'ttk';
      const keyWord1 = route.queryParams["tu-khoa"] || 'tk';
      const genre1 = route.queryParams["the-loai."] || 'tl1';
      const status = route.queryParams["trang-thai"] || 'tt';
      const chapLength = route.queryParams["do-dai-chuong"] || 'ddc';
      const page = route.queryParams["page"] || 'p';

      key = key + '-' + genre + '-' + keyWord + '-' + keyWord1 + '-' + genre1 + '-' + status + '-' + chapLength + '-' + page;
    }

    return key;
  }
}
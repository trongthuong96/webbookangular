// import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

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
//     return future.routeConfig === curr.routeConfig;
//   }

//   private getRouteKey(route: ActivatedRouteSnapshot): string {
//     return route?.routeConfig?.path || 'default'; // Sử dụng giá trị mặc định 'default'
//   }
   
// }

// credit for this workaround goes to dmitrimaltsev and ishor13. see https://github.com/angular/angular/issues/13869
// slightly modified to update redirects when a route is reused
@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {

  private cache = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data?.["reuse"];
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    const url = this.getRouteUrl(route);
    this.cache.set(url, {
      snapshot: route,
      handle: detachedTree
    });
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getRouteUrl(route);
    return !!this.cache.get(url);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getRouteUrl(route);
    const cached = this.cache.get(url);

    if (!cached) {
      return "";
    }

    const lastUpdated = cached.snapshot.data.lastUpdated;
    const currentUpdated = route.data["lastUpdated"];

    // So sánh thời gian cập nhật cuối, nếu quá cũ thì không dùng cache
    if (currentUpdated - lastUpdated > 60*60*1000) {  
      return "";
    }

    return cached.handle; 
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig; 
  }

  
  
  private getRouteUrl(route: ActivatedRouteSnapshot) {
    return route.url.join('/'); 
  }

}
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data && route.data['reuse'];
  }  

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      this.routeCache.set(this.getRouteKey(route), handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.routeCache.has(this.getRouteKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.routeCache.get(this.getRouteKey(route)) || null;
  }

  // retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
  //   const handle = this.routeCache.get(this.getRouteKey(route)) || null;

  //   if (handle) {
  //     // Scroll về đầu trang khi route được tái sử dụng
  //     window.scrollTo(0, 0);
  //   }

  //   return handle;
  // }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route?.routeConfig?.path ?? '';
  }  
}

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
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route?.routeConfig?.path || 'default'; // Sử dụng giá trị mặc định 'default'
  }
   
}

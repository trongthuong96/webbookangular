// title.service.ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private titleService: Title, private router: Router) {
    this.setupTitleUpdater();
  }

  private setupTitleUpdater(): void {
    // Lắng nghe sự kiện NavigationEnd để cập nhật tiêu đề
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const updatedTitle = this.getTitleFromRouteData();
      this.setTitle(updatedTitle);
    });
  }

  private getTitleFromRouteData(): string {
    // Lấy dữ liệu title từ route
    const snapshot = this.router.routerState.snapshot;
    let route = snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data['title'] || 'Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh';
  }

  setTitle(title: string): void {
    // Đặt tiêu đề
    this.titleService.setTitle(title);
  }
}

// // // sitemap-generator.service.ts
// // import { Injectable } from '@angular/core';
// // import { Routes, Router } from '@angular/router';
// // import { SitemapService } from 'ngx-sitemap';

// // // Your code here


// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class SitemapGeneratorService {
// //   constructor(private router: Router, private sitemapService: SitemapService) {}

// //   generateSitemap(): string {
// //     const routes: Routes = [
// //       { path: '', pathMatch: 'full', redirectTo: 'trang-chu' },
// //       // ...Thêm các route khác từ file routes.ts
// //     ];

// //     const sitemapXml = this.sitemapService.generateSitemap({
// //       url: 'https://your-website.com',
// //       routes: this.getRouteUrls(routes),
// //     });

// //     return sitemapXml;
// //   }

// //   private getRouteUrls(routes: Routes): string[] {
// //     const routeUrls: string[] = [];
// //     this.extractRouteUrls(routes, routeUrls);
// //     return routeUrls;
// //   }

// //   private extractRouteUrls(routes: Routes, routeUrls: string[], parentPath = ''): void {
// //     routes.forEach((route) => {
// //       const path = parentPath + '/' + (route.path || '');
// //       if (route.children) {
// //         this.extractRouteUrls(route.children, routeUrls, path);
// //       }
// //       if (path && path !== '**') {
// //         routeUrls.push(path);
// //       }
// //     });
// //   }
// // }

// // src/app/sitemap.service.ts

// import { Injectable } from '@angular/core';
// import { SitemapStream, streamToPromise } from 'sitemap';
// import { createWriteStream } from 'fs';

// @Injectable({
//   providedIn: 'root',
// })
// export class SitemapService {
//   constructor() {}

//   async generateSitemap(): Promise<void> {
//     const sitemap = new SitemapStream({ hostname: 'https://yourwebsite.com' });
    
//     // Add your URLs to the sitemap
//     sitemap.write({ url: '/', changefreq: 'daily', priority: 0.9 });
//     sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
//     // Add more URLs as needed...

//     sitemap.end();

//     const xml = await streamToPromise(sitemap).toString();
//     const filePath = './dist/sitemap.xml'; // Path where you want to save the sitemap
//     const writeStream = createWriteStream(filePath);

//     writeStream.write(xml);
//     writeStream.end();
//   }
// }

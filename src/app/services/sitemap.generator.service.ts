import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  generateDynamicSitemap(): string {
    if (isPlatformBrowser(this.platformId)) {
      const routes = this.router.config;
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      routes.forEach(route => {
        if (route.path) {
          // Customize the URL formatting based on your route structure
          const url = `
            <url>
              <loc>https://truyenmoi.click/${route.path}</loc>
              <changefreq>daily</changefreq>
              <priority>0.9</priority>
            </url>
          `;
          sitemap += url;
        }
      });

      sitemap += `</urlset>`;
      return sitemap;
    } else {
      return ''; // Trả về một giá trị mặc định trong môi trường server-side
    }
  }
}

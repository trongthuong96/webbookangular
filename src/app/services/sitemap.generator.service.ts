import { Injectable } from '@angular/core';
import { SitemapStream, streamToPromise } from 'sitemap';
//import { createWriteStream } from 'fs';

@Injectable({
  providedIn: 'root',
})
export class SitemapService {
  constructor() {}

  async generateSitemap(): Promise<void> {
    //const sitemap = new SitemapStream({ hostname: 'https://truyenmoi.click' });

    // Read slugs from your .txt file
    //const fs = require('fs');
    //const fileData = fs.readFileSync('./src/book-slug-file.txt', 'utf8');
    //const slugs = fileData.split('\n').map((slug: string) => slug.trim());

    // Add slugs to the sitemap
    // slugs.forEach((slug: any) => {
    //   if (slug) {
    //     const url = {
    //       url: `truyen/${slug}`, // Assuming the slugs are formatted correctly in the file
    //       changefreq: 'daily', // set change frequency as needed
    //       priority: 0.9, // set priority as needed
    //     };
    //     sitemap.write(url);
    //   }
    // });

    // sitemap.end();

    // const xml = await streamToPromise(sitemap).then((data: any) => data.toString());
    //const filePath = './src/sitemap.xml'; // Path where you want to save the sitemap
    //const writeStream = createWriteStream(filePath);

    // writeStream.write(xml);
    // writeStream.end();
  }
}

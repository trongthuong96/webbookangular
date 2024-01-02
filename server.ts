import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { SitemapService } from './src/app/services/sitemap.generator.service';
//import proxyConfig from 'proxy.conf.js';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // server.get('/sitemap.xml', (req, res) => {
  //   const sitemap = sitemapService.generateDynamicSitemap();
  //   res.header('Content-Type', 'application/xml');
  //   res.send(sitemap);
  // });

  // Thêm proxy vào sau đó
//server.use(Proxy(proxyConfig));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => {
        // Xóa đoạn script sau khi render xong
        // html = html.replace(/<script id="ng-state"[^>]*>[\s\S]*?<\/script>/gm, ''); 
        // html = html.replace(/<transfer-state(.*?)<\/transfer-state>/g,'');
        
        res.send(html);
    
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  /**
   *
   */

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

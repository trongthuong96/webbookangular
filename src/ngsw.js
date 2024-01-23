// src/ngsw.js
importScripts('ngsw-worker.js');

self.addEventListener('activate', event => {

  event.waitUntil(
    (async () => {
      await self.registration.navigationPreload.enable();
    })()
  );

});
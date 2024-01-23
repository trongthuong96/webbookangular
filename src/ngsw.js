// src/ngsw.js
importScripts('ngsw-worker.js');

self.addEventListener('activate', event => {
  event.waitUntil(self.registration.navigationPreload.enable());
});
const CACHE='indicamed-v5.0';
const ASSETS=['./','./index.html','./styles.css?v=5.0','./app.js?v=5.0','./manifest.webmanifest','./icon.svg','./firma-jeronimo.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith((async () => {
    try {
      const fresh = await fetch(request);
      const cache = await caches.open(CACHE);
      cache.put(request, fresh.clone());
      return fresh;
    } catch (error) {
      return (await caches.match(request)) || (await caches.match('./index.html'));
    }
  })());
});

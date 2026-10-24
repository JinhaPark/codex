const CACHE = 'ca26-pages-v35-korea-reference';
const CACHE_PREFIX = 'ca26-pages-';
const ROOT = '/codex/';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add(ROOT)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(ROOT)) return;

  event.respondWith(caches.open(CACHE).then(async cache => {
    // Refresh the document online so an old cached page cannot hide published changes.
    // Hashed assets keep their cache-first policy; offline navigation keeps the saved page.
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (!response.ok) throw new Error('Navigation unavailable');
        event.waitUntil(cache.put(ROOT, response.clone()).catch(() => {}));
        return response;
      } catch {
        return (await cache.match(ROOT)) || (await cache.match(request)) || Response.error();
      }
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        // Keep the worker alive until offline storage completes, without delaying the response.
        event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
      }
      return response;
    } catch {
      return request.mode === 'navigate' ? cache.match(ROOT) : Response.error();
    }
  }));
});

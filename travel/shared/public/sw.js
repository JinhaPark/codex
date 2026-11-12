// The former repository-wide worker must no longer intercept either travel page.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ca26-pages-')).map(k=>caches.delete(k))))
 .then(()=>self.registration.unregister()).then(()=>self.clients.claim())
));
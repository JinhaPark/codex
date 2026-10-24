const ROOT='/codex/caucasus/';
const CACHE='ca26-caucasus-v3';
const PREFIX='ca26-caucasus-';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.add(ROOT)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
const request=e.request,url=new URL(request.url);
if(request.method!=='GET'||url.origin!==self.location.origin||!(url.pathname.startsWith(ROOT)||url.pathname.startsWith('/codex/assets/')||url.pathname.startsWith('/codex/illustrations/')))return;
e.respondWith(caches.open(CACHE).then(async cache=>{
if(request.mode==='navigate'){try{const r=await fetch(request,{cache:'no-store'});if(!r.ok)throw Error('offline');e.waitUntil(cache.put(ROOT,r.clone()).catch(()=>{}));return r;}catch{return await cache.match(ROOT)||Response.error();}}
const cached=await cache.match(request);if(cached)return cached;
try{const r=await fetch(request);if(r.ok)e.waitUntil(cache.put(request,r.clone()).catch(()=>{}));return r;}catch{return Response.error();}
}));
});
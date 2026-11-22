/* Imi service worker: app shell offline, never caches Firebase or your data. */
const V="imi-v3",SHELL=["./","manifest.webmanifest","offline.html","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const STATIC=/^(fonts\.googleapis\.com|fonts\.gstatic\.com|unpkg\.com|www\.gstatic\.com)$/;
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put("./",c));return x}).catch(()=>caches.match("./").then(x=>x||caches.match("offline.html"))));return}
  if(u.origin===location.origin||STATIC.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>hit);return hit||net}))}
});

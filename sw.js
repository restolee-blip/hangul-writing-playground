const prefix='sseuk-shell:'+self.registration.scope+':';
const name=prefix+'v4.6';
const shell='./index.html';

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(name)
  .then(cache=>cache.add(new Request(shell,{cache:'reload'})))
  .then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys()
  .then(keys=>Promise.all(keys.filter(key=>key.startsWith(prefix)&&key!==name).map(key=>caches.delete(key))))
  .then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.mode!=='navigate'||new URL(request.url).origin!==location.origin)return;
 event.respondWith(fetch(request,{cache:'no-store'}).catch(async error=>{
  const cache=await caches.open(name);
  const offlinePage=await cache.match(shell);
  if(offlinePage)return offlinePage;
  throw error;
 }));
});

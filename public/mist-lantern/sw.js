const CACHE='mist-lantern-mobile-9012fc33ace9';
const FILES=["./","./index.html","./manifest.webmanifest","./art-review.html","./icons/icon-192.png","./icons/icon-512.png","./assets/index-C0sXyR7r.js","./assets/index-Xv5IaQSe.css","./art/chapter-0.webp","./art/chapter-1.webp","./art/chapter-2.webp","./art/chapter-3.webp","./art/chapter-4.webp","./art/chapter-5.webp","./art/chapter-6.webp","./art/chapter-7.webp","./art/enemies.webp","./art/portraits.webp","./art/traveler.webp","./art/rework/characters.webp","./art/rework/hero-actions.webp","./art/rework/hero-walk.webp","./art/rework/monsters.webp","./art/rework/props.webp","./art/rework/village.webp"];
const scope=new URL(self.registration.scope);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(new URL(path,scope).href,{cache:'reload'})))));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mist-lantern-mobile-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(async()=>await caches.match(request)||await caches.match(new URL('./index.html',scope).href)));
 }else{
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;})));
 }
});

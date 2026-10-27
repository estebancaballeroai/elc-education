/* Application hors ligne après le premier chargement HTTPS. */
const CACHE='math-shift-v0.1.0';
const FILES=['./','./index.html','./styles.css','./content.js','./engine.js','./app.js','./manifest.webmanifest','./assets/observatoire.webp','./assets/mission.webp','./assets/explorateur.webp','./assets/nox.webp','./assets/icon-192.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('math-shift-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 if(new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});

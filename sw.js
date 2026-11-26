/* THEMAYSKIY Service Worker — быстрая загрузка на мобильном интернете */
const CACHE = 'themayskiy-v1';
self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin === location.origin) {
    event.respondWith(fetch(req).catch(function() { return caches.match(req); }));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|raw\.githubusercontent\.com|unpkg\.com/.test(url.hostname)) {
    event.respondWith(caches.open(CACHE).then(function(cache) {
      return cache.match(req).then(function(hit) {
        var net = fetch(req).then(function(res) { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(function() { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  /* Supabase и формы — только сеть */
});

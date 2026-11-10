// Caches the app shell so the page opens even with weak signal.
// Data (Supabase calls) is never cached here, so numbers are always fresh.
const CACHE = 'moneyhold-shell-v1';
const SHELL = ['index.html', 'config.js', 'manifest.json', 'icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Only handle our own files; let Supabase and CDN requests go straight to network.
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Minimal service worker: it only makes the game installable as an app. Nothing is cached,
// so every launch loads the latest deploy (no stale versions after an update).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') event.respondWith(fetch(event.request));
});

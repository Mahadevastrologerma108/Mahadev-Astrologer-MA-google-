const CACHE_NAME = 'mahadev-astro-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/js/translations.js',
  '/assets/js/layout.js',
  '/assets/images/logo.png'
];

// इंस्टॉल के समय ज़रूरी फाइल्स को सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔱 Pre-caching Astrology Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// नेटवर्क न होने पर कैशे से फाइल दिखाना
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
const CACHE_NAME = 'mahadev-astro-v1';

// 🔱 यहाँ हमने Cloudinary का असली लिंक डाल दिया है
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/js/translations.js',
  '/assets/js/layout.js',
  'https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png' 
];

// इंस्टॉल के समय ज़रूरी फाइल्स को सेव करना (Caching)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔱 Pre-caching Astrology Assets...');
      // cross-origin (Cloudinary) इमेज को कैशे करने के लिए { mode: 'no-cors' } की ज़रूरत नहीं पड़ती क्योंकि Cloudinary CORS सपोर्ट करता है।
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// नेटवर्क न होने पर कैशे से फाइल दिखाना (Offline Support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // अगर फाइल कैशे में है तो वही दिखाओ, वरना इंटरनेट से लाओ
      return response || fetch(event.request);
    })
  );
});

// 🔱 पुराना कैशे डिलीट करने का लॉजिक (ताकि जब आप साइट अपडेट करें, तो यूज़र को नया वर्ज़न दिखे)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🔱 Clearing Old Cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

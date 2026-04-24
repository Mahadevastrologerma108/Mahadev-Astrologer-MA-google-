// 🔱 MAHADEV ASTROLOGER MA - Service Worker 🔱

// 1. Firebase SDKs load karna (Background Messaging ke liye)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Firebase Initialize (Tumhari Config ke saath)
const firebaseConfig = {
  apiKey: "AIzaSyAgcfrzQm6wezgtU5Q5BP8wxXatmoWqYrw",
  authDomain: "mahadev-astrologer.firebaseapp.com",
  databaseURL: "https://mahadev-astrologer-default-rtdb.firebaseio.com",
  projectId: "mahadev-astrologer",
  storageBucket: "mahadev-astrologer.firebasestorage.app",
  messagingSenderId: "559664802739",
  appId: "1:559664802739:web:4285f4dc461f570cc2b9c6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 3. Background Notification Handler
// Jab App band ho, tab ye code notification dikhayega
messaging.onBackgroundMessage((payload) => {
  console.log('🔱 Background Notification Received:', payload);

  const notificationTitle = payload.notification.title || "Mahadev Astrologer MA";
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png',
    badge: 'https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png',
    data: payload.data // Click karne par URL open karne ke liye
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Offline Caching Logic (Tumhara Purana Code)
const CACHE_NAME = 'mahadev-astro-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/js/translations.js',
  '/assets/js/layout.js',
  'https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png' 
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔱 Pre-caching Astrology Assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Event (Offline Support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate Event (Purana Cache Delete karna)
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

// 5. Notification Click Event (Jab user notification par click kare)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Click karne par website/app khulegi
  );
});

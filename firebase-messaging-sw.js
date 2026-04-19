// 1. Firebase scripts ko import karein
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Firebase Initialize (Apna asli config yahan daalein)
// Ye details aapko Firebase Console > Project Settings mein milengi
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
// Jab user site par nahi hoga, tab ye message dikhayega
messaging.onBackgroundMessage((payload) => {
    console.log('🔱 Notification Received in Background:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png', // Aapka Cloudinary logo [cite: 2026-04-20]
        badge: 'https://res.cloudinary.com/dya3yxgch/image/upload/v12345/badge_icon.png', // Chota icon notification bar ke liye
        tag: 'panchang-update', // Taaki naya notification purane ko replace kar sake
        data: {
            url: payload.data.url || '/' // Click karne par kahan bhejna hai
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Notification Click Event
// Jab user notification par click karega toh kya hoga
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

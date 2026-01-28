self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (e) => {
  // Ye empty rakhein toh bhi PWA install ho jata hai
});
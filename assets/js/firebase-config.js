import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 🆕 Realtime Database ke liye ye import zaroori hai
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔱 1. NORMAL PROJECT (Appointments & Telegram Notifications)
const normalConfig = {
  apiKey: "AIzaSyAgcfrzQm6wezgtU5Q5BP8wxXatmoWqYrw",
  authDomain: "mahadev-astrologer.firebaseapp.com",
  databaseURL: "https://mahadev-astrologer-default-rtdb.firebaseio.com", // 🆕 Aapka Realtime DB URL
  projectId: "mahadev-astrologer",
  storageBucket: "mahadev-astrologer.firebasestorage.app",
  messagingSenderId: "559664802739",
  appId: "1:559664802739:web:4285f4dc461f570cc2b9c6"
};

// 🔱 2. STUDIO PROJECT (Healing Music & Calendar Logic)
const studioConfig = {
  apiKey: "AIzaSyDt-W8Fjg6kAz43XDoyDlGZRnw0nZLgh0I",
  authDomain: "mahadev-astrologer-studi-1dd6a.firebaseapp.com",
  projectId: "mahadev-astrologer-studi-1dd6a",
  storageBucket: "mahadev-astrologer-studi-1dd6a.firebasestorage.app",
  messagingSenderId: "5515803520",
  appId: "1:5515803520:web:20a1cf63c84e73006cdf65"
};

// Dono Projects ko Initialize karein
const normalApp = initializeApp(normalConfig);
const studioApp = initializeApp(studioConfig, "studioApp");

// --- Exports ---
const db = getFirestore(normalApp);        // Appointments ke liye
const dbStudio = getFirestore(studioApp);  // Studio ke liye

// 🆕 Panchang ke liye Realtime Database instance
const rtdb = getDatabase(normalApp); 

export { db, dbStudio, rtdb }; // rtdb ko bhi export kar rahe hain

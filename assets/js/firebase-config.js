import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔱 Login (Authentication) ke liye ye do zaroori hain
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// --- Dono Projects ko Initialize karein ---
const normalApp = initializeApp(normalConfig);
const studioApp = initializeApp(studioConfig, "studioApp");

// --- Firestore Instances ---
const db = getFirestore(normalApp);        // Appointments ke liye
const dbStudio = getFirestore(studioApp);  // Studio ke liye

// 🔱 Login (Authentication) Engine Setup
const auth = getAuth(normalApp);           // User Login control karne ke liye
const provider = new GoogleAuthProvider(); // Google service se jodne ke liye

// --- Final Exports ---
// Ab hum rtdb nahi balki auth aur provider export kar rahe hain
export { db, dbStudio, auth, provider };

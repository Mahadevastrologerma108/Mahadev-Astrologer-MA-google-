import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDt-W8Fjg6kAz43XDoyDlGZRnw0nZLgh0I",
  authDomain: "mahadev-astrologer-studi-1dd6a.firebaseapp.com",
  projectId: "mahadev-astrologer-studi-1dd6a",
  storageBucket: "mahadev-astrologer-studi-1dd6a.firebasestorage.app",
  messagingSenderId: "5515803520",
  appId: "1:5515803520:web:20a1cf63c84e73006cdf65",
  measurementId: "G-715D7KHCXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

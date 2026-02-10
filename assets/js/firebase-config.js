// Mahadev Studio - Firebase Central Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDRhZ9mqvpENVWH045UN7kp8Da-H264jU",
    authDomain: "mahadev-astrologer-ma-studio.firebaseapp.com",
    projectId: "mahadev-astrologer-ma-studio",
    storageBucket: "mahadev-astrologer-ma-studio.firebasestorage.app",
    messagingSenderId: "592702267049",
    appId: "1:592702267049:web:c18a13ddffab14d6f113b8",
    measurementId: "G-B4L9H04RYQ"
};

// Initialize Services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporting for use in other files
export { db, storage, analytics };

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAsS...", // Apni asli API Key yahan rehne dena
    authDomain: "mahadev-astrologer-ma.firebaseapp.com",
    databaseURL: "https://mahadev-astrologer-ma-default-rtdb.firebaseio.com",
    projectId: "mahadev-astrologer-ma",
    storageBucket: "mahadev-astrologer-ma.appspot.com",
    messagingSenderId: "353...",
    appId: "1:353...:web:..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb };

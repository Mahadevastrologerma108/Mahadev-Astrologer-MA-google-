import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔱 REMOTE CONFIG imports jodein
import { getRemoteConfig, fetchAndActivate, getString } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config.js";

const normalConfig = {
  apiKey: "AIzaSyAgcfrzQm6wezgtU5Q5BP8wxXatmoWqYrw",
  authDomain: "mahadev-astrologer.firebaseapp.com",
  databaseURL: "https://mahadev-astrologer-default-rtdb.firebaseio.com",
  projectId: "mahadev-astrologer",
  storageBucket: "mahadev-astrologer.firebasestorage.app",
  messagingSenderId: "559664802739",
  appId: "1:559664802739:web:4285f4dc461f570cc2b9c6"
};

const studioConfig = {
  apiKey: "AIzaSyDt-W8Fjg6kAz43XDoyDlGZRnw0nZLgh0I",
  authDomain: "mahadev-astrologer-studi-1dd6a.firebaseapp.com",
  projectId: "mahadev-astrologer-studi-1dd6a",
  storageBucket: "mahadev-astrologer-studi-1dd6a.firebasestorage.app",
  messagingSenderId: "5515803520",
  appId: "1:5515803520:web:20a1cf63c84e73006cdf65"
};

const normalApp = initializeApp(normalConfig);
const studioApp = initializeApp(studioConfig, "studioApp");

const db = getFirestore(normalApp);        
const dbStudio = getFirestore(studioApp);  
const auth = getAuth(normalApp);           
const provider = new GoogleAuthProvider(); 

// 🔱 1. Remote Config Initialize karein
const remoteConfig = getRemoteConfig(normalApp);

// 🔱 2. Fetch Interval Set karein (1 ghanta = 3600000ms)
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

// --- Final Exports ---
// Ab humne remoteConfig aur uske methods bhi export kar diye hain
export { db, dbStudio, auth, provider, remoteConfig, fetchAndActivate, getString };

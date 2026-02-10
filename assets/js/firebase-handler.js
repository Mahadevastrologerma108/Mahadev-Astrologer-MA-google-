import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 🔱 LOGIC 1: APPOINTMENT FORM (Sahi-Salamat)
// ==========================================
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        // Form se data nikalna
        const formData = {
            service: document.getElementById('service-select').value,
            name: document.getElementById('user-name').value,
            dob: document.getElementById('single-dob').value,
            time: document.getElementById('single-time').value,
            place: document.getElementById('single-place').value,
            timestamp: serverTimestamp() // Accurate Server Time
        };

        try {
            // Firestore ke 'appointments' collection mein save karna
            await addDoc(collection(db, "appointments"), formData);
            alert("🔱 Pranaam! Aapki details Mahadev Astrologer tak pahunch gayi hain. Hum aapse jald hi sampark karenge.");
            e.target.reset();
        } catch (error) {
            console.error("Form Error: ", error);
            alert("Kshama karein, kuch takniki kharabi hai. Kripya dobara koshish karein.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// ==========================================
// 🔱 LOGIC 2: HEALING MUSIC (New Logic)
// ==========================================
// 1. Music List Fetch karne ka function
export async function fetchHealingMusic() {
    try {
        const musicCol = collection(db, 'healing_music');
        const q = query(musicCol, orderBy('order', 'asc')); // Order ke hisab se setup
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Music fetch error:", error);
        return [];
    }
}

// 2. Lyrics Sync karne ka logic
export function getCurrentLyric(currentTime, lyricsArray) {
    if (!lyricsArray || !Array.isArray(lyricsArray)) return "";
    const current = lyricsArray.find(l => currentTime >= l.start && currentTime <= l.end);
    return current ? current.text : "";
}

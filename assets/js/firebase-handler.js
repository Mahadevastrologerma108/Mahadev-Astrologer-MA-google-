import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 🔱 LOGIC 1: APPOINTMENT FORM (Smart & Complete)
// ==========================================
const appointmentForm = document.getElementById('consultation-form');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        // 1. Basic Info
        const service = document.getElementById('service-select').value;
        const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
        const generateUID = document.getElementById('generate-uid').checked;

        // 2. Dynamic Data Collection (Jo service select hogi wahi data jayega)
        let submissionData = {
            service: service,
            name: document.getElementById('user-name').value,
            contact_method: contactMethod,
            contact_detail: document.getElementById('contact-detail').value,
            wants_uid: generateUID,
            timestamp: serverTimestamp()
        };

        // 3. Conditional Data (Kundli Matching vs Single Birth vs Palmistry)
        if (service === 'kundli_matching') {
            submissionData.male_details = {
                name: document.getElementById('m-name').value,
                dob: document.getElementById('m-dob').value,
                time: document.getElementById('m-time').value,
                place: document.getElementById('m-place').value
            };
            submissionData.female_details = {
                name: document.getElementById('f-name').value,
                dob: document.getElementById('f-dob').value,
                time: document.getElementById('f-time').value,
                place: document.getElementById('f-place').value
            };
        } else {
            // Baaki sab services ke liye single DOB data
            submissionData.dob = document.getElementById('single-dob').value;
            submissionData.time = document.getElementById('single-time').value || "N/A";
            submissionData.place = document.getElementById('single-place').value || "N/A";
        }

        try {
            // Firestore ke 'appointments' collection mein save
            await addDoc(collection(db, "appointments"), submissionData);
            
            alert("🔱 Pranaam! Aapka sandesh Mahadev tak pahunch gaya hai. Hum jald hi sampark karenge.");
            e.target.reset();
            
            // Form reset ke baad logic refresh karein (IDs wapas set karne ke liye)
            if(window.applyFormLogic) window.applyFormLogic();

        } catch (error) {
            console.error("Firebase Error: ", error);
            alert("Kshama karein, data save nahi ho paya. Kripya check karein internet ya humein direct WhatsApp karein.");
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

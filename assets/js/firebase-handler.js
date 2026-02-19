import { db, dbStudio, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev System: Deep Integration with Calendar Grid Fix.");

// --- 1. Configuration ---
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// --- 2. 🔱 Full Course Logic: Data -> UI -> Calendar -> Translation ---

window.getPanchangFromFirebase = async function(year) {
    console.log(`[Phase 1] Fetching ${year} Data...`);
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        
        if (snapshot.exists()) {
            const allYearData = snapshot.val();
            window["Data" + year] = allYearData; // Global storage for Calendar Logic
            
            console.log("[Phase 2] Data Received. Filling UI...");
            await window.updatePanchangDisplay(allYearData);
            
            // 🚩 THE CALENDAR GRID FIX:
            // Data load hone ke BAAD hi calendar ko order do grid banane ka
            console.log("[Phase 3] Building Calendar Grid...");
            if (typeof window.renderCalendar === 'function') {
                window.renderCalendar(); 
            } else {
                console.error("❌ Error: panchang-logic.js ka renderCalendar function nahi mila!");
            }

            // 🔱 Final Touch: Translation release
            console.log("[Phase 4] Releasing Translation...");
            if (window.applyTranslations) {
                window.applyTranslations(); 
            }
        }
    } catch (error) {
        console.error("❌ Critical System Error:", error);
    }
};

window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    // Aaj 20 Feb hai, toh automatic 02-20 uthayega
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const dayData = yearlyData[dateKey];
    if (!dayData) return;

    // Mapping Database to HTML IDs
    const uiMap = {
        'pan-tithi': dayData.tithi.hi,
        'pan-nak': dayData.nakshatra?.hi || "--",
        'pan-yoga': dayData.yoga?.hi || "--",
        'pan-karana': dayData.karan?.hi || "--",
        'pan-paksha': dayData.paksha?.hi || "--",
        'pan-sun': `${dayData.sun.rise} / ${dayData.sun.set}`,
        'pan-moon': dayData.moon?.rise || "--",
        'pan-muh': dayData.muhurat?.abhijit || "--",
        'pan-rahu': dayData.muhurat?.rahukaal || "--"
    };

    for (const [id, value] of Object.entries(uiMap)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    // Choghadiya Table Update
    const dayBody = document.getElementById('day-chaug-body');
    if (dayBody && dayData.choghadiya?.day) {
        dayBody.innerHTML = ""; 
        Object.entries(dayData.choghadiya.day).forEach(([time, name]) => {
            dayBody.innerHTML += `<tr><td>${time}</td><td>${name}</td><td>Shubh</td></tr>`;
        });
    }
    return true; 
};

// --- 3. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
});

// --- 4. Appointment Form Logic ---
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        const subData = {
            service: document.getElementById('service-select').value,
            name: document.getElementById('user-name').value,
            contact_method: document.querySelector('input[name="contact-method"]:checked').value,
            contact_detail: document.getElementById('contact-detail').value,
            timestamp: serverTimestamp()
        };
        try {
            await addDoc(collection(db, "appointments"), subData);
            alert("🔱 Sandesh Pahunch Gaya!");
            e.target.reset();
        } catch (err) { console.error(err); }
        finally { btn.innerText = "SEND REQUEST"; }
    });
}

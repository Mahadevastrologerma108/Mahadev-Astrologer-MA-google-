import { db, dbStudio, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev! Full System Restore Loading...");

const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// 1. Telegram Notification
async function notifyTelegram(data) {
    let message = `🔱 *New Divine Request!* 🔱\n\n👤 *Name:* ${data.name}\n✨ *Service:* ${data.service.toUpperCase()}\n📱 *Method:* ${data.contact_method}\n📍 *Detail:* ${data.contact_detail}\n`;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
    } catch (e) { console.error("Telegram Error", e); }
}

// 2. Appointment Form
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;
        let submissionData = {
            service: document.getElementById('service-select').value,
            name: document.getElementById('user-name').value,
            contact_method: document.querySelector('input[name="contact-method"]:checked').value,
            contact_detail: document.getElementById('contact-detail').value,
            timestamp: serverTimestamp()
        };
        try {
            await addDoc(collection(db, "appointments"), submissionData);
            await notifyTelegram(submissionData);
            alert("🔱 Pranaam! Message Sent.");
            e.target.reset();
        } catch (err) { alert("Error saving data."); }
        finally { btn.innerText = "SEND REQUEST"; btn.disabled = false; }
    });
}

// 3. 🔱 Panchang Fetch & Display (Updated for 20-28 Feb)
window.getPanchangFromFirebase = async function(year) {
    console.log(`[Firebase] Fetching Panchang for ${year}...`);
    try {
        const panchangRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panchangRef);
        
        let data = {};
        if (snapshot.exists()) {
            data = snapshot.val();
            window["Data" + year] = data; 
            console.log("✅ Data Loaded Successfully:", data);
            window.updatePanchangDisplay(data); 
        } else {
            console.warn("⚠️ No data found in Firebase for year:", year);
        }

        // 🔥 CRITICAL: Data mile ya na mile, calendar render hona chahiye
        if (typeof window.renderCalendar === 'function') {
            window.renderCalendar();
        } else {
            console.error("❌ renderCalendar function not found in panchang-logic.js");
        }
        return data;
    } catch (error) {
        console.error("Firebase Error:", error);
        if (typeof window.renderCalendar === 'function') window.renderCalendar();
        return {};
    }
};

window.updatePanchangDisplay = function(yearlyData, customDate = null) {
    const today = new Date();
    // Agar date select nahi ki, toh aaj ki dikhao. Agar aaj ka data nahi hai toh list mein se koi bhi date dikhao
    let dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let dayData = yearlyData[dateKey];

    // Testing ke liye: Agar aaj ka data nahi hai (20 se pehle), toh 02-20 ka data default dikhao
    if (!dayData && yearlyData["02-20"]) {
        dayData = yearlyData["02-20"];
        console.log("Showing default data for 02-20 as test.");
    }

    if (!dayData) return;

    const mapping = {
        'pan-tithi': dayData.tithi.hi,
        'pan-nak': dayData.nakshatra ? dayData.nakshatra.hi : "--",
        'pan-yoga': dayData.yoga ? dayData.yoga.hi : "--",
        'pan-karana': dayData.karan ? dayData.karan.hi : "--",
        'pan-paksha': dayData.paksha ? dayData.paksha.hi : "--",
        'pan-sun': dayData.sun ? `${dayData.sun.rise} / ${dayData.sun.set}` : "--",
        'pan-muh': dayData.muhurat ? dayData.muhurat.abhijit : "--"
    };

    for (const [id, value] of Object.entries(mapping)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    // Choghadiya
    const dayBody = document.getElementById('day-chaug-body');
    if(dayBody && dayData.choghadiya && dayData.choghadiya.day) {
        dayBody.innerHTML = "";
        Object.entries(dayData.choghadiya.day).forEach(([time, name]) => {
            dayBody.innerHTML += `<tr><td>${time}</td><td>${name}</td><td>-</td></tr>`;
        });
    }
};

// Start Load
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
});

// Extras
export async function fetchHealingMusic() {
    try {
        const snapshot = await getDocs(query(collection(dbStudio, 'healing_music'), orderBy('order', 'asc')));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) { return []; }
}

window.applyFormLogic = function() {
    const service = document.getElementById('service-select').value;
    document.getElementById('section-matching').style.display = service === 'kundli_matching' ? 'block' : 'none';
    document.getElementById('section-single').style.display = service === 'kundli_matching' ? 'none' : 'block';
};

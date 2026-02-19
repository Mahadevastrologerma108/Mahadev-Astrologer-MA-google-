// 🔱 Step 1: All Imports (Directly from CDN)
import { db, dbStudio, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev! Fresh Handler Loaded with Full Integration.");

// 🔱 Step 2: Configuration
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// 🔱 Step 3: Telegram & Form Logic (Stable)
async function notifyTelegram(data) {
    let message = `🔱 *New Divine Request!* 🔱\n\n`;
    message += `👤 *Name:* ${data.name}\n`;
    message += `✨ *Service:* ${data.service.toUpperCase()}\n`;
    message += `📱 *Method:* ${data.contact_method}\n`;
    message += `📍 *Detail:* \`${data.contact_detail}\` \n\n`;

    if (data.service === 'kundli_matching') {
        message += `♂️ *Male:* ${data.male_details.name} | ${data.male_details.dob}\n`;
        message += `♀️ *Female:* ${data.female_details.name} | ${data.female_details.dob}\n`;
    } else {
        message += `📅 *DOB:* ${data.dob}\n`;
        message += `🌍 *Place:* ${data.place}\n`;
    }
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
    } catch (err) { console.error("Telegram Error:", err); }
}

const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        const service = document.getElementById('service-select').value;
        const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;

        let submissionData = {
            service: service,
            name: document.getElementById('user-name').value,
            contact_method: contactMethod,
            contact_detail: document.getElementById('contact-detail').value,
            wants_uid: document.getElementById('generate-uid').checked,
            timestamp: serverTimestamp()
        };

        if (service === 'kundli_matching') {
            submissionData.male_details = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value, time: document.getElementById('m-time').value, place: document.getElementById('m-place').value };
            submissionData.female_details = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value, time: document.getElementById('f-time').value, place: document.getElementById('f-place').value };
        } else {
            submissionData.dob = document.getElementById('single-dob').value;
            submissionData.time = document.getElementById('single-time').value || "N/A";
            submissionData.place = document.getElementById('single-place').value || "N/A";
        }

        try {
            await addDoc(collection(db, "appointments"), submissionData);
            await notifyTelegram(submissionData);
            alert("🔱 Pranaam! Aapka sandesh Mahadev tak pahunch gaya hai.");
            e.target.reset();
        } catch (error) { alert("Kshama karein, data save nahi ho paya."); }
        finally { btn.innerText = "SEND REQUEST"; btn.disabled = false; }
    });
}

// 🔱 Step 4: Panchang Logic (Synchronized with your HTML IDs)
window.getPanchangFromFirebase = async function(year) {
    console.log(`[Firebase] Loading Panchang for ${year}...`);
    try {
        const panchangRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panchangRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; // Safe for Calendar use
            window.updatePanchangDisplay(data); 
            
            // Re-render Calendar to show Indicators
            if (typeof window.renderCalendar === 'function') {
                window.renderCalendar();
            }
            return data;
        }
    } catch (error) { console.error("Firebase RTDB Error:", error); }
    return {};
};

window.updatePanchangDisplay = function(yearlyData, customDate = null) {
    let dateKey;
    if (customDate) {
        dateKey = customDate; // Use if a user clicks a calendar date
    } else {
        const today = new Date();
        dateKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    const dayData = yearlyData[dateKey];
    if (!dayData) return;

    // Mapping Database to your HTML IDs (pan-tithi, pan-nak, etc.)
    const mapping = {
        'pan-tithi': dayData.tithi.hi,
        'pan-nak': dayData.nakshatra ? dayData.nakshatra.hi : "--",
        'pan-yoga': dayData.yoga ? dayData.yoga.hi : "--",
        'pan-karana': dayData.karan ? dayData.karan.hi : "--",
        'pan-paksha': dayData.paksha ? dayData.paksha.hi : "--",
        'pan-sun': `${dayData.sun.rise} / ${dayData.sun.set}`,
        'pan-muh': dayData.muhurat ? dayData.muhurat.abhijit : "--"
    };

    for (const [id, value] of Object.entries(mapping)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    // Choghadiya Table (Day Only for now)
    const dayBody = document.getElementById('day-chaug-body');
    if(dayBody && dayData.choghadiya) {
        dayBody.innerHTML = "";
        Object.entries(dayData.choghadiya.day).forEach(([time, name]) => {
            dayBody.innerHTML += `<tr><td>${time}</td><td>${name}</td><td>-</td></tr>`;
        });
    }
};

// 🔱 Step 5: Start Everything
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    window.getPanchangFromFirebase(2026);
});

// 🔱 Step 6: Extras (Music & Form Logic)
export async function fetchHealingMusic() {
    try {
        const musicCol = collection(dbStudio, 'healing_music');
        const q = query(musicCol, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) { return []; }
}

window.applyFormLogic = function() {
    const service = document.getElementById('service-select').value;
    document.getElementById('section-matching').style.display = service === 'kundli_matching' ? 'block' : 'none';
    document.getElementById('section-single').style.display = service === 'kundli_matching' ? 'none' : 'block';
};

window.syncContactMethod = function(method) {
    const input = document.getElementById('contact-detail');
    input.placeholder = method === 'WA' ? "WhatsApp Number" : (method === 'TG' ? "Telegram Username" : "Email Address");
};

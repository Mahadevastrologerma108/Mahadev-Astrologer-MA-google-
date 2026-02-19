// 🔱 Step 1: All Imports
import { db, dbStudio, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev! Full Detailed Handler Loaded.");

// 🔱 Step 2: Telegram Configuration
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// 🔱 Step 3: Telegram Notification Function (Full Logic)
async function notifyTelegram(data) {
    console.log("Preparing Telegram notification...");
    let message = `🔱 *New Divine Request!* 🔱\n\n`;
    message += `👤 *Name:* ${data.name}\n`;
    message += `✨ *Service:* ${data.service.replace('_', ' ').toUpperCase()}\n`;
    message += `📱 *Method:* ${data.contact_method}\n`;
    message += `📍 *Detail:* \`${data.contact_detail}\` \n\n`;

    if (data.service === 'kundli_matching') {
        message += `♂️ *Male:* ${data.male_details.name} | ${data.male_details.dob}\n`;
        message += `♀️ *Female:* ${data.female_details.name} | ${data.female_details.dob}\n`;
    } else {
        message += `📅 *DOB:* ${data.dob}\n`;
        message += `⏰ *Time:* ${data.time}\n`;
        message += `🌍 *Place:* ${data.place}\n`;
    }
    message += `\n🆔 *UID Requested:* ${data.wants_uid ? '✅ Yes' : '❌ No'}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
        console.log("Telegram Response Status:", response.status);
    } catch (err) {
        console.error("Telegram Error:", err);
    }
}

// 🔱 Step 4: Appointment Form Logic (Safe & Tested)
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        const service = document.getElementById('service-select').value;
        const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
        const generateUID = document.getElementById('generate-uid').checked;

        let submissionData = {
            service: service,
            name: document.getElementById('user-name').value,
            contact_method: contactMethod,
            contact_detail: document.getElementById('contact-detail').value,
            wants_uid: generateUID,
            timestamp: serverTimestamp()
        };

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
            submissionData.dob = document.getElementById('single-dob').value;
            submissionData.time = document.getElementById('single-time').value || "N/A";
            submissionData.place = document.getElementById('single-place').value || "N/A";
        }

        try {
            await addDoc(collection(db, "appointments"), submissionData);
            await notifyTelegram(submissionData);
            alert("🔱 Pranaam! Aapka sandesh Mahadev tak pahunch gaya hai.");
            e.target.reset();
        } catch (error) {
            console.error("Firestore Error:", error);
            alert("Kshama karein, data save nahi ho paya.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// 🔱 Step 5: Panchang Database Logic (FULL RECOVERY)
window.getPanchangFromFirebase = async function(year) {
    console.log(`[Firebase] Fetching data for ${year}...`);
    try {
        const panchangRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panchangRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; 
            window.updatePanchangDisplay(data); 
            
            // Re-render calendar to show indicators/glow
            if (window.renderCalendar) {
                console.log("Refreshing Calendar Indicators...");
                window.renderCalendar();
            }
            return data;
        }
    } catch (error) {
        console.error("Firebase RTDB Error:", error);
    }
    return {};
};

window.updatePanchangDisplay = function(yearlyData) {
    const today = new Date();
    const dateKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const dayData = yearlyData[dateKey];
    
    if (!dayData) {
        console.warn("No data found for date:", dateKey);
        return;
    }

    // Fill UI Elements
    if(document.getElementById('tithi')) document.getElementById('tithi').innerText = dayData.tithi.hi;
    if(document.getElementById('nakshatra')) document.getElementById('nakshatra').innerText = dayData.nakshatra.hi;
    if(document.getElementById('yoga')) document.getElementById('yoga').innerText = dayData.yoga.hi;
    if(document.getElementById('karan')) document.getElementById('karan').innerText = dayData.karan.hi;
    if(document.getElementById('paksha')) document.getElementById('paksha').innerText = dayData.paksha.hi;
    if(document.getElementById('sunrise')) document.getElementById('sunrise').innerText = dayData.sun.rise;
    if(document.getElementById('sunset')) document.getElementById('sunset').innerText = dayData.sun.set;
    if(document.getElementById('abhijit-muhurat')) document.getElementById('abhijit-muhurat').innerText = dayData.muhurat.abhijit;

    // Choghadiya Logic
    const chogContainer = document.getElementById('choghadiya-list');
    if(chogContainer && dayData.choghadiya) {
        chogContainer.innerHTML = "";
        Object.entries(dayData.choghadiya.day).forEach(([time, name]) => {
            const row = `<tr><td>${time}</td><td>${name}</td></tr>`;
            chogContainer.innerHTML += row;
        });
    }
};

// Auto-Load on Refresh
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
});

// 🔱 Step 6: Healing Music Logic
export async function fetchHealingMusic() {
    try {
        const musicCol = collection(dbStudio, 'healing_music');
        const q = query(musicCol, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        return [];
    }
}

// 🔱 Step 7: Global Helper Functions
window.applyFormLogic = function() {
    const service = document.getElementById('service-select').value;
    const matchingSection = document.getElementById('section-matching');
    const singleSection = document.getElementById('section-single');
    const palmInstruction = document.getElementById('palm-instruction');

    if (service === 'kundli_matching') {
        matchingSection.style.display = 'block';
        singleSection.style.display = 'none';
        palmInstruction.style.display = 'none';
    } else if (service === 'palmistry') {
        matchingSection.style.display = 'none';
        singleSection.style.display = 'block';
        palmInstruction.style.display = 'block';
    } else {
        matchingSection.style.display = 'none';
        singleSection.style.display = 'block';
        palmInstruction.style.display = 'none';
    }
};

window.syncContactMethod = function(method) {
    const contactInput = document.getElementById('contact-detail');
    const warning = document.getElementById('email-warning');
    if (method === 'WA') {
        contactInput.placeholder = "WhatsApp Number";
        if(warning) warning.style.display = 'none';
    } else if (method === 'TG') {
        contactInput.placeholder = "Telegram Username/@id";
        if(warning) warning.style.display = 'none';
    } else {
        contactInput.placeholder = "Email Address";
        if(warning) warning.style.display = 'block';
    }
};

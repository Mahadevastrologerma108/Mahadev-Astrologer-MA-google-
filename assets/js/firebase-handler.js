import { db, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev Handler: Full Sandwich + Local Events + Form Logic Active.");

// --- 1. CONFIGURATION ---
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// --- 2. THE SANDWICH ENGINE ---
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; 

            // LAYER 1: Top Cards
            await window.updatePanchangDisplay(data);
            
            // LAYER 2 & 3: Calendar & Events
            if (typeof window.renderCalendar === 'function') {
                window.renderCalendar();
            } else {
                window.updateMonthlyEvents(); 
            }

            if (window.applyTranslations) window.applyTranslations();
        }
    } catch (e) { console.error("Sandwich Error:", e); }
};

// --- 3. LAYER 1: TOP SECTION ---
window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[dateKey];
    if (!d) return;

    const map = {
        'pan-tithi': d.tithi.hi, 'pan-nak': d.nakshatra?.hi || "--",
        'pan-yoga': d.yoga?.hi || "--", 'pan-karana': d.karan?.hi || "--",
        'pan-paksha': d.paksha?.hi || "--", 'pan-sun': `${d.sun.rise} / ${d.sun.set}`,
        'pan-moon': d.moon?.rise || "--", 'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    const fillTable = (id, cData) => {
        const body = document.getElementById(id);
        if (body && cData) {
            body.innerHTML = Object.entries(cData)
                .map(([time, name]) => `<tr><td>${time}</td><td>${name}</td><td class="nature-shubh">Shubh</td></tr>`).join('');
        }
    };
    if (d.choghadiya) {
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    }
    return true;
};

// --- 4. LAYER 3: BOTTOM SECTION (LOCAL FILE LOGIC - FIXED) ---
window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    if (!container) return;

    // Local file 'YEARLY_EVENTS_2026' se data lena
    const eventsData = window.YEARLY_EVENTS_2026;
    if (!eventsData) {
        container.innerHTML = "<p style='text-align:center;'>Data Loading...</p>";
        return;
    }

    const currentM = String((window.currentMonth || new Date().getMonth()) + 1).padStart(2, '0');
    const currentY = window.currentYear || 2026;
    let html = "";

    Object.keys(eventsData).sort().forEach(dateKey => {
        if (dateKey.startsWith(`${currentY}-${currentM}`)) {
            const dayNum = dateKey.split('-')[2];
            const event = eventsData[dateKey];
            html += `
                <div class="event-item-row">
                    <div class="ev-date">${dayNum}</div>
                    <div class="ev-info">
                        <h4 style="color:var(--gold); margin:0; font-family:'Cinzel'; font-size:15px;">${event.hi}</h4>
                        <p style="color:#888; margin:2px 0 0; font-size:11px;">${event.en}</p>
                    </div>
                </div>`;
        }
    });

    container.innerHTML = html || `<p style="text-align:center; color:#888; padding:20px;">No festivals this month.</p>`;
};

// --- 5. 🔱 FORM LOGIC (SURAKSHIT) ---
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        const service = document.getElementById('service-select').value;
        const subData = {
            service: service,
            name: document.getElementById('user-name').value,
            contact_method: document.querySelector('input[name="contact-method"]:checked').value,
            contact_detail: document.getElementById('contact-detail').value,
            timestamp: serverTimestamp()
        };

        if (service === 'kundli_matching') {
            subData.male_details = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value };
            subData.female_details = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value };
        } else {
            subData.dob = document.getElementById('single-dob').value;
            subData.place = document.getElementById('single-place').value;
        }

        try {
            await addDoc(collection(db, "appointments"), subData);
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: CHAT_ID, 
                    text: `🔱 *New Appointment!*\n👤 Name: ${subData.name}\n✨ Service: ${subData.service}`, 
                    parse_mode: 'Markdown' 
                })
            });
            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset();
        } catch (err) { console.error(err); alert("Kshama karein, error aaya."); }
        finally { btn.innerText = "SEND REQUEST"; btn.disabled = false; }
    });
}

window.applyFormLogic = function() {
    const s = document.getElementById('service-select').value;
    const mSec = document.getElementById('section-matching');
    const sSec = document.getElementById('section-single');
    if (mSec && sSec) {
        mSec.style.display = s === 'kundli_matching' ? 'block' : 'none';
        sSec.style.display = s === 'kundli_matching' ? 'none' : 'block';
    }
};

window.syncContactMethod = function(method) {
    const input = document.getElementById('contact-detail');
    if (input) input.placeholder = method === 'WA' ? "WhatsApp Number" : "Username/Email";
};

// --- 6. INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
});

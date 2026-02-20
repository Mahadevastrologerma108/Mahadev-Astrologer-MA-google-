import { db, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev Handler: Full Sandwich + Form Logic Active.");

// --- 1. CONFIGURATION ---
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// --- 2. THE SANDWICH ENGINE (Panchang -> Calendar -> Events) ---
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; 

            // LAYER 1: Panchang Cards & Choghadiya (TOP)
            await window.updatePanchangDisplay(data);
            
            // LAYER 2 & 3: Calendar Grid & Events List
            // Note: renderCalendar khud updateMonthlyEvents ko trigger karega
            if (typeof window.renderCalendar === 'function') {
                window.renderCalendar();
            } else {
                // Fallback agar calendar logic load na ho
                window.updateMonthlyEvents(data);
            }

            // Final: Language Translation Release
            if (window.applyTranslations) window.applyTranslations();
        }
    } catch (e) { console.error("Sandwich Error:", e); }
};

// --- 3. LAYER 1: TOP SECTION (Cards & Tables) ---
window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[dateKey];

    if (!d) return;

    // ID Mapping (Panchang Cards)
    const map = {
        'pan-tithi': d.tithi.hi,
        'pan-nak': d.nakshatra?.hi || "--",
        'pan-yoga': d.yoga?.hi || "--",
        'pan-karana': d.karan?.hi || "--",
        'pan-paksha': d.paksha?.hi || "--",
        'pan-sun': `${d.sun.rise} / ${d.sun.set}`,
        'pan-moon': d.moon?.rise || "--",
        'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    // Choghadiya Tables (Day & Night)
    const fillTable = (id, cData) => {
        const body = document.getElementById(id);
        if (body && cData) {
            body.innerHTML = Object.entries(cData)
                .map(([time, name]) => `<tr><td>${time}</td><td>${name}</td><td class="nature-shubh">Shubh</td></tr>`)
                .join('');
        }
    };

    if (d.choghadiya) {
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    }
    return true;
};

// --- 4. LAYER 3: BOTTOM SECTION (Monthly Events) ---
window.updateMonthlyEvents = function(yearlyData) {
    const container = document.getElementById('events-list');
    if (!container) return;

    // Calendar ke current month se sync
    const currentM = String((window.currentMonth || new Date().getMonth()) + 1).padStart(2, '0');
    let html = "";

    Object.keys(yearlyData).sort().forEach(key => {
        if (key.startsWith(currentM) && yearlyData[key].festivals) {
            const dayNum = key.split('-')[1];
            yearlyData[key].festivals.forEach(fest => {
                html += `
                <div class="event-item-row">
                    <div class="ev-date">${dayNum}</div>
                    <div class="ev-info">
                        <h4 style="color:var(--gold); margin:0; font-family:'Cinzel';">${fest}</h4>
                    </div>
                </div>`;
            });
        }
    });

    container.innerHTML = html || `<p style="text-align:center; color:#888; padding:20px;">No festivals this month.</p>`;
};

// --- 5. 🔱 FORM LOGIC (Surakshit & Full) ---
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

        // Matching vs Single details
        if (service === 'kundli_matching') {
            subData.male_details = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value };
            subData.female_details = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value };
        } else {
            subData.dob = document.getElementById('single-dob').value;
            subData.place = document.getElementById('single-place').value;
        }

        try {
            await addDoc(collection(db, "appointments"), subData);
            // Telegram Notify
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
        } catch (err) { 
            console.error(err);
            alert("Kshama karein, error aaya."); 
        } finally { 
            btn.innerText = "SEND REQUEST"; 
            btn.disabled = false; 
        }
    });
}

// Form Field Toggles
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

import { db, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev Handler: Panchang & Appointment System Active.");

// ==========================================
// 1. CONFIGURATION (TELEGRAM BOT)
// ==========================================
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// ==========================================
// 2. PANCHANG ENGINE (FIREBASE FETCH)
// ==========================================
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`)); 
        if (snapshot.exists()) {
            const data = snapshot.val();
            window = data; 

            await window.updatePanchangDisplay(data);
            
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
            window.updateMonthlyEvents(); 
            if (window.applyTranslations) window.applyTranslations();
        }
    } catch (e) { 
        console.error("🔱 Panchang Fetch Error:", e); 
    }
};

// ==========================================
// 3. UI UPDATE (TOP CARDS & CHOGHADIYA)
// ==========================================
window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    // Default format: MM-DD (e.g., "02-21")
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData;
    
    if (!d) return;

    // Safe extraction helper (supports both {hi: "..."} and direct string)
    const safeVal = (obj) => obj?.hi || obj || "--";

    const map = {
        'pan-tithi': safeVal(d.tithi), 'pan-nak': safeVal(d.nakshatra),
        'pan-yoga': safeVal(d.yoga), 'pan-karana': safeVal(d.karan),
        'pan-paksha': safeVal(d.paksha), 'pan-sun': d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--",
        'pan-moon': d.moon?.rise || d.moon || "--", 'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    Object.entries(map).forEach(() => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    const fillTable = (id, cData) => {
        const body = document.getElementById(id);
        if (body && cData) {
            body.innerHTML = Object.entries(cData).map(() => 
                `<tr>
                    <td style="color:var(--gold); font-weight:bold;">${time}</td>
                    <td>${name}</td>
                    <td class="nature-shubh" style="font-size:0.8em;">Shubh</td>
                </tr>`
            ).join('');
        }
    };

    if (d.choghadiya) {
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    }
};

// ==========================================
// 4. MONTHLY EVENTS (BOTTOM LIST)
// ==========================================
window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    const eventsData = window.YEARLY_EVENTS_2026;
    if (!container || !eventsData) return;

    const currentM = String((window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + 1).padStart(2, '0');
    const currentY = window.currentYear || 2026;
    let html = "";

    Object.entries(eventsData).sort().forEach(() => {
        if (dateKey.startsWith(`${currentY}-${currentM}`)) {
            const dayNum = dateKey.split('-');
            html += `
                <div class="event-item-card">
                    <div class="event-date-badge">${dayNum}</div>
                    <div class="event-details">
                        <h4 style="color:var(--gold); margin:0; font-size:16px;">${event.hi || event.en}</h4>
                        <p style="color:#aaa; margin:2px 0 0; font-size:12px;">${event.en || event.hi}</p>
                    </div>
                </div>`;
        }
    });

    container.innerHTML = html || `<p style="text-align:center; color:#888; padding:20px;">No major festivals this month.</p>`;
};

// ==========================================
// 5. APPOINTMENT FORM LOGIC & TELEGRAM
// ==========================================
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        try {
            const service = document.getElementById('service-select').value;
            const name = document.getElementById('user-name').value;
            const contactMethod = document.querySelector('input:checked').value;
            const contactDetail = document.getElementById('contact-detail').value;

            const subData = {
                service, name, contact_method: contactMethod, contact_detail: contactDetail,
                timestamp: serverTimestamp()
            };

            // Conditional Data based on Service
            if (service === 'kundli_matching') {
                subData.male_details = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value };
                subData.female_details = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value };
            } else {
                subData.dob = document.getElementById('single-dob').value;
                subData.place = document.getElementById('single-place').value;
            }

            // 1. Save to Firestore
            await addDoc(collection(db, "appointments"), subData);

            // 2. Send Telegram Notification
            const tgMessage = `🔱 *New Appointment Request!*\n\n👤 *Name:* ${name}\n✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n📞 *Contact:* ${contactDetail} (${contactMethod})`;
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
            });

            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset();
            window.applyFormLogic(); // Reset UI state

        } catch (err) { 
            console.error("🔱 Form Error:", err); 
            alert("Kshama karein, network error aaya. Kripya dobara koshish karein."); 
        } finally { 
            btn.innerText = "SEND REQUEST"; 
            btn.disabled = false; 
        }
    });
}

// UI Toggles for Form
window.applyFormLogic = function() {
    const isMatching = document.getElementById('service-select')?.value === 'kundli_matching';
    const mSec = document.getElementById('section-matching');
    const sSec = document.getElementById('section-single');
    
    if (mSec && sSec) {
        mSec.style.display = isMatching ? 'block' : 'none';
        sSec.style.display = isMatching ? 'none' : 'block';
    }
};

window.syncContactMethod = function(method) {
    const input = document.getElementById('contact-detail');
    if (input) input.placeholder = method === 'WA' ? "WhatsApp Number" : "Username / Email ID";
};

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
    window.applyFormLogic(); // Initialize form state
});

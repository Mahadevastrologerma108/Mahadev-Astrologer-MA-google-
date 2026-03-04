// 1. Firebase Config se zaruri instances mangwayein
// rtdb hata diya gaya hai, auth aur provider jodd diya gaya hai
import { db, dbStudio, auth, provider } from './firebase-config.js'; 

// 2. Firestore ke liye zaruri tools (Appointments ke liye)
import { 
    collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 3. 🆕 Auth (Login) ke liye zaruri tools
import { 
    signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("🔱 Mahadev Handler: Login & Appointment System Active.");

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
// 5a. SOUND HEALING SPECIAL LOGIC
// ==========================================

window.handleSoundHealingSubmit = async function(event, method, dosha) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button');
    const originalBtnText = btn.innerText;

    btn.innerText = "🔱 MAPPING VIBRATIONS...";
    btn.disabled = true;

    try {
        // Form Data Capture
        const formData = new FormData(form);
        const name = form.querySelector('input[placeholder="Full Name"]').value;
        const contact = form.querySelector('input[type="tel"]').value;
        const extraInfo = form.querySelector('textarea')?.value || "None";
        
        // Dynamic Fields based on Method
        let specificDetails = {};
        if (method === 'Kundali' || method === 'Numerology') {
            specificDetails.dob = form.querySelector('input[type="date"]').value;
            if(method === 'Kundali') {
                specificDetails.birth_time = form.querySelector('input[type="time"]').value;
                specificDetails.birth_place = form.querySelector('input[placeholder*="Place"]').value;
            }
        } else if (method === 'Palmistry') {
            specificDetails.current_location = form.querySelector('input[placeholder*="Location"]').value;
        }

        const subData = {
            service: "Sound Healing",
            method: method,
            detected_dosha: dosha,
            name: name,
            contact_detail: contact,
            details: specificDetails,
            notes: extraInfo,
            timestamp: serverTimestamp()
        };

        // 1. Save to Firestore (Same Database, New Category)
        await addDoc(collection(db, "appointments"), subData);

        // 2. Send Telegram Notification (Premium Format)
        const tgMessage = `🔱 *New SOUND HEALING Request!*\n\n` +
                          `👤 *Name:* ${name}\n` +
                          `🌀 *Dosha:* ${dosha}\n` +
                          `🛠️ *Method:* ${method}\n` +
                          `📞 *Contact:* ${contact}\n` +
                          `📝 *Note:* ${extraInfo}`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
        });

        // 3. SPECIAL REACTION: UI Transformation
        const container = document.getElementById('dosha-quiz-container');
        container.innerHTML = `
            <div class="divine-success" style="padding: 40px; text-align: center; animation: fadeIn 1s;">
                <div class="divine-symbol" style="font-size: 4rem; margin-bottom:20px;">🕉️</div>
                <h2 class="gold-text">VIBRATIONAL DATA CAPTURED!</h2>
                <p style="color: #fff; margin-top: 15px;">Mahadev ki kripa se aapki <b>Frequency Mapping</b> shuru ho gayi hai.</p>
                <div style="background: rgba(245,197,66,0.1); padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px dashed var(--gold);">
                    <p style="font-size: 0.95rem; line-height:1.6;">Hamare experts aapke <b>${dosha}</b> dosha aur planets ke hisaab se <b>Personalized Sound Frequency</b> calculate kar rahe hain.</p>
                </div>
                <p style="font-size: 0.8rem; color: #888;">Aapko WhatsApp par jald hi report aur 'Healing Key' mil jayegi.</p>
            </div>
        `;
        
        container.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error("🔱 Sound Form Error:", err);
        alert("Kshama karein, vibrations connect nahi ho payi. Dobara koshish karein.");
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
};

// ==========================================
// 6. FEEDBACK & RATING SYSTEM (MODULAR)
// ==========================================

// A. Feedback Submit Karne ka Logic
window.submitFeedback = async function() {
    const feedbackText = document.getElementById('user-feedback').value;
    const rating = window.selectedRating || 0;
    const lang = localStorage.getItem('selectedLanguage') || 'en';

    if (!feedbackText || rating === 0) {
        alert(lang === 'hi' ? "कृपया रेटिंग और संदेश दोनों भरें।" : "Please provide both rating and feedback.");
        return;
    }

    try {
        await addDoc(collection(db, "feedbacks"), {
            text: feedbackText,
            rating: parseInt(rating),
            timestamp: serverTimestamp(),
            status: "approved"
        });

        alert(lang === 'hi' ? "आपका अनुभव साझा करने के लिए धन्यवाद! 🚩" : "Thank you for sharing your experience! 🚩");
        
        document.getElementById('user-feedback').value = "";
        window.location.reload(); 
    } catch (error) {
        console.error("🔱 Feedback Error:", error);
        alert("Error saving feedback.");
    }
};

// B. Feedbacks Live Dikhane ka Logic
window.fetchFeedbacks = async function() {
    const container = document.getElementById('display-feedbacks');
    if (!container) return;

    try {
        const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = `<p style="color:#666;">Be the first to share your experience!</p>`;
            return;
        }

        let html = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
            html += `
                <div class="feedback-item" style="margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 15px; animation: fadeIn 0.5s;">
                    <div style="color: #f5c542; font-size: 1.2rem; letter-spacing:3px;">${stars}</div>
                    <p style="font-size: 1rem; color:#eee; margin: 10px 0; font-style: italic;">"${data.text}"</p>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error("🔱 Fetch Feedback Error:", err);
    }
};

// ==========================================
// 7. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
    window.applyFormLogic(); // Initialize form state
    
    // 🔱 Ye line add karni hai
    if (typeof window.fetchFeedbacks === 'function') {
        window.fetchFeedbacks(); 
    }
});


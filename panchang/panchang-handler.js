import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. Central Report & Execute Function 🔱
window.masterTranslatePanchang = async function() {
    console.log("🔱 Master Translation Watcher: STARTING...");
    
    // User ki bhasha uthao
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    
    // A. DATA FETCH (Firebase se data confirm karo)
    if (!window["Data2026"]) {
        console.warn("🔱 Waiting for Firebase Data...");
        await window.getPanchangFromFirebase(2026);
    }
    
    const yearlyData = window["Data2026"];
    const today = new Date();
    // Custom date logic agar user ne calendar se select kiya hai
    const activeDate = window.selectedPanchangDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[activeDate];

    if (d) {
        // B. TRANSLATE TOP CARDS (Firebase Data)
        const elements = {
            'pan-tithi': currentLang === 'hi' ? d.tithi?.hi : d.tithi?.en,
            'pan-nak': currentLang === 'hi' ? d.nakshatra?.hi : d.nakshatra?.en,
            'pan-yoga': currentLang === 'hi' ? d.yoga?.hi : d.yoga?.en,
            'pan-karana': currentLang === 'hi' ? d.karan?.hi : d.karan?.en,
            'pan-paksha': currentLang === 'hi' ? d.paksha?.hi : d.paksha?.en,
            'pan-sun': d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--",
            'pan-moon': d.moon?.rise || "--",
            'pan-muh': d.muhurat?.abhijit || "--",
            'pan-rahu': d.muhurat?.rahukaal || "--"
        };

        Object.entries(elements).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || "--";
        });

        // C. TRANSLATE CALENDAR MONTH (The "February" Fix)
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const mDisplay = document.getElementById('monthDisplay');
        if(mDisplay) {
            const currentMIndex = window.currentMonth !== undefined ? window.currentMonth : today.getMonth();
            const mKey = `mon_${monthNames[currentMIndex]}`;
            mDisplay.innerText = window.translations[currentLang][mKey] || mDisplay.innerText;
        }

        // D. TRANSLATE EVENTS (The "English/Hindi" Fix)
        window.updateMonthlyEvents();

        // E. TRANSLATE STATIC LABELS (The "Push" Fix)
        if (typeof window.applyTranslations === 'function') window.applyTranslations();

        console.log("🔱 Master Translation Watcher: COMPLETE ✅");
    }
};

// 2. Modified Event Functions
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            // Calendar grid ko pehle banne do
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
            // Phir translation chalao
            window.masterTranslatePanchang();
        }
    } catch (e) { console.error("🔱 Handler Error:", e); }
};

window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    if (!container || !window.YEARLY_EVENTS_2026) return;

    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + 1).padStart(2, '0');
    let html = "";

    Object.keys(window.YEARLY_EVENTS_2026).sort().forEach(dateKey => {
        if (dateKey.startsWith(`2026-${currentM}`)) {
            const dayNum = dateKey.split('-')[2];
            const event = window.YEARLY_EVENTS_2026[dateKey];
            // Yahan check karo agar English maangi hai aur event.en hai, toh wahi dikhao
            const eventTitle = (currentLang === 'en' && event.en) ? event.en : event.hi;
            
            html += `<div class="event-item-row"><div class="ev-date">${dayNum}</div><div class="ev-info"><h4>${eventTitle}</h4></div></div>`;
        }
    });
    container.innerHTML = html || `<p style="text-align:center; color:#888;">No festivals.</p>`;
};

// 3. LISTENERS (Har signal par Master ko bulao)
window.addEventListener('languageChanged', () => window.masterTranslatePanchang());
window.addEventListener('monthChanged', () => window.masterTranslatePanchang()); // Calendar badalne par
document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));
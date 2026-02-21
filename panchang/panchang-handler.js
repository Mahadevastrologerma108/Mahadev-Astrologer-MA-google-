// 1. FIREBASE IMPORTS
import { db, rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ================= 2. THE STRICTEST MIDDLEMAN =================
// Rule: Pehle Exact, phir Lowercase, phir Sentence Case, varna wahi return
const MiddleMan = {
    getTranslation: function(val) {
        if (!val) return "--";
        const lang = localStorage.getItem('selectedLanguage') || 'hi';
        const dict = window.translations?.[lang];
        if (!dict) return val;

        let originalVal = val.toString().trim();
        let lowerVal = originalVal.toLowerCase();
        let sentenceVal = lowerVal.charAt(0).toUpperCase() + lowerVal.slice(1);

        // Strict Check Order
        return dict[originalVal] || dict[lowerVal] || dict[sentenceVal] || originalVal;
    }
};

// ================= 3. BRAHMASTRA WATCHER (LANGUAGE) =================
let lastLang = localStorage.getItem('selectedLanguage') || 'hi';
setInterval(() => {
    let currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    if (currentLang !== lastLang) {
        lastLang = currentLang;
        console.log(`🚀 Brahmastra: Auto-Switching to ${currentLang}`);
        window.masterTranslatePanchang();
        window.renderCalendar();
        window.updatePanchangDisplay();
    }
}, 500);

// ================= 4. GLOBAL STATE =================
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();
window.yearlyPanchangData = null;

// ================= 5. DATA FETCHING =================
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`));
        if (snapshot.exists()) {
            window.yearlyPanchangData = snapshot.val();
            window.renderCalendar();
            window.updatePanchangDisplay();
        }
    } catch (e) { console.error("🔱 Firebase Error:", e); }
};

// ================= 6. UI DISPLAY (PANCHANG & CHOGHADIYA) =================
window.updatePanchangDisplay = function() {
    const data = window.yearlyPanchangData;
    if (!data) return;

    const mKey = String(window.currentMonth + 1).padStart(2, '0');
    const dKey = "d" + String(window.selectedDay).padStart(2, '0');
    const d = (data[mKey] && data[mKey][dKey]) ? data[mKey][dKey] : null;

    const updateLabel = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = MiddleMan.getTranslation(val || "--");
    };

    if (!d) {
        ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karana', 'pan-paksha'].forEach(id => updateLabel(id, "--"));
        return;
    }

    // Basic Panchang
    updateLabel('pan-tithi', d.tithi);
    updateLabel('pan-nak', d.nakshatra);
    updateLabel('pan-yoga', d.yoga);
    updateLabel('pan-karana', d.karan || d.karana);
    updateLabel('pan-paksha', d.paksha);

    // Sun & Muhurat
    if(document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
    if(document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
    if(document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

    // Choghadiya Logic
    const fillChaug = (tableId, list) => {
        const tableBody = document.getElementById(tableId);
        if (!tableBody || !list) return;
        let html = '';
        Object.entries(list).forEach(([tKey, name]) => {
            const time = tKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const transName = MiddleMan.getTranslation(name);
            
            let statusText = "Good", statusColor = "#00ff88"; 
            if (["Rog", "Kaal", "Udveg", "रोग", "काल", "उद्वेग"].includes(name)) { statusText = "Bad"; statusColor = "#ff4d4d"; }
            else if (["Char", "चर"].includes(name)) { statusText = "Neutral"; statusColor = "#ffcc00"; }
            
            html += `<tr>
                <td style="color:var(--gold); font-weight:bold; padding:10px;">${time}</td>
                <td>${transName}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px; color:${statusColor}; font-size: 0.85rem; font-weight: bold;">
                        <span style="font-size: 1.2rem; line-height: 0;">●</span>
                        <span>${MiddleMan.getTranslation(statusText)}</span>
                    </div>
                </td>
            </tr>`;
        });
        tableBody.innerHTML = html;
    };
    fillChaug('day-chaug-body', d.choghadiya?.day);
    fillChaug('night-chaug-body', d.choghadiya?.night);
};

// ================= 7. CALENDAR GRID WITH INDICATORS =================
window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const months = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];

    // 1. Update Month Title
    if (document.getElementById('monthDisplay')) {
        const mName = window.translations?.[lang]?.[months[window.currentMonth]] || months[window.currentMonth];
        document.getElementById('monthDisplay').innerText = `${mName} ${window.currentYear}`;
    }

    container.innerHTML = '';
    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();

    // 2. Empty Slots
    for (let i = 0; i < firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';

    // 3. Days with Event Markers
    for (let d = 1; d <= daysInMonth; d++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day' + (window.selectedDay === d ? ' active' : '');
        
        // --- Indicator ko niche lane ke liye styling ---
        daySquare.style.display = "flex";
        daySquare.style.flexDirection = "column";
        daySquare.style.alignItems = "center";
        daySquare.style.justifyContent = "center";
        daySquare.style.cursor = "pointer";
        daySquare.style.minHeight = "50px"; // Adjust according to your UI

        // Number ko span mein rakha taaki dot niche aaye
        daySquare.innerHTML = `<span class="day-number">${d}</span>`;

        // Event Dot Logic
        const dateKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dateKey]) {
            const dot = document.createElement('div');
            // Dot styling: dot hamesha number ke niche center hoga
            dot.style.cssText = "width:6px; height:6px; background:var(--gold, #FFD700); border-radius:50%; margin-top: 4px;";
            daySquare.appendChild(dot);
        }

        daySquare.onclick = () => { 
            window.selectedDay = d; 
            window.renderCalendar(); 
            window.updatePanchangDisplay(); 
        };
        container.appendChild(daySquare);
    }
    if (window.updateMonthlyEvents) window.updateMonthlyEvents();
};

// ================= 8. FESTIVAL LIST WITH DATE =================
window.updateMonthlyEvents = function() {
    const list = document.getElementById('events-list');
    if (!list || !window.YEARLY_EVENTS_2026) return;
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}`;
    let html = '';

    Object.keys(window.YEARLY_EVENTS_2026).sort().forEach(date => {
        if (date.startsWith(mKey)) {
            const ev = window.YEARLY_EVENTS_2026[date];
            const displayDate = date.split('-').reverse().join('-'); 
            html += `
                <div class="event-item-card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,215,0,0.1);">
                    <span style="color: var(--gold); font-size: 0.85rem;">${displayDate}</span>
                    <h4 style="margin:0; font-size: 1rem;">${lang === 'hi' ? ev.hi : ev.en}</h4>
                </div>`;
        }
    });
    list.innerHTML = html || '<p style="color:gray; text-align:center;">No Festivals</p>';
};

// ================= 9. GLOBAL TRANSLATION & INIT =================
window.masterTranslatePanchang = function() {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const dict = window.translations?.[lang];
    if (!dict) return;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key]) el.innerText = dict[key];
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.masterTranslatePanchang();
    window.getPanchangFromFirebase(window.currentYear);
    
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; window.getPanchangFromFirebase(window.currentYear); }
        window.selectedDay = 1; window.renderCalendar(); window.updatePanchangDisplay();
    });
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; window.getPanchangFromFirebase(window.currentYear); }
        window.selectedDay = 1; window.renderCalendar(); window.updatePanchangDisplay();
    });
});
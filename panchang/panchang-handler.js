import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let panchangData = null;
let activeMode = 'day';

// 🔱 1. SUPREME TRANSLATOR (Modified for Object & Key Support)
const smartTranslate = (key) => {
    if (!key) return "--";
    const lang = localStorage.getItem('selectedLanguage') || 'hi';

    // Check if key is a Firebase Object {hi: '...', en: '...'}
    if (typeof key === 'object') {
        return key[lang] || key['hi'] || "--";
    }

    // Standard key logic for translations.js
    const cleanKey = String(key).toLowerCase().trim();
    return window.translations?.[lang]?.[cleanKey] || key;
};

// 🔱 2. STATUS COLOR LOGIC (Updated for Dual Format)
const getStatusMeta = (details) => {
    // Agar details ek object hai (naya format), toh uske 'en' status se color decide karo
    let statusType = "";
    
    if (typeof details === 'object' && details.status) {
        statusType = (details.status.en || "").toLowerCase();
    } else {
        // Purana format (string key)
        statusType = String(details).toLowerCase();
    }

    if (statusType.includes("bad") || statusType.includes("rog") || statusType.includes("kaal") || statusType.includes("udveg")) {
        return { color: "#ff4d4d" }; // Red
    }
    if (statusType.includes("neutral") || statusType.includes("char")) {
        return { color: "#ffcc00" }; // Gold/Yellow
    }
    return { color: "#00ff88" }; // Green (Good/Shubh/Labh/Amrit)
};

// 3. UI REFRESHER
const refreshAllUI = () => {
    renderCalendar();
    updatePanchangDetails();
};

// 4. PANCHANG DETAILS UPDATER
const updatePanchangDetails = () => {
    if (!panchangData) return;

    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');
    const data = panchangData[mStr]?.[dStr];

    if (!data) {
        const resetIds = ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karan', 'pan-paksha', 'pan-muh', 'pan-rahu', 'pan-sun'];
        resetIds.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = "--"; });
        if(document.getElementById('chaug-body')) document.getElementById('chaug-body').innerHTML = "";
        return;
    }

    // Top Cards Mapping
    const mapping = {
        'pan-tithi': data.tithi,
        'pan-nak': data.nakshatra,
        'pan-yoga': data.yoga,
        'pan-karan': data.karan,
        'pan-paksha': data.paksha,
        'pan-muh': data.muhurat?.abhijit,
        'pan-rahu': data.muhurat?.rahukaal
    };

    Object.entries(mapping).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = smartTranslate(val);
    });

    const sunEl = document.getElementById('pan-sun');
    if (sunEl) sunEl.innerText = data.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";

    // 🔱 Choghadiya Table (Center Aligned & Dual Format Support)
    const chaugList = data.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([timeKey, details]) => {
            // Support both old (string) and new (object) data
            const name = typeof details === 'object' ? details.name : details;
            const statusLabel = typeof details === 'object' ? details.status : "lbl_status"; // default if missing
            
            const meta = getStatusMeta(details);
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            
            return `<tr>
                <td class="gold-text" style="font-weight:600; text-align: center;">${displayTime}</td>
                <td style="text-align: center;">${smartTranslate(name)}</td>
                <td style="color:${meta.color}; font-weight:bold; text-align: center;">● ${smartTranslate(statusLabel)}</td>
            </tr>`;
        }).join('');
    }
    renderEvents(mStr);
};

// 5. CALENDAR RENDERER
const renderCalendar = () => {
    const container = document.getElementById('calendarDays');
    if (!container) return;

    const months = ["mon_jan","mon_feb","mon_mar","mon_apr","mon_may","mon_jun","mon_jul","mon_aug","mon_sep","mon_oct","mon_nov","mon_dec"];
    document.getElementById('monthDisplay').innerText = `${smartTranslate(months[currentMonth])} ${currentYear}`;
    
    container.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';
    
    for(let d=1; d<=daysInMonth; d++) {
        const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const isEv = window.YEARLY_EVENTS_2026?.[dateKey];
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>${isEv ? '<div class="event-dot"></div>' : ''}`;
        dayEl.onclick = () => { selectedDay = d; refreshAllUI(); };
        container.appendChild(dayEl);
    }
};

// 6. EVENTS LIST RENDERER
const renderEvents = (mStr) => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const datePrefix = `${currentYear}-${mStr}`;
    const evList = document.getElementById('events-list');
    if (evList) {
        evList.innerHTML = Object.entries(window.YEARLY_EVENTS_2026 || {})
            .filter(([date]) => date.startsWith(datePrefix))
            .map(([date, ev]) => `
                <div class="event-card">
                    <span class="event-date-number">${date.split('-')[2]}</span>
                    <span>${ev[lang] || ev.en}</span>
                </div>`)
            .join('') || `<p class="center" style="grid-column: 1/-1; opacity:0.5;">${smartTranslate('no_events')}</p>`;
    }
};

// 7. GLOBAL CONTROLS
window.changeMonth = (dir) => { 
    currentMonth += dir; 
    if(currentMonth < 0) { currentMonth = 11; currentYear--; } 
    if(currentMonth > 11) { currentMonth = 0; currentYear++; } 
    refreshAllUI(); 
};

window.switchChaug = (mode) => { 
    activeMode = mode; 
    document.getElementById('btn-day').classList.toggle('active', mode === 'day'); 
    document.getElementById('btn-night').classList.toggle('active', mode === 'night'); 
    updatePanchangDetails(); 
};

window.updateSiteLanguage = (newLang) => {
    localStorage.setItem('selectedLanguage', newLang);
    document.documentElement.lang = newLang;
    refreshAllUI(); 
};

// 8. INITIALIZE
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const snap = await get(ref(rtdb, `panchang/${currentYear}`));
        if(snap.exists()) { 
            panchangData = snap.val(); 
            refreshAllUI(); 
        }
    } catch (err) { console.error("Firebase Error:", err); }
});

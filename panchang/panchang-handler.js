import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let panchangData = null;
let activeMode = 'day';

// 1. SUPREME TRANSLATOR
const smartTranslate = (key) => {
    if (!key) return "--";
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    return window.translations?.[lang]?.[key] || key; 
};

// 2. STATUS COLOR LOGIC
const getStatusMeta = (key) => {
    const badKeys = ["chaug_rog", "chaug_kaal", "chaug_udveg"];
    const neutralKeys = ["chaug_char"];
    if (badKeys.includes(key)) return { label: "bad", color: "#ff4d4d" };
    if (neutralKeys.includes(key)) return { label: "neutral", color: "#ffcc00" };
    return { label: "good", color: "#00ff88" };
};

// 3. UI REFRESHER (Sab kuch ek saath update karega)
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

    // Choghadiya Table
    const chaugList = data.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([timeKey, nameKey]) => {
            const status = getStatusMeta(nameKey);
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            return `<tr>
                <td class="gold-text" style="font-weight:600;">${displayTime}</td>
                <td>${smartTranslate(nameKey)}</td>
                <td style="color:${status.color}; font-weight:bold;">● ${smartTranslate(status.label)}</td>
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

// 🔱 THE MAGIC WAND: Ye function language badalte hi call hoga
window.updateSiteLanguage = (newLang) => {
    localStorage.setItem('selectedLanguage', newLang);
    document.documentElement.lang = newLang;
    refreshAllUI(); // Firebase data instant update
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

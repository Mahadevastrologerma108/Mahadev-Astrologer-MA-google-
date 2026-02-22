import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- GLOBAL STATE ---
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let panchangData = null;
let activeMode = 'day';

// --- 🔱 SUPREME TRANSLATOR (Dictionary Se Connect Hone Wala) ---
const smartTranslate = (word) => {
    if (!word) return "--";
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const dict = window.translations?.[lang] || {};
    
    let clean = word.toString().trim();
    if (dict[clean]) return dict[clean];
    
    let lower = clean.toLowerCase();
    if (dict[lower]) return dict[lower];
    
    let cap = lower.charAt(0).toUpperCase() + lower.slice(1);
    return dict[cap] || clean;
};

// --- 🔱 LOGIC: 5 CONDITIONS COLOR SYSTEM ---
const getStatusMeta = (name) => {
    const n = name ? name.toLowerCase().trim() : "";
    // Choghadiya Logic
    const bad = ["rog", "kaal", "udveg", "रोग", "काल", "उद्वेग"];
    const neutral = ["char", "cher", "चर"];
    
    if (bad.some(b => n.includes(b))) return { label: "bad", color: "#ff4d4d" };
    if (neutral.some(neu => n.includes(neu))) return { label: "neutral", color: "#ffcc00" };
    return { label: "good", color: "#00ff88" }; // Shubh, Amrit, Labh
};

// --- 🔱 UI RENDERER (Follows Your Layout) ---
const updateUI = () => {
    if (!panchangData) return;
    
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');
    const data = panchangData[mStr]?.[dStr];

    // 1. TOP SECTION: 8 Panchang Cards
    const cardMap = {
        'pan-tithi': data?.tithi,
        'pan-nak': data?.nakshatra,
        'pan-yoga': data?.yoga,
        'pan-karan': data?.karan || data?.karana,
        'pan-paksha': data?.paksha,
        'pan-muh': data?.muhurat?.abhijit,
        'pan-rahu': data?.muhurat?.rahukaal
    };

    Object.entries(cardMap).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = smartTranslate(val);
    });
    
    const sunEl = document.getElementById('pan-sun');
    if (sunEl) sunEl.innerText = data?.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";

    // 2. TOP-MID SECTION: Choghadiya Table
    const chaugList = data?.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([time, name]) => {
            const status = getStatusMeta(name);
            const displayTime = time.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            return `<tr>
                <td class="gold-text" style="font-weight:600;">${displayTime}</td>
                <td>${smartTranslate(name)}</td>
                <td style="color:${status.color}; font-weight:bold;">● ${smartTranslate(status.label)}</td>
            </tr>`;
        }).join('');
    }

    // 3. BOTTOM SECTION: Events List (Monthly)
    const eventListContainer = document.getElementById('events-list');
    if (eventListContainer) {
        const lang = localStorage.getItem('selectedLanguage') || 'hi';
        const datePrefix = `${currentYear}-${mStr}`;
        const eventsHtml = Object.entries(window.YEARLY_EVENTS_2026 || {})
            .filter(([date]) => date.startsWith(datePrefix))
            .sort()
            .map(([date, ev]) => `
                <div class="event-card">
                    <span class="event-date-number">${date.split('-')[2]}</span>
                    <span class="event-name-text">${lang === 'hi' ? ev.hi : ev.en}</span>
                </div>
            `).join('');
        eventListContainer.innerHTML = eventsHtml || `<p class="center" style="opacity:0.5;">${lang === 'hi' ? 'कोई त्यौहार नहीं' : 'No Festivals'}</p>`;
    }
};

// --- 🔱 CALENDAR LOGIC (The Middle Section) ---
window.changeMonth = (dir) => {
    currentMonth += dir;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
    updateUI();
};

window.switchChaug = (mode) => {
    activeMode = mode;
    document.getElementById('btn-day').classList.toggle('active', mode === 'day');
    document.getElementById('btn-night').classList.toggle('active', mode === 'night');
    updateUI();
};

const renderCalendar = () => {
    const container = document.getElementById('calendarDays');
    const display = document.getElementById('monthDisplay');
    if (!container || !display) return;

    const months = ["mon_jan","mon_feb","mon_mar","mon_apr","mon_may","mon_jun","mon_jul","mon_aug","mon_sep","mon_oct","mon_nov","mon_dec"];
    display.innerText = `${smartTranslate(months[currentMonth])} ${currentYear}`;
    
    container.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Fill empty slots
    for (let i = 0; i < firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';

    // Fill days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = window.YEARLY_EVENTS_2026?.[dateKey];
        
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>${hasEvent ? '<div class="event-dot"></div>' : ''}`;
        
        dayEl.onclick = () => {
            selectedDay = d;
            renderCalendar();
            updateUI();
        };
        container.appendChild(dayEl);
    }
};

// --- 🔱 MASTER INITIALIZATION & WATCHER ---
const initPanchang = async () => {
    try {
        const snap = await get(ref(rtdb, `panchang/${currentYear}`));
        if (snap.exists()) {
            panchangData = snap.val();
            renderCalendar();
            updateUI();
        }
    } catch (err) {
        console.error("Firebase Fetch Error:", err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();

    // LANGUAGE WATCHER (CCTV): Jaise index.html mein hai
    let lastLang = localStorage.getItem('selectedLanguage');
    setInterval(() => {
        let currentLang = localStorage.getItem('selectedLanguage');
        if (currentLang !== lastLang) {
            lastLang = currentLang;
            renderCalendar();
            updateUI();
            // Optional: Re-trigger layout translation if needed
            if(window.masterTranslatePanchang) window.masterTranslatePanchang();
        }
    }, 600);
});

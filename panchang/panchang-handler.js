import { db, rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ================= 1. SUPREME STATE (The Driver) =================
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();
window.yearlyPanchangData = null;

// ================= 2. THE LOGIC ENGINE (5 Conditions - Safest Way) =================
const getChaugStatus = (name) => {
    // Ye hai "Index Formula": Language se matlab nahi, sirf word check karo
    const n = name ? name.toLowerCase().trim() : "";
    const bad = ["rog", "kaal", "udveg", "रोग", "काल", "उद्वेग"];
    const neutral = ["char", "cher", "चर"];

    if (bad.includes(n)) return { label: "Bad", color: "#ff4d4d" };
    if (neutral.includes(n)) return { label: "Neutral", color: "#ffcc00" };
    return { label: "Good", color: "#00ff88" }; // Shubh, Amrit, Labh
};

// ================= 3. UI RENDERERS (The 4 Main Pillars) =================

// PILLAR 1: Basic Panchang Cards
const updatePanchangCards = (d) => {
    const map = {
        'pan-tithi': d?.tithi, 'pan-nak': d?.nakshatra, 'pan-yoga': d?.yoga,
        'pan-karana': d?.karan || d?.karana, 'pan-paksha': d?.paksha,
        'pan-muh': d?.muhurat?.abhijit, 'pan-rahu': d?.muhurat?.rahukaal
    };
    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = window.translateWord ? window.translateWord(val || "--") : (val || "--");
    });
    if(document.getElementById('pan-sun')) 
        document.getElementById('pan-sun').innerText = d?.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
};

// PILLAR 2: Choghadiya Tables (Day/Night)
const updateChoghadiya = (d) => {
    const fill = (id, list) => {
        const body = document.getElementById(id);
        if (!body || !list) return;
        body.innerHTML = Object.entries(list).map(([t, name]) => {
            const time = t.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const status = getChaugStatus(name);
            return `<tr>
                <td style="color:var(--gold); font-weight:bold; padding:10px;">${time}</td>
                <td>${window.translateWord ? window.translateWord(name) : name}</td>
                <td style="color:${status.color}; font-weight:bold;">
                    <span style="font-size:1.2rem;">●</span> ${window.translateWord ? window.translateWord(status.label) : status.label}
                </td>
            </tr>`;
        }).join('');
    };
    fill('day-chaug-body', d?.choghadiya?.day);
    fill('night-chaug-body', d?.choghadiya?.night);
};

// PILLAR 3: The Interactive Calendar
window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    
    container.innerHTML = '';
    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();

    // Empty Slots
    for (let i = 0; i < firstDay; i++) container.innerHTML += '<div class="calendar-day empty" style="border:none; background:none;"></div>';

    // Days Rendering
    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${window.selectedDay === d ? 'active' : ''}`;
        dayDiv.innerHTML = `<span class="day-number">${d}</span>`;
        
        // Event Dot Indicator
        const dateKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (window.YEARLY_EVENTS_2026?.[dateKey]) {
            const dot = document.createElement('div');
            dot.style.cssText = "width:6px; height:6px; background:var(--gold); border-radius:50%; margin-top:4px;";
            dayDiv.appendChild(dot);
        }

        dayDiv.onclick = () => { window.selectedDay = d; window.renderCalendar(); window.updatePanchangDisplay(); };
        container.appendChild(dayDiv);
    }
    
    // Update Month Display
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const months = ["mon_jan","mon_feb","mon_mar","mon_apr","mon_may","mon_jun","mon_jul","mon_aug","mon_sep","mon_oct","mon_nov","mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if(mDisplay) mDisplay.innerText = (window.translations?.[lang]?.[months[window.currentMonth]] || months[window.currentMonth]) + " " + window.currentYear;
};

// PILLAR 4: Monthly Events List
window.updateMonthlyEvents = function() {
    const list = document.getElementById('events-list');
    if (!list || !window.YEARLY_EVENTS_2026) return;
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}`;
    
    const eventsHtml = Object.keys(window.YEARLY_EVENTS_2026)
        .filter(date => date.startsWith(mKey))
        .sort()
        .map(date => {
            const ev = window.YEARLY_EVENTS_2026[date];
            const dPart = date.split('-')[2];
            return `<div class="event-item-card">
                <div class="event-date-badge">${dPart}</div>
                <div class="event-details">
                    <h4>${lang === 'hi' ? ev.hi : ev.en}</h4>
                </div>
            </div>`;
        }).join('');
    list.innerHTML = eventsHtml || '<p style="text-align:center; color:gray; width:100%;">No Festivals</p>';
};

// ================= 4. GLOBAL SYNC (The Master Refresh) =================
window.updatePanchangDisplay = function() {
    if (!window.yearlyPanchangData) return;
    const m = String(window.currentMonth + 1).padStart(2, '0');
    const d = "d" + String(window.selectedDay).padStart(2, '0');
    const data = window.yearlyPanchangData[m]?.[d];

    updatePanchangCards(data);
    updateChoghadiya(data);
    window.updateMonthlyEvents();
};

// ================= 5. SUPREME COMMAND (The Init) =================
document.addEventListener('DOMContentLoaded', () => {
    // Fetch Firebase Data
    get(ref(rtdb, `panchang/${window.currentYear}`)).then(snapshot => {
        if (snapshot.exists()) {
            window.yearlyPanchangData = snapshot.val();
            window.renderCalendar();
            window.updatePanchangDisplay();
        }
    });

    // Language Watcher (Like Index.html)
    let lastLang = localStorage.getItem('selectedLanguage') || 'hi';
    setInterval(() => {
        let currentLang = localStorage.getItem('selectedLanguage') || 'hi';
        if (currentLang !== lastLang) {
            lastLang = currentLang;
            window.renderCalendar();
            window.updatePanchangDisplay();
            // Trigger layout translation
            if(window.masterTranslatePanchang) window.masterTranslatePanchang();
        }
    }, 500);
});

// Helper for dynamic words
window.translateWord = (word) => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const dict = window.translations?.[lang];
    if (!dict) return word;
    return dict[word] || dict[word.toLowerCase()] || word;
};

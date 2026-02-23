import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let activeMode = 'day';

// 🔱 1. SUPREME TRANSLATOR (For UI Labels only)
const updateUILabels = () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            el.innerText = window.translations[lang][key];
        }
    });
};

// 🔱 2. FETCH DATA FROM FIREBASE (Direct Folder Access)
const fetchPanchang = async () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');

    // Path: panchang/2026/hi/02/d20
const dataPath = `panchang/${currentYear}/${mStr}/${lang}/${dStr}`;
    
    try {
        const snap = await get(ref(rtdb, dataPath));
        if (snap.exists()) {
            renderUI(snap.val(), lang);
        } else {
            console.log("No data for:", dataPath);
            resetDisplay();
        }
    } catch (err) {
        console.error("Firebase Error:", err);
    }
    
    updateUILabels();
    renderCalendar();
    renderEvents(mStr, lang);
};

// 🔱 3. RENDER UI
const renderUI = (data, lang) => {
    // Basic Details
    document.getElementById('pan-tithi').innerText = data.tithi || "--";
    document.getElementById('pan-nak').innerText = data.nakshatra || "--";
    document.getElementById('pan-yoga').innerText = data.yoga || "--";
    document.getElementById('pan-karan').innerText = data.karan || "--";
    document.getElementById('pan-paksha').innerText = data.paksha || "--";
    
    // Sun & Muhurat
    document.getElementById('pan-sun').innerText = data.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";
    document.getElementById('pan-muh').innerText = data.muhurat?.abhijit || "--";
    document.getElementById('pan-rahu').innerText = data.muhurat?.rahukaal || "--";

    // Choghadiya Table
    const chaugList = data.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([timeKey, name]) => {
            const meta = getStatusMeta(name);
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const statusLabel = lang === 'hi' ? 'स्थिति' : 'Status';
            
            return `<tr>
                <td class="gold-text" style="text-align: center;">${displayTime}</td>
                <td style="text-align: center;">${name}</td>
                <td style="color:${meta.color}; font-weight:bold; text-align: center;">● ${statusLabel}</td>
            </tr>`;
        }).join('');
    }
};

// Color Logic
const getStatusMeta = (name) => {
    const n = String(name).toLowerCase();
    if (n.includes("bad") || n.includes("rog") || n.includes("kaal") || n.includes("udveg") || n.includes("रोग") || n.includes("काल")) {
        return { color: "#ff4d4d" }; // Red
    }
    if (n.includes("char") || n.includes("neutral") || n.includes("चर")) {
        return { color: "#ffcc00" }; // Gold
    }
    return { color: "#00ff88" }; // Green
};

// 🔱 4. CALENDAR RENDERER
const renderCalendar = () => {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const months = {
        hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    
    document.getElementById('monthDisplay').innerText = `${months[lang][currentMonth]} ${currentYear}`;
    
    container.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';
    
    for(let d=1; d<=daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>`;
        dayEl.onclick = () => { selectedDay = d; fetchPanchang(); };
        container.appendChild(dayEl);
    }
};

// 🔱 5. EVENTS LIST
const renderEvents = (mStr, lang) => {
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
            .join('') || `<p class="center" style="grid-column: 1/-1; opacity:0.5;">No Events</p>`;
    }
};

// Global Controls
window.changeMonth = (dir) => { 
    currentMonth += dir; 
    if(currentMonth < 0) { currentMonth = 11; currentYear--; } 
    if(currentMonth > 11) { currentMonth = 0; currentYear++; } 
    fetchPanchang(); 
};

window.switchChaug = (mode) => { 
    activeMode = mode; 
    document.getElementById('btn-day').classList.toggle('active', mode === 'day'); 
    document.getElementById('btn-night').classList.toggle('active', mode === 'night'); 
    fetchPanchang(); 
};

// Initial Load
document.addEventListener('DOMContentLoaded', fetchPanchang);

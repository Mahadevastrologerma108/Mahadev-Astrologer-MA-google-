import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let activeMode = 'day';

// 🔱 1. THE BRAIN: Get Current Language
const getLang = () => localStorage.getItem('selectedLanguage') || 'hi';

// 🔱 2. REFRESH UI (Sahi Path se Data mangwana)
const refreshAllUI = async () => {
    const lang = getLang();
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');

    // Path ab dynamic hai: panchang/2026/hi/02/d20
    const dataPath = `panchang/${currentYear}/${lang}/${mStr}/${dStr}`;
    
    try {
        const snap = await get(ref(rtdb, dataPath));
        if (snap.exists()) {
            renderPanchangUI(snap.val(), lang);
        } else {
            console.log("Data not found at:", dataPath);
            resetUI();
        }
    } catch (err) {
        console.error("Firebase Error:", err);
    }
    
    renderCalendar(); // Calendar render labels ke liye
    renderEvents(mStr, lang); // Events render
};

// 🔱 3. RENDER UI (Seedha Data Print Karo)
const renderPanchangUI = (data, lang) => {
    // Top Cards: Ab humein smartTranslate ki zaroorat nahi, data pehle se translated hai!
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
        if (el) el.innerText = val || "--";
    });

    const sunEl = document.getElementById('pan-sun');
    if (sunEl) sunEl.innerText = data.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";

    // Choghadiya Table
    const chaugList = data.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([timeKey, name]) => {
            const meta = getStatusMeta(name); // Color logic abhi bhi wahi rahegi
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

// 🔱 4. STATUS COLOR LOGIC (Simple & Clean)
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

// 🔱 5. CALENDAR & NAVIGATION (Static Translations)
const renderCalendar = () => {
    const lang = getLang();
    const months = {
        hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    
    document.getElementById('monthDisplay').innerText = `${months[lang][currentMonth]} ${currentYear}`;
    
    const container = document.getElementById('calendarDays');
    if (!container) return;
    container.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';
    
    for(let d=1; d<=daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>`;
        dayEl.onclick = () => { selectedDay = d; refreshAllUI(); };
        container.appendChild(dayEl);
    }
};

// Language Change Function
window.updateSiteLanguage = (newLang) => {
    localStorage.setItem('selectedLanguage', newLang);
    document.documentElement.lang = newLang;
    refreshAllUI(); // Ye call naye path se data layega
};

// Initialize
document.addEventListener('DOMContentLoaded', refreshAllUI);

import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let activeMode = 'day';

// 🔱 1. Labels Translator (Sirf Tithi, Nakshatra jaise words ke liye)
const updateUILabels = () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (window.translations?.[lang]?.[key]) {
            el.innerText = window.translations[lang][key];
        }
    });
};

// 🔱 2. Fetch Data (Direct Path Logic)
const fetchPanchang = async () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mStr = String(currentMonth + 1).padStart(2, '0'); // Ye "02" banayega
    const dStr = "d" + String(selectedDay).padStart(2, '0'); // Ye "d23" banayega

    // 🚩 Path Match: panchang/2026/02/hi/d23
    const dataPath = `panchang/${currentYear}/${mStr}/${lang}/${dStr}`;
    
    try {
        const snap = await get(ref(rtdb, dataPath));
        if (snap.exists()) {
            renderUI(snap.val(), lang);
        } else {
            console.error("Data Not Found at:", dataPath);
        }
    } catch (err) {
        console.error("Firebase Error:", err);
    }
};

// 🔱 3. Render UI (No smartTranslate here!)
const renderUI = (data, lang) => {
    // Mapping IDs to Firebase Values (Direct Print - No Translation needed)
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
        if (el) el.innerText = val || "--"; // 👈 Direct Value (English folder se English aayega)
    });

    const sunEl = document.getElementById('pan-sun');
    if (sunEl) sunEl.innerText = data.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";

    // Choghadiya Table Logic
    const chaugList = data.choghadiya?.[activeMode] || {};
    const tbody = document.getElementById('chaug-body');
    if (tbody) {
        tbody.innerHTML = Object.entries(chaugList).map(([timeKey, name]) => {
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const statusLabel = lang === 'hi' ? 'स्थिति' : 'Status';
            return `<tr>
                <td class="gold-text" style="text-align: center;">${displayTime}</td>
                <td style="text-align: center;">${name}</td>
                <td style="text-align: center;">● ${statusLabel}</td>
            </tr>`;
        }).join('');
    }
};

// 🔱 4. Sabse Important: Initialize Logic
document.addEventListener('DOMContentLoaded', async () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    document.documentElement.lang = lang;

    updateUILabels(); // Pehle Labels badlo
    await fetchPanchang(); // Phir Firebase se data lao
    renderCalendar(); // Calendar dikhao
});

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

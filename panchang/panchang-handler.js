import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Dedicated Panchang Handler Active");

window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; 
            await window.updatePanchangDisplay(data);
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
        }
    } catch (e) { console.error("🔱 Handler Error:", e); }
};

window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[dateKey];
    if (!d) return;

    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';

    // 1. TOP CARDS DATA
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

    // 2. CHAUGHADIA TRANSLATION (Fixed Logic)
    if (d.choghadiya) {
        const fill = (id, cData) => {
            const body = document.getElementById(id);
            if (body && cData) {
                body.innerHTML = Object.entries(cData)
                    .map(([time, name]) => {
                        // Firebase se "Amrit" aayega, hum use translations.js ki key banayenge
                        const lowName = name.toLowerCase();
                        const nameKey = `chaug_${lowName}`;
                        const transName = (window.translations[currentLang] && window.translations[currentLang][nameKey]) ? window.translations[currentLang][nameKey] : name;
                        
                        // Nature logic: Shubh/Amrit/Labh = Good, etc.
                        let natureKey = "chaug_neutral";
                        if (['shubh', 'amrit', 'labh'].includes(lowName)) natureKey = "chaug_best";
                        if (['char'].includes(lowName)) natureKey = "chaug_good";
                        if (['rog', 'kaal', 'udveg'].includes(lowName)) natureKey = "chaug_bad";
                        
                        const transNature = (window.translations[currentLang] && window.translations[currentLang][natureKey]) ? window.translations[currentLang][natureKey] : "Nature";

                        return `<tr>
                            <td>${time}</td>
                            <td class="chaug-name">${transName}</td>
                            <td class="nature-${natureKey.split('_')[1]}">${transNature}</td>
                        </tr>`;
                    }).join('');
            }
        };
        fill('day-chaug-body', d.choghadiya.day);
        fill('night-chaug-body', d.choghadiya.night);
    }
    
    window.updateMonthlyEvents();
    
    // Static labels ko translate karne ka aakhri dhakka
    if (typeof window.applyTranslations === 'function') window.applyTranslations();
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
            const eventTitle = (currentLang === 'en' && event.en) ? event.en : event.hi;
            
            html += `
                <div class="event-item-row">
                    <div class="ev-date">${dayNum}</div>
                    <div class="ev-info"><h4>${eventTitle}</h4></div>
                </div>`;
        }
    });
    container.innerHTML = html || `<p style="text-align:center; color:#888;" data-key="no_events">No festivals this month.</p>`;
};

// 🔱 Listeners
window.addEventListener('languageChanged', () => {
    if (window["Data2026"]) window.updatePanchangDisplay(window["Data2026"]);
});

// Jab calendar ka mahina badle, tab events refresh honge
window.addEventListener('monthChanged', () => {
    window.updateMonthlyEvents();
});

document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));

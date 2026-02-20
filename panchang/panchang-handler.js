import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. VEDIC DICTIONARY
const VEDIC_DICT = {
    hi: {
        'Amrit': 'अमृत', 'Shubh': 'शुभ', 'Labh': 'लाभ', 'Char': 'चर', 'Rog': 'रोग', 'Kaal': 'काल', 'Udveg': 'उद्वेग',
        'Shukla Paksha': 'शुक्ल पक्ष', 'Krishna Paksha': 'कृष्ण पक्ष',
        'Pratipada': 'प्रतिपदा', 'Dwitiya': 'द्वितीया', 'Tritiya': 'तृतीया', 'Chaturthi': 'चतुर्थी', 'Panchami': 'पंचमी', 
        'Shashthi': 'षष्ठी', 'Saptami': 'सप्तमी', 'Ashtami': 'अष्टमी', 'Navami': 'नवमी', 'Dashami': 'दशमी', 
        'Ekadashi': 'एकादशी', 'Dwadashi': 'द्वादशी', 'Trayodashi': 'त्रयोदशी', 'Chaturdashi': 'चतुर्दशी', 
        'Purnima': 'पूर्णिमा', 'Amavasya': 'अमावस्या',
        'Ashwini': 'अश्विनी', 'Bharani': 'भरणी', 'Krittika': 'कृत्तिका', 'Rohini': 'रोहिणी', 'Mrigashira': 'मृगशिरा', 
        'Ardra': 'आद्रा', 'Punarvasu': 'पुनर्वसु', 'Pushya': 'पुष्य', 'Ashlesha': 'आश्लेषा', 'Magha': 'मघा', 
        'Purva Phalguni': 'पूर्वा फाल्गुनी', 'Uttara Phalguni': 'उत्तरा फाल्गुनी', 'Hasta': 'हस्त', 'Chitra': 'चित्रा', 
        'Swati': 'स्वाति', 'Vishakha': 'विशाखा', 'Anuradha': 'अनुराधा', 'Jyeshtha': 'ज्येष्ठा', 'Mula': 'मूल', 
        'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तरषाढ़ा', 'Shravana': 'श्रवण', 'Dhanishta': 'धनिष्ठा', 
        'Shatabhisha': 'शतभिषा', 'Purva Bhadrapada': 'पूर्वा भाद्रपद', 'Uttara Bhadrapada': 'उत्तरा भाद्रपद', 'Revati': 'रेवती'
    }
};

// 2. MIDDLE-MAN ENGINE
const MiddleMan = {
    getTranslation(key, lang) {
        if (!key) return "--";
        if (window.translations?.[lang]?.[key]) return window.translations[lang][key];
        if (lang === 'hi' && VEDIC_DICT.hi[key]) return VEDIC_DICT.hi[key];
        return key;
    },

    processChoghadiya(list, lang) {
        if (!list) return `<div class="no-data">Data coming soon...</div>`;
        return Object.entries(list).map(([timeKey, name]) => {
            // "t0656" ko "06:56" dikhane ke liye fix
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            return `
                <div class="chog-item">
                    <span class="chog-time">${displayTime}</span>
                    <span class="chog-name">${this.getTranslation(name, lang)}</span>
                </div>
            `;
        }).join('');
    }
};

// 3. MASTER RENDER FUNCTION
window.masterTranslatePanchang = async function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    
    // Check if data exists for the current year
    const year = 2026;
    if (!window["Data" + year]) {
        await window.getPanchangFromFirebase(year);
        return;
    }

    const today = new Date();
    // Month calculate karein (01, 02...)
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth + 1 : today.getMonth() + 1)).padStart(2, '0');
    // Date calculate karein (d01, d02...)
    const currentD = `d${String(window.selectedDay || today.getDate()).padStart(2, '0')}`;

    // Path: window["Data2026"]["02"]["d20"]
    const d = window["Data" + year][currentM]?.[currentD];

    if (d) {
        const elements = {
            'pan-tithi': MiddleMan.getTranslation(d.tithi, currentLang),
            'pan-nak': MiddleMan.getTranslation(d.nakshatra, currentLang),
            'pan-yoga': MiddleMan.getTranslation(d.yoga, currentLang),
            'pan-karana': MiddleMan.getTranslation(d.karan, currentLang),
            'pan-paksha': MiddleMan.getTranslation(d.paksha, currentLang),
            'pan-sun': d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--",
            'pan-moon': MiddleMan.getTranslation(d.moon?.rise || d.moon, currentLang),
            'pan-muh': d.muhurat?.abhijit || "--",
            'pan-rahu': d.muhurat?.rahukaal || "--"
        };

        Object.entries(elements).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        });

        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        window.updateMonthlyEvents();
        if (typeof window.applyTranslations === 'function') window.applyTranslations();
    } else {
        console.warn("Data not found for:", currentM, currentD);
    }
};

// 4. DATA FETCH
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
            window.masterTranslatePanchang();
        }
    } catch (err) { console.error("🔱 Connection Error:", err); }
};

// ... Baki functions (updateMonthDisplay, updateMonthlyEvents) same rahenge ...
function updateMonthDisplay(lang) {
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if(mDisplay) {
        const mIdx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = window.translations?.[lang]?.[monthKeys[mIdx]] || "---";
    }
}

window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    if (!container || !window.YEARLY_EVENTS_2026) return;
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + 1).padStart(2, '0');
    let html = "";
    Object.keys(window.YEARLY_EVENTS_2026).sort().forEach(dateKey => {
        if (dateKey.startsWith(`2026-${currentM}`)) {
            const dayNum = dateKey.split('-')[2];
            const event = window.YEARLY_EVENTS_2026[dateKey];
            const title = (lang === 'en' && event.en) ? event.en : event.hi;
            html += `<div class="event-item-row"><div class="ev-date">${dayNum}</div><div class="ev-info"><h4>${title}</h4></div></div>`;
        }
    });
    container.innerHTML = html || `<p style="padding:20px; color:#888;">No festivals.</p>`;
};

window.addEventListener('languageChanged', () => window.masterTranslatePanchang());
window.addEventListener('monthChanged', () => window.masterTranslatePanchang());
document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));

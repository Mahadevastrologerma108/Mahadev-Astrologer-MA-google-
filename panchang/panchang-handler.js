import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. VEDIC DICTIONARY (Hindi Translation Force)
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
        'Purva Phalguni': 'पूर्वा फाल्गुनी', 'Uttara Phalguni': 'उत्तर फाल्गुनी', 'Hasta': 'हस्त', 'Chitra': 'चित्रा', 
        'Swati': 'स्वाति', 'Vishakha': 'विशाखा', 'Anuradha': 'अनुराधा', 'Jyeshtha': 'ज्येष्ठा', 'Mula': 'मूल', 
        'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तरषाढ़ा', 'Shravana': 'श्रवण', 'Dhanishta': 'धनिष्ठा', 
        'Shatabhisha': 'शतभिषा', 'Purva Bhadrapada': 'पूर्वा भाद्रपद', 'Uttara Bhadrapada': 'उत्तर भाद्रपद', 'Revati': 'रेवती'
    }
};

// 2. MIDDLE-MAN ENGINE (Logic for Language & Tables)
const MiddleMan = {
    getTranslation(key, lang) {
        if (!key) return "--";
        // Force Hindi if selected
        if (lang === 'hi' && VEDIC_DICT.hi[key]) return VEDIC_DICT.hi[key];
        // Labels from translation.js
        if (window.translations?.[lang]?.[key]) return window.translations[lang][key];
        return key;
    },

    processChoghadiya(list, lang) {
        if (!list) return `<tr><td colspan="2" style="text-align:center; padding:20px;">Data coming soon...</td></tr>`;
        
        return Object.entries(list).map(([timeKey, name]) => {
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang);
            
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; color: #ffc107; font-weight: bold;">
                        <i class="bi bi-clock me-2"></i>${displayTime}
                    </td>
                    <td style="padding: 12px; color: #ffffff; text-align: right; font-weight: 500;">
                        ${translatedName}
                    </td>
                </tr>
            `;
        }).join('');
    }
};

// 3. MASTER RENDER FUNCTION
window.masterTranslatePanchang = async function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    const year = 2026;
    
    if (!window["Data" + year]) {
        await window.getPanchangFromFirebase(year);
        return;
    }

    const today = new Date();
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth + 1 : today.getMonth() + 1)).padStart(2, '0');
    const currentD = `d${String(window.selectedDay || today.getDate()).padStart(2, '0')}`;

    const d = window["Data" + year][currentM]?.[currentD];

    if (d) {
        // UI Pe Data Chipkao
        document.getElementById('pan-tithi').innerText = MiddleMan.getTranslation(d.tithi, currentLang);
        document.getElementById('pan-nak').innerText = MiddleMan.getTranslation(d.nakshatra, currentLang);
        document.getElementById('pan-yoga').innerText = MiddleMan.getTranslation(d.yoga, currentLang);
        document.getElementById('pan-karana').innerText = MiddleMan.getTranslation(d.karan, currentLang);
        document.getElementById('pan-paksha').innerText = MiddleMan.getTranslation(d.paksha, currentLang);
        
        const sunRiseSet = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
        document.getElementById('pan-sun').innerText = sunRiseSet;
        document.getElementById('pan-moon').innerText = MiddleMan.getTranslation(d.moon?.rise || d.moon, currentLang);
        
        document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        // Choghadiya Table Body
        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        window.updateMonthlyEvents();
        
        if (typeof window.applyTranslations === 'function') window.applyTranslations();
    }
};

// 4. DATA FETCH & SYNC
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

function updateMonthDisplay(lang) {
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if(mDisplay) {
        const mIdx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        const translatedMonth = window.translations?.[lang]?.[monthKeys[mIdx]] || monthKeys[mIdx];
        mDisplay.innerText = translatedMonth;
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

// Listeners
window.addEventListener('languageChanged', () => window.masterTranslatePanchang());
window.addEventListener('monthChanged', () => window.masterTranslatePanchang());
document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));
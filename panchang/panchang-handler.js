import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const MiddleMan = {
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        
        // 🔱 SABSE BADA FIX: Agar English mode hai, toh dictionary touch hi mat karo
        // Seedha Firebase wala English data return kar do
        if (lang === 'en') {
            if (type === "paksha") return val.includes("Paksha") ? val : val + " Paksha";
            return val;
        }

        // 🔱 Agar Hindi mode hai, tabhi dictionary mein jhaanko
        const dict = window.translations && window.translations['hi'];
        if (!dict) return val;

        let cleanVal = val.toLowerCase().trim().replace(/\s+paksha/g, '').replace(/\s+/g, '_');

        // Type matching for Hindi
        if (type === "paksha" && dict["paksha_" + cleanVal]) return dict["paksha_" + cleanVal];
        if (type === "karana" && dict["karana_" + cleanVal]) return dict["karana_" + cleanVal];
        if (type === "tithi") {
            if (dict["tithi_shukla_" + cleanVal]) return dict["tithi_shukla_" + cleanVal];
            if (dict["tithi_krishna_" + cleanVal]) return dict["tithi_krishna_" + cleanVal];
        }
        if (type === "yoga" && dict["yoga_" + cleanVal]) return dict["yoga_" + cleanVal];
        if (type === "nak" && (dict["nak_" + cleanVal] || dict["nakshatra_" + cleanVal])) 
            return dict["nak_" + cleanVal] || dict["nakshatra_" + cleanVal];
        
        if (dict["chaug_" + cleanVal]) return dict["chaug_" + cleanVal];
        if (dict[val]) return dict[val];

        return val;
    },

    processChoghadiya: function(list, lang) {
        if (!list) return `<tr><td colspan="3" style="text-align:center;">No Data</td></tr>`;
        const natureMap = {
            'Amrit': 'chaug_best', 'Labh': 'chaug_best', 'Shubh': 'chaug_good',
            'Char': 'chaug_neutral', 'Rog': 'chaug_bad', 'Kaal': 'chaug_bad', 'Udveg': 'chaug_bad'
        };

        let rows = "";
        Object.entries(list).forEach(([timeKey, name]) => {
            const time = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang, "chaug");
            const nKey = natureMap[name] || 'chaug_neutral';
            
            // Nature Fix
            let nature = "--";
            if (lang === 'en') {
                const enNature = { 'chaug_best': 'Best', 'chaug_good': 'Good', 'chaug_neutral': 'Neutral', 'chaug_bad': 'Avoid' };
                nature = enNature[nKey] || 'Neutral';
            } else {
                nature = window.translations?.['hi']?.[nKey] || 'सामान्य';
            }
            
            rows += `<tr>
                <td style="padding:12px; color:#ffc107; font-weight:bold;">${time}</td>
                <td style="padding:12px; color:#fff; text-align:center;">${translatedName}</td>
                <td style="padding:12px; color:#888; text-align:right;">${nature}</td>
            </tr>`;
        });
        return rows;
    }
};

window.masterTranslatePanchang = async function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    const year = 2026;
    if (!window["Data" + year]) { await window.getPanchangFromFirebase(year); return; }

    const today = new Date();
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth + 1 : today.getMonth() + 1)).padStart(2, '0');
    const currentD = `d${String(window.selectedDay || today.getDate()).padStart(2, '0')}`;
    const d = window["Data" + year][currentM]?.[currentD];

    if (d) {
        const fields = [
            { id: 'pan-tithi', val: d.tithi, type: 'tithi' },
            { id: 'pan-nak', val: d.nakshatra, type: 'nak' },
            { id: 'pan-yoga', val: d.yoga, type: 'yoga' },
            { id: 'pan-karana', val: d.karan, type: 'karana' },
            { id: 'pan-paksha', val: d.paksha, type: 'paksha' }
        ];

        fields.forEach(f => {
            const el = document.getElementById(f.id);
            if (el) el.innerText = MiddleMan.getTranslation(f.val, currentLang, f.type);
        });

        // Fixed Data (Always uses original for English, calls dictionary for Hindi)
        if (document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = d.moon?.rise || d.moon || "--";
        if (document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? d.sun.rise + " / " + d.sun.set : "--";
        if (document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        if (document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        if (window.applyTranslations) window.applyTranslations();
    }
};

window.renderCalendar = function() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    const now = new Date();
    const month = window.currentMonth !== undefined ? window.currentMonth : now.getMonth();
    const firstDay = new Date(2026, month, 1).getDay();
    const daysInMonth = new Date(2026, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) calendarGrid.innerHTML += `<div class="calendar-day empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = (window.selectedDay === day) ? 'selected' : '';
        const isToday = (now.getMonth() === month && day === now.getDate()) ? 'today' : '';
        calendarGrid.appendChild(Object.assign(document.createElement('div'), {
            className: `calendar-day ${isSelected} ${isToday}`,
            innerText: day,
            onclick: () => { window.selectedDay = day; window.renderCalendar(); window.masterTranslatePanchang(); }
        }));
    }
};

window.changeMonth = function(offset) {
    let m = (window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + offset;
    window.currentMonth = m < 0 ? 11 : (m > 11 ? 0 : m);
    window.selectedDay = 1; window.renderCalendar(); window.masterTranslatePanchang();
};

window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`));
        if (snapshot.exists()) { window["Data" + year] = snapshot.val(); window.masterTranslatePanchang(); }
    } catch (e) { console.error(e); }
};

function updateMonthDisplay(lang) {
    const months = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const idx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = MiddleMan.getTranslation(months[idx], lang);
    }
}

window.addEventListener('languageChanged', () => { window.masterTranslatePanchang(); window.renderCalendar(); });
document.addEventListener('DOMContentLoaded', () => { window.renderCalendar(); window.getPanchangFromFirebase(2026); });

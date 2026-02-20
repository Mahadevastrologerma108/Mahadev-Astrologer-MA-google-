import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const MiddleMan = {
    getTranslation(val, lang, type = "") {
        if (!val) return "--";
        const dict = window.translations?.[lang];
        if (!dict) return val;

        // Step 1: Clean the value (e.g., "Shukla Paksha" -> "shukla")
        let cleanVal = val.toLowerCase().trim().replace(/\s+paksha/g, '').replace(/\s+/g, '_');

        // Step 2: Try Direct Match first (Best for English/Standard keys)
        if (dict[val]) return dict[val];

        // Step 3: Try Prefix Matching based on Type
        let tryKeys = [];
        if (type === "paksha") tryKeys.push("paksha_" + cleanVal);
        if (type === "karana") tryKeys.push("karana_" + cleanVal);
        if (type === "tithi") tryKeys.push("tithi_shukla_" + cleanVal, "tithi_krishna_" + cleanVal);
        if (type === "yoga") tryKeys.push("yoga_" + cleanVal);
        if (type === "nak") tryKeys.push("nakshatra_" + cleanVal, "nak_" + cleanVal);
        
        // Always try choghadiya prefix for names
        tryKeys.push("chaug_" + cleanVal);

        // Step 4: Search in Dictionary
        for (let key of tryKeys) {
            if (dict[key]) return dict[key];
        }

        // Step 5: Fallback - Agar kuch nahi mila aur English hai, toh capitalize karke dikhao
        if (lang === 'en') {
            return val.charAt(0).toUpperCase() + val.slice(1);
        }

        return val;
    },

    processChoghadiya(list, lang) {
        if (!list) return `<tr><td colspan="3" style="text-align:center; padding:20px;">Data coming soon...</td></tr>`;
        
        const natureMap = {
            'Amrit': 'chaug_best', 'Labh': 'chaug_best', 'Shubh': 'chaug_good',
            'Char': 'chaug_neutral', 'Rog': 'chaug_bad', 'Kaal': 'chaug_bad', 'Udveg': 'chaug_bad'
        };

        return Object.entries(list).map(([timeKey, name]) => {
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang, "chaug");
            
            // Nature mapping from dictionary
            const nKey = natureMap[name] || 'chaug_neutral';
            const translatedNature = window.translations?.[lang]?.[nKey] || "--";
            
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; color: #ffc107; font-weight: bold; width: 30%; font-family: 'Poppins', sans-serif;">
                        <i class="bi bi-clock-history me-2"></i>${displayTime}
                    </td>
                    <td style="padding: 12px; color: #ffffff; width: 40%; text-align: center; font-weight: 500;">
                        ${translatedName}
                    </td>
                    <td style="padding: 12px; color: #888; width: 30%; text-align: right; font-size: 0.85rem;">
                        ${translatedNature}
                    </td>
                </tr>
            `;
        }).join('');
    }
};

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

        if (document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = d.moon?.rise || d.moon || "--";
        if (document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
        if (document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        if (document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        if (typeof window.applyTranslations === 'function') window.applyTranslations();
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
    const todayDate = now.getDate();
    const isCurrentMonth = (now.getMonth() === month && now.getFullYear() === 2026);

    for (let i = 0; i < firstDay; i++) calendarGrid.innerHTML += `<div class="calendar-day empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = (window.selectedDay === day) ? 'selected' : '';
        const isToday = (isCurrentMonth && day === todayDate) ? 'today' : '';
        calendarGrid.innerHTML += `<div class="calendar-day ${isSelected} ${isToday}" onclick="selectDay(${day})">${day}</div>`;
    }
};

window.selectDay = function(day) {
    window.selectedDay = day;
    window.renderCalendar();
    window.masterTranslatePanchang();
};

window.changeMonth = function(offset) {
    let newM = (window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + offset;
    if (newM < 0) newM = 11; if (newM > 11) newM = 0;
    window.currentMonth = newM; window.selectedDay = 1;
    window.renderCalendar(); window.masterTranslatePanchang();
};

window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            window.masterTranslatePanchang();
        }
    } catch (err) { console.error("🔱 Error:", err); }
};

function updateMonthDisplay(lang) {
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if(mDisplay) {
        const mIdx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = MiddleMan.getTranslation(monthKeys[mIdx], lang);
    }
}

window.addEventListener('languageChanged', () => { window.masterTranslatePanchang(); window.renderCalendar(); });
document.addEventListener('DOMContentLoaded', () => { window.renderCalendar(); window.getPanchangFromFirebase(2026); });

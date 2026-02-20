import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔱 MIDDLE-MAN: Extensive Translation Logic
const MiddleMan = {
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        
        // Dictionary check
        const dict = window.translations && window.translations[lang];
        if (!dict) return val;

        // Clean value for key generation (e.g., "Shukla Paksha" -> "shukla")
        let cleanVal = val.toLowerCase().trim().replace(/\s+paksha/g, '').replace(/\s+/g, '_');

        // 1. Direct Match Check
        if (dict[val]) {
            return dict[val];
        }

        // 2. Type-Based Key Generation (Long Form)
        let keyToTry = "";
        if (type === "paksha") {
            keyToTry = "paksha_" + cleanVal;
            if (dict[keyToTry]) return dict[keyToTry];
        }
        
        if (type === "karana") {
            keyToTry = "karana_" + cleanVal;
            if (dict[keyToTry]) return dict[keyToTry];
        }

        if (type === "tithi") {
            if (dict["tithi_shukla_" + cleanVal]) return dict["tithi_shukla_" + cleanVal];
            if (dict["tithi_krishna_" + cleanVal]) return dict["tithi_krishna_" + cleanVal];
        }

        if (type === "yoga") {
            keyToTry = "yoga_" + cleanVal;
            if (dict[keyToTry]) return dict[keyToTry];
        }

        if (type === "nak") {
            if (dict["nak_" + cleanVal]) return dict["nak_" + cleanVal];
            if (dict["nakshatra_" + cleanVal]) return dict["nakshatra_" + cleanVal];
        }

        if (type === "chaug") {
            keyToTry = "chaug_" + cleanVal;
            if (dict[keyToTry]) return dict[keyToTry];
        }

        // 3. Common Prefixes Fallback
        const prefixes = ["mon_", "tithi_", "chaug_", "yoga_", "nak_"];
        for (let i = 0; i < prefixes.length; i++) {
            let pKey = prefixes[i] + cleanVal;
            if (dict[pKey]) return dict[pKey];
        }

        // 4. Final Language Check: If English, return original Firebase value
        if (lang === 'en') {
            return val; 
        }

        return val;
    },

    processChoghadiya: function(list, lang) {
        if (!list) {
            return `<tr><td colspan="3" style="text-align:center; padding:20px;">No Data Found</td></tr>`;
        }
        
        const natureMap = {
            'Amrit': 'chaug_best',
            'Labh': 'chaug_best',
            'Shubh': 'chaug_good',
            'Char': 'chaug_neutral',
            'Rog': 'chaug_bad',
            'Kaal': 'chaug_bad',
            'Udveg': 'chaug_bad'
        };

        let htmlRows = "";
        const entries = Object.entries(list);

        for (let i = 0; i < entries.length; i++) {
            const timeKey = entries[i][0];
            const name = entries[i][1];
            
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang, "chaug");
            
            const nKey = natureMap[name] || 'chaug_neutral';
            const translatedNature = window.translations?.[lang]?.[nKey] || "--";
            
            htmlRows += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; color: #ffc107; font-weight: bold; width: 30%;">
                        <i class="bi bi-clock-history me-2"></i>${displayTime}
                    </td>
                    <td style="padding: 12px; color: #ffffff; width: 40%; text-align: center;">
                        ${translatedName}
                    </td>
                    <td style="padding: 12px; color: #888; width: 30%; text-align: right; font-size: 0.85rem;">
                        ${translatedNature}
                    </td>
                </tr>`;
        }
        return htmlRows;
    }
};

// 🔱 MASTER RENDER
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
    const monthData = window["Data" + year][currentM];
    
    if (!monthData) return;
    const d = monthData[currentD];

    if (d) {
        // Detailed Mapping
        const tithiEl = document.getElementById('pan-tithi');
        if (tithiEl) tithiEl.innerText = MiddleMan.getTranslation(d.tithi, currentLang, 'tithi');

        const nakEl = document.getElementById('pan-nak');
        if (nakEl) nakEl.innerText = MiddleMan.getTranslation(d.nakshatra, currentLang, 'nak');

        const yogaEl = document.getElementById('pan-yoga');
        if (yogaEl) yogaEl.innerText = MiddleMan.getTranslation(d.yoga, currentLang, 'yoga');

        const karanEl = document.getElementById('pan-karana');
        if (karanEl) karanEl.innerText = MiddleMan.getTranslation(d.karan, currentLang, 'karana');

        const pakshaEl = document.getElementById('pan-paksha');
        if (pakshaEl) pakshaEl.innerText = MiddleMan.getTranslation(d.paksha, currentLang, 'paksha');

        const moonEl = document.getElementById('pan-moon');
        if (moonEl) moonEl.innerText = d.moon?.rise || d.moon || "--";

        const sunEl = document.getElementById('pan-sun');
        if (sunEl) sunEl.innerText = d.sun ? d.sun.rise + " / " + d.sun.set : "--";

        const muhEl = document.getElementById('pan-muh');
        if (muhEl) muhEl.innerText = d.muhurat?.abhijit || "--";

        const rahuEl = document.getElementById('pan-rahu');
        if (rahuEl) rahuEl.innerText = d.muhurat?.rahukaal || "--";

        // Choghadiya Render
        const dBox = document.getElementById('day-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);

        const nBox = document.getElementById('night-chaug-body');
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations();
        }
    }
};

// 🔱 CALENDAR LOGIC
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

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const isSelected = (window.selectedDay === day) ? 'selected' : '';
        const isToday = (isCurrentMonth && day === todayDate) ? 'today' : '';
        dayDiv.className = 'calendar-day ' + isSelected + ' ' + isToday;
        dayDiv.innerText = day;
        dayDiv.onclick = function() { window.selectDay(day); };
        calendarGrid.appendChild(dayDiv);
    }
};

window.selectDay = function(day) {
    window.selectedDay = day;
    window.renderCalendar();
    window.masterTranslatePanchang();
};

window.changeMonth = function(offset) {
    let newM = (window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + offset;
    if (newM < 0) newM = 11;
    if (newM > 11) newM = 0;
    window.currentMonth = newM;
    window.selectedDay = 1;
    window.renderCalendar();
    window.masterTranslatePanchang();
};

window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, "panchang/" + year);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            window.masterTranslatePanchang();
        }
    } catch (err) {
        console.error("🔱 Connection Error:", err);
    }
};

function updateMonthDisplay(lang) {
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const mIdx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = MiddleMan.getTranslation(monthKeys[mIdx], lang);
    }
}

window.addEventListener('languageChanged', function() {
    window.masterTranslatePanchang();
    window.renderCalendar();
});

document.addEventListener('DOMContentLoaded', function() {
    window.renderCalendar();
    window.getPanchangFromFirebase(2026);
});

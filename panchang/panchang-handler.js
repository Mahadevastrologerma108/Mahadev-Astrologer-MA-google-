import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. Initial State
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();

const MiddleMan = {
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        if (lang === 'en') return val;

        const dict = window.translations?.['hi'];
        if (!dict) return val;

        // Clean value: "Shukla Pratipada" -> "shukla_pratipada"
        let cleanVal = val.toLowerCase().trim().replace(/\s+/g, '_');

        // Direct mapping check (Sabse pehle direct check karo)
        if (dict[type + "_" + cleanVal]) return dict[type + "_" + cleanVal];
        if (dict[cleanVal]) return dict[cleanVal];
        
        // Agar Tithi hai aur "shukla_pratipada" format mein hai
        if (type === "tithi") {
            if (dict["tithi_" + cleanVal]) return dict["tithi_" + cleanVal];
        }

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
            
            let nature = (lang === 'en') ? 
                { 'chaug_best': 'Best', 'chaug_good': 'Good', 'chaug_neutral': 'Neutral', 'chaug_bad': 'Avoid' }[nKey] : 
                window.translations?.['hi']?.[nKey] || 'सामान्य';
            
            rows += `<tr>
                <td style="padding:12px; color:#ffc107; font-weight:bold;">${time}</td>
                <td style="text-align:center;">${translatedName}</td>
                <td style="text-align:right; font-size:0.8em; opacity:0.8;">${nature}</td>
            </tr>`;
        });
        return rows;
    }
};

window.masterTranslatePanchang = function() {
    const currentLang = localStorage.getItem('selectedLang') || 'hi'; // Sync with your switcher
    const year = window.currentYear;
    
    const monthKey = String(window.currentMonth + 1).padStart(2, '0');
    const dayKey = `d${String(window.selectedDay).padStart(2, '0')}`;
    
    const yearData = window["Data" + year];
    if (!yearData) return;

    const d = yearData[monthKey]?.[dayKey];

    if (d) {
        // UI Update logic
        const updateText = (id, val, type) => {
            const el = document.getElementById(id);
            if (el) el.innerText = MiddleMan.getTranslation(val, currentLang, type);
        };

        updateText('pan-tithi', d.tithi, 'tithi');
        updateText('pan-nak', d.nakshatra, 'nak');
        updateText('pan-yoga', d.yoga, 'yoga');
        updateText('pan-karana', d.karan, 'karana');
        updateText('pan-paksha', d.paksha, 'paksha');

        if (document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = d.moon?.rise || d.moon || "--";
        if (document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? d.sun.rise + " / " + d.sun.set : "--";
        if (document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        if (document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
    }
};

window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    container.innerHTML = '';

    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) container.innerHTML += `<div class="calendar-day empty"></div>`;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        if (window.selectedDay === day) daySquare.classList.add('active');
        
        daySquare.innerText = day;
        daySquare.onclick = () => { 
            window.selectedDay = day; 
            window.renderCalendar(); 
            window.masterTranslatePanchang(); 
        };
        container.appendChild(daySquare);
    }
};

window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`));
        if (snapshot.exists()) { 
            window["Data" + year] = snapshot.val(); 
            window.masterTranslatePanchang(); 
            window.renderCalendar();
        }
    } catch (e) { console.error("Firebase Error:", e); }
};

function updateMonthDisplay(lang) {
    const months = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const key = months[window.currentMonth];
        mDisplay.innerText = (window.translations[lang] && window.translations[lang][key]) ? window.translations[lang][key] : key;
    }
}

// 🚩 Sabse Zaruri: Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
    
    // Month Buttons Fix
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; }
        window.renderCalendar();
        window.masterTranslatePanchang();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; }
        window.renderCalendar();
        window.masterTranslatePanchang();
    });
});

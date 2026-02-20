import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const MiddleMan = {
    // 🔱 Ye function faisla karega ki kya dikhana hai
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        
        // Dictionary check
        const dict = window.translations && window.translations[lang];
        if (!dict) return val;

        // 1. Agar Language English hai aur Firebase se data English mein hi aa raha hai
        // Toh hum seedha wahi dikhayenge, dictionary ki magaj-mari nahi karenge.
        if (lang === 'en') {
            // Bas Paksha ko thoda saaf kar dete hain
            if (type === "paksha") return val.replace(/paksha/gi, '').trim() + " Paksha";
            return val; 
        }

        // 2. Agar Language Hindi hai, toh dictionary se 'Key' banakar dhoondo
        let cleanVal = val.toLowerCase().trim().replace(/\s+paksha/g, '').replace(/\s+/g, '_');

        if (type === "paksha") {
            if (dict["paksha_" + cleanVal]) return dict["paksha_" + cleanVal];
        }
        
        if (type === "karana") {
            if (dict["karana_" + cleanVal]) return dict["karana_" + cleanVal];
        }

        if (type === "tithi") {
            if (dict["tithi_shukla_" + cleanVal]) return dict["tithi_shukla_" + cleanVal];
            if (dict["tithi_krishna_" + cleanVal]) return dict["tithi_krishna_" + cleanVal];
        }

        if (type === "yoga") {
            if (dict["yoga_" + cleanVal]) return dict["yoga_" + cleanVal];
        }

        if (type === "nak") {
            if (dict["nak_" + cleanVal]) return dict["nak_" + cleanVal];
            if (dict["nakshatra_" + cleanVal]) return dict["nakshatra_" + cleanVal];
        }

        if (type === "chaug") {
            if (dict["chaug_" + cleanVal]) return dict["chaug_" + cleanVal];
        }

        // Agar kuch na mile toh direct match try karo (Jaise Months ke liye)
        if (dict[val]) return dict[val];

        // Sabse aakhri rasta: Common Prefixes
        const prefixes = ["mon_", "tithi_", "chaug_", "yoga_", "nak_"];
        for (let i = 0; i < prefixes.length; i++) {
            let pKey = prefixes[i] + cleanVal;
            if (dict[pKey]) return dict[pKey];
        }

        return val;
    },

    processChoghadiya: function(list, lang) {
        if (!list) return `<tr><td colspan="3" style="text-align:center; padding:20px;">No Data</td></tr>`;
        
        const natureMap = {
            'Amrit': 'chaug_best', 'Labh': 'chaug_best', 'Shubh': 'chaug_good',
            'Char': 'chaug_neutral', 'Rog': 'chaug_bad', 'Kaal': 'chaug_bad', 'Udveg': 'chaug_bad'
        };

        let rows = "";
        const entries = Object.entries(list);

        for (let i = 0; i < entries.length; i++) {
            const time = entries[i][0].replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const name = entries[i][1];
            
            const translatedName = this.getTranslation(name, lang, "chaug");
            const nKey = natureMap[name] || 'chaug_neutral';
            const nature = window.translations?.[lang]?.[nKey] || (lang === 'en' ? 'Neutral' : '--');
            
            rows += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; color: #ffc107; font-weight: bold; width: 30%; font-family: 'Poppins', sans-serif;">
                        <i class="bi bi-clock-history me-2"></i>${time}
                    </td>
                    <td style="padding: 12px; color: #ffffff; width: 40%; text-align: center; font-weight: 500;">
                        ${translatedName}
                    </td>
                    <td style="padding: 12px; color: #888; width: 30%; text-align: right; font-size: 0.85rem;">
                        ${nature}
                    </td>
                </tr>`;
        }
        return rows;
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
        // Ek ek karke field update karo
        const fields = [
            { id: 'pan-tithi', val: d.tithi, type: 'tithi' },
            { id: 'pan-nak', val: d.nakshatra, type: 'nak' },
            { id: 'pan-yoga', val: d.yoga, type: 'yoga' },
            { id: 'pan-karana', val: d.karan, type: 'karana' },
            { id: 'pan-paksha', val: d.paksha, type: 'paksha' }
        ];

        for (let f of fields) {
            const el = document.getElementById(f.id);
            if (el) el.innerText = MiddleMan.getTranslation(f.val, currentLang, f.type);
        }

        // Fixed Data
        if (document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = d.moon?.rise || d.moon || "--";
        if (document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? d.sun.rise + " / " + d.sun.set : "--";
        if (document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        if (document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        // Choghadiya
        const dBox = document.getElementById('day-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        const nBox = document.getElementById('night-chaug-body');
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
        
        // 🔱 Ye line zaroori hai Titles ko translate karne ke liye
        if (window.applyTranslations) window.applyTranslations();
    }
};

// 🔱 CALENDAR RENDER
window.renderCalendar = function() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    const now = new Date();
    const month = window.currentMonth !== undefined ? window.currentMonth : now.getMonth();
    const firstDay = new Date(2026, month, 1).getDay();
    const daysInMonth = new Date(2026, month + 1, 0).getDate();
    const todayDate = now.getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dDiv = document.createElement('div');
        const isSelected = (window.selectedDay === day) ? 'selected' : '';
        const isToday = (now.getMonth() === month && day === todayDate) ? 'today' : '';
        dDiv.className = 'calendar-day ' + isSelected + ' ' + isToday;
        dDiv.innerText = day;
        dDiv.onclick = function() { window.selectedDay = day; window.renderCalendar(); window.masterTranslatePanchang(); };
        calendarGrid.appendChild(dDiv);
    }
};

window.changeMonth = function(offset) {
    let m = (window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + offset;
    if (m < 0) m = 11; if (m > 11) m = 0;
    window.currentMonth = m; window.selectedDay = 1;
    window.renderCalendar(); window.masterTranslatePanchang();
};

window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, "panchang/" + year);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            window.masterTranslatePanchang();
        }
    } catch (err) { console.error("Firebase Error:", err); }
};

function updateMonthDisplay(lang) {
    const months = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const idx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = MiddleMan.getTranslation(months[idx], lang);
    }
}

window.addEventListener('languageChanged', function() { window.masterTranslatePanchang(); window.renderCalendar(); });
document.addEventListener('DOMContentLoaded', function() { window.renderCalendar(); window.getPanchangFromFirebase(2026); });

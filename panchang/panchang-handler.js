import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔱 MIDDLE-MAN: Direct connection to translation.js
const MiddleMan = {
    getTranslation(key, lang) {
        if (!key) return "--";
        // Yeh line seedha translation.js ki dictionary mein jhaankti hai
        return window.translations?.[lang]?.[key] || key;
    },

    processChoghadiya(list, lang) {
        if (!list) return `<tr><td colspan="3" style="text-align:center; padding:20px;">Data coming soon...</td></tr>`;
        
        return Object.entries(list).map(([timeKey, name]) => {
            const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang);
            
            // Nature bhi translation.js se aayega (Make sure 'Amrit_Nature' etc. are in your file)
            const nature = this.getTranslation(name + "_Nature", lang); 
            
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; color: #ffc107; font-weight: bold; width: 30%; font-family: 'Poppins', sans-serif;">
                        <i class="bi bi-clock-history me-2"></i>${displayTime}
                    </td>
                    <td style="padding: 12px; color: #ffffff; width: 40%; text-align: center; font-weight: 500;">
                        ${translatedName}
                    </td>
                    <td style="padding: 12px; color: #888; width: 30%; text-align: right; font-size: 0.85rem;">
                        ${nature}
                    </td>
                </tr>
            `;
        }).join('');
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

    const d = window["Data" + year][currentM]?.[currentD];

    if (d) {
        // Dynamic Fields from Firebase translated by translation.js
        const mapping = {
            'pan-tithi': d.tithi,
            'pan-nak': d.nakshatra,
            'pan-yoga': d.yoga,
            'pan-karana': d.karan,
            'pan-paksha': d.paksha,
            'pan-moon': d.moon?.rise || d.moon
        };

        Object.entries(mapping).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = MiddleMan.getTranslation(val, currentLang);
        });

        // Fixed Data
        if (document.getElementById('pan-sun')) {
            document.getElementById('pan-sun').innerText = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
        }
        if (document.getElementById('pan-muh')) {
            document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        }
        if (document.getElementById('pan-rahu')) {
            document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";
        }

        // Choghadiya Table
        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        // Header Months
        updateMonthDisplay(currentLang);
        
        // Static UI elements (Titles, Buttons)
        if (typeof window.applyTranslations === 'function') window.applyTranslations();
    }
};

// 🔱 DATA SYNC
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            window["Data" + year] = snapshot.val();
            window.masterTranslatePanchang();
        }
    } catch (err) { console.error("🔱 Connection Error:", err); }
};

function updateMonthDisplay(lang) {
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mDisplay = document.getElementById('monthDisplay');
    if(mDisplay) {
        const mIdx = window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth();
        mDisplay.innerText = MiddleMan.getTranslation(monthKeys[mIdx], lang);
    }
}

// 🔱 LISTENERS
window.addEventListener('languageChanged', () => window.masterTranslatePanchang());
document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));
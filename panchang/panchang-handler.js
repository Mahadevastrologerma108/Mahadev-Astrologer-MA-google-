// 1. Firebase Imports (Ensure your panchang-config.js is setup correctly)
import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. Global State (Current Settings)
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();

// 3. MiddleMan: Translation Engine
const MiddleMan = {
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        if (lang === 'en') return val;

        const dict = window.translations?.;
        if (!dict) return val;

        let cleanVal = val.toLowerCase().trim().replace(/\s+/g, '_');
        if (dict) return dict;
        if (dict) return dict;
        
        return val;
    },

    processChoghadiya: function(list, lang) {
        if (!list) return `<tr><td colspan="3" style="text-align:center;">No Data</td></tr>`;
        const natureMap = {
            'Amrit': 'chaug_best', 'Labh': 'chaug_best', 'Shubh': 'chaug_good',
            'Char': 'chaug_neutral', 'Rog': 'chaug_bad', 'Kaal': 'chaug_bad', 'Udveg': 'chaug_bad'
        };

        let rows = "";
        Object.entries(list).forEach(() => {
            const time = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const translatedName = this.getTranslation(name, lang, "chaug");
            const nKey = natureMap || 'chaug_neutral';
            
            let nature = (lang === 'en') ? 
                { 'chaug_best': 'Best', 'chaug_good': 'Good', 'chaug_neutral': 'Neutral', 'chaug_bad': 'Avoid' } : 
                window.translations?.?. || 'सामान्य';
            
            rows += `<tr>
                <td style="padding:12px; color:#ffc107; font-weight:bold;">${time}</td>
                <td style="text-align:center;">${translatedName}</td>
                <td style="text-align:right; font-size:0.8em; opacity:0.8;">${nature}</td>
            </tr>`;
        });
        return rows;
    }
};

// 4. Update UI: Fill Panchang Cards
window.masterTranslatePanchang = function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    const year = window.currentYear;
    const monthKey = String(window.currentMonth + 1).padStart(2, '0');
    const dayKey = `d${String(window.selectedDay).padStart(2, '0')}`;
    
    const yearData = window;
    if (!yearData || !yearData) return;

    const d = yearData;

    if (d) {
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

// 5. Calendar Rendering (Includes Special Glow & Event Dots)
window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    container.innerHTML = '';

    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();

    // Empty Slots
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        empty.style.border = 'none'; empty.style.background = 'transparent';
        container.appendChild(empty);
    }
    
    // Day Loop
    for (let day = 1; day <= daysInMonth; day++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        daySquare.innerText = day;
        
        // Active & Today
        if (window.selectedDay === day) daySquare.classList.add('active');
        const today = new Date();
        if (day === today.getDate() && window.currentMonth === today.getMonth() && window.currentYear === today.getFullYear()) {
            daySquare.classList.add('today');
        }

        // Special Tithi Logic (Ekadashi, Purnima, Amavasya Glow)
        const monthKey = String(window.currentMonth + 1).padStart(2, '0');
        const dayKeyStr = `d${String(day).padStart(2, '0')}`;
        const yearData = window;
        const dayData = yearData ? yearData?. : null;

        if (dayData && dayData.tithi) {
            const t = typeof dayData.tithi === 'object' ? (dayData.tithi.hi || dayData.tithi.en || "") : dayData.tithi;
            const tLower = t.toLowerCase();
            if (tLower.includes('ekadashi') || tLower.includes('purnima') || tLower.includes('amavasya') || 
                tLower.includes('एकादशी') || tLower.includes('पूर्णिमा') || tLower.includes('अमावस्या')) {
                daySquare.classList.add('special-tithi');
            }
        }

        // Event Dot logic
        const eventDateKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026) {
            daySquare.classList.add('has-event');
        }
        
        // On Click
        daySquare.onclick = () => { 
            window.selectedDay = day; 
            window.renderCalendar(); 
            window.masterTranslatePanchang(); 
        };
        container.appendChild(daySquare);
    }
    window.updateMonthlyEvents();
    
    // Update Ribbon with today's event if exists
    const ribbonText = document.getElementById('ribbon-text');
    if(ribbonText) {
        const ribbonDateKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}-${String(window.selectedDay).padStart(2, '0')}`;
        const ev = window.YEARLY_EVENTS_2026?.;
        const lang = localStorage.getItem('selectedLanguage') || 'hi';
        if(ev) ribbonText.innerText = (lang === 'hi' ? ev.hi : ev.en) + " 🚩";
        else ribbonText.innerText = "Jai Mahadev 🔱";
    }
};

// 6. Monthly Events List
window.updateMonthlyEvents = function() {
    const listContainer = document.getElementById('events-list');
    if (!listContainer) return;

    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const month = String(window.currentMonth + 1).padStart(2, '0');
    const year = window.currentYear;

    listContainer.innerHTML = ''; 

    const monthlyEvents = Object.keys(window.YEARLY_EVENTS_2026 || {})
        .filter(date => date.startsWith(`${year}-${month}`))
        .sort(); 

    if (monthlyEvents.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:gray; padding:20px;">No major festivals this month.</p>`;
        return;
    }

    monthlyEvents.forEach(dateKey => {
        const event = window.YEARLY_EVENTS_2026;
        const day = parseInt(dateKey.split('-'));
        const title = lang === 'hi' ? event.hi : event.en;
        const desc = lang === 'hi' ? event.desc_hi : event.desc_en;

        const eventCard = document.createElement('div');
        eventCard.className = 'event-item-card'; 
        eventCard.innerHTML = `
            <div class="event-date-badge">${day}</div>
            <div class="event-details">
                <h4>${title}</h4>
                <p>${desc}</p>
            </div>
        `;
        eventCard.onclick = () => {
            window.selectedDay = day;
            window.renderCalendar();
            window.masterTranslatePanchang();
        };
        listContainer.appendChild(eventCard);
    });
};

// 7. Month Display Update
function updateMonthDisplay(lang) {
    const months =;
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const key = months;
        mDisplay.innerText = `${window.translations?.?. || key} ${window.currentYear}`;
    }
}

// 8. Firebase Data Fetching
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`));
        if (snapshot.exists()) { 
            window = snapshot.val(); 
            window.masterTranslatePanchang(); 
            window.renderCalendar();
        } else {
            console.warn("No data found for year: " + year);
            window.renderCalendar();
        }
    } catch (e) { 
        console.error("Firebase Error:", e); 
        window.renderCalendar();
    }
};

// 9. Init (Start)
document.addEventListener('DOMContentLoaded', () => {
    // Current Month Name Translation Check
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    updateMonthDisplay(lang);
    
    // Fetch Data
    window.getPanchangFromFirebase(2026);
    
    // Month Arrows
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
        window.selectedDay = 1; // Reset to 1st of month
        window.renderCalendar();
        window.masterTranslatePanchang();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
        window.selectedDay = 1;
        window.renderCalendar();
        window.masterTranslatePanchang();
    });
});

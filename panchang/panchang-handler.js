// 1. Firebase Imports
import { rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. Global State (Current Settings)
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();

// 3. MiddleMan: Translation Engine (Data ko Hindi/English mein badalne ke liye)
const MiddleMan = {
    getTranslation: function(val, lang, type = "") {
        if (!val) return "--";
        if (lang === 'en') return val; // English mein seedha dikhao

        const dict = window.translations?.['hi'];
        if (!dict) return val;

        // "Shukla Pratipada" -> "shukla_pratipada"
        let cleanVal = val.toLowerCase().trim().replace(/\s+/g, '_');

        // Check specific keys first (tithi_shukla_pratipada, etc.)
        if (dict[type + "_" + cleanVal]) return dict[type + "_" + cleanVal];
        if (dict[cleanVal]) return dict[cleanVal];
        
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

// 4. Update UI: Cards mein data bharne ke liye
window.masterTranslatePanchang = function() {
    const currentLang = localStorage.getItem('selectedLanguage') || 'hi';
    const year = window.currentYear;
    const monthKey = String(window.currentMonth + 1).padStart(2, '0');
    const dayKey = `d${String(window.selectedDay).padStart(2, '0')}`;
    
    const yearData = window["Data" + year];
    if (!yearData || !yearData[monthKey]) return;

    const d = yearData[monthKey][dayKey];

    if (d) {
        const updateText = (id, val, type) => {
            const el = document.getElementById(id);
            if (el) el.innerText = MiddleMan.getTranslation(val, currentLang, type);
        };

        // Main Panchang Cards
        updateText('pan-tithi', d.tithi, 'tithi');
        updateText('pan-nak', d.nakshatra, 'nak');
        updateText('pan-yoga', d.yoga, 'yoga');
        updateText('pan-karana', d.karan, 'karana');
        updateText('pan-paksha', d.paksha, 'paksha');

        // Other Details
        if (document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = d.moon?.rise || d.moon || "--";
        if (document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? d.sun.rise + " / " + d.sun.set : "--";
        if (document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
        if (document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

        // Choghadiya
        const dBox = document.getElementById('day-chaug-body');
        const nBox = document.getElementById('night-chaug-body');
        if (dBox) dBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.day, currentLang);
        if (nBox) nBox.innerHTML = MiddleMan.processChoghadiya(d.choghadiya?.night, currentLang);

        updateMonthDisplay(currentLang);
    }
};

// 5. Monthly Events List: Tyohar dikhane ke liye
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
        const event = window.YEARLY_EVENTS_2026[dateKey];
        const day = dateKey.split('-')[2];
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
            window.selectedDay = parseInt(day);
            window.renderCalendar();
            window.masterTranslatePanchang();
        };
        listContainer.appendChild(eventCard);
    });
};

// 6. Calendar Rendering
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
        
        // Highlight logic
        if (window.selectedDay === day) daySquare.classList.add('active');
        const today = new Date();
        if (day === today.getDate() && window.currentMonth === today.getMonth()) daySquare.classList.add('today');

        // Event Dot logic
        const dateKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dateKey]) {
            daySquare.classList.add('has-event');
        }
        
        daySquare.innerText = day;
        daySquare.onclick = () => { 
            window.selectedDay = day; 
            window.renderCalendar(); 
            window.masterTranslatePanchang(); 
        };
        container.appendChild(daySquare);
    }
    window.updateMonthlyEvents(); // Calendar ke saath list update karein
};

// 7. Firebase Data Fetching
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
        mDisplay.innerText = window.translations[lang]?.[key] || key;
    }
}

// 8. Initialization (Start Everything)
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
    
    // Month Switching Buttons
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
        window.renderCalendar();
        window.masterTranslatePanchang();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
        window.renderCalendar();
        window.masterTranslatePanchang();
    });
});

window.addEventListener('languageChanged', () => { 
    window.masterTranslatePanchang(); 
    window.renderCalendar(); 
});

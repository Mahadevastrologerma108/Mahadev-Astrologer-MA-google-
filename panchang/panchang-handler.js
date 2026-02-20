import { db, rtdb } from './firebase-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. GLOBAL STATE
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();
window.yearlyPanchangData = null;

// 2. TRANSLATION MIDDLEMAN (Missing in earlier version)
const MiddleMan = {
    getTranslation: function(val, type) {
        if (!val) return "--";
        const lang = localStorage.getItem('selectedLanguage') || 'hi';
        if (lang === 'en') return (typeof val === 'object' ? val.en : val);

        const dict = window.translations?.['hi'];
        if (!dict) return val;

        // Clean key generation: "Shukla Pratipada" -> "tithi_shukla_pratipada"
        let cleanVal = val.toString().toLowerCase().trim().replace(/\s+/g, '_');
        let key = type + "_" + cleanVal;

        return dict[key] || dict[cleanVal] || (typeof val === 'object' ? val.hi : val);
    }
};

// 3. FIREBASE FETCH
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`));
        if (snapshot.exists()) {
            window.yearlyPanchangData = snapshot.val();
            window.renderCalendar();
            window.updatePanchangDisplay();
        }
    } catch (e) { console.error("🔱 Fetch Error:", e); }
};

// 4. UI DISPLAY (Updated logic for Month/Day keys)
window.updatePanchangDisplay = function() {
    const data = window.yearlyPanchangData;
    if (!data) return;

    // 1. Tumhare JSON ke hisaab se Keys taiyaar karna
    const mKey = String(window.currentMonth + 1).padStart(2, '0'); // "01", "02" etc.
    const dKey = "d" + String(window.selectedDay).padStart(2, '0'); // "d20", "d21" etc.
    
    // 2. Data nikalna (Flexible Check)
    const d = (data[mKey] && data[mKey][dKey]) ? data[mKey][dKey] : null;

    if (!d) {
        console.warn(`Data missing for: ${mKey} -> ${dKey}`);
        const resetIds = ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karana', 'pan-paksha'];
        resetIds.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = "--"; });
        return;
    }

    // 3. Translation & Display Logic
    const update = (id, val, type) => {
        const el = document.getElementById(id);
        if (el) {
            // Agar MiddleMan hai toh translation use karega
            el.innerText = (typeof MiddleMan !== 'undefined') ? MiddleMan.getTranslation(val, type) : val;
        }
    };

    // Mapping - Tumhare JSON keys ke saath sync kiya gaya hai
    update('pan-tithi', d.tithi, 'tithi');
    update('pan-nak', d.nakshatra, 'nak');
    update('pan-yoga', d.yoga, 'yoga');
    update('pan-karana', d.karan || d.karana, 'karana'); // Dono cases handle kiye
    update('pan-paksha', d.paksha, 'paksha');

    // Sun & Moon (Numbers/Strings)
    if(document.getElementById('pan-sun')) 
        document.getElementById('pan-sun').innerText = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
    
    if(document.getElementById('pan-muh')) 
        document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
    
    if(document.getElementById('pan-rahu')) 
        document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

    // 4. Choghadiya (Tumhare "t0656" keys ke liye fixed)
    const fillChaug = (id, list) => {
        const body = document.getElementById(id);
        if (!body) return;
        if (!list) { body.innerHTML = '<tr><td colspan="3">No Data</td></tr>'; return; }

        let html = '';
        Object.entries(list).forEach(([tKey, name]) => {
            // "t0656" -> "06:56"
            const time = tKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const transName = (typeof MiddleMan !== 'undefined') ? MiddleMan.getTranslation(name, 'chaug') : name;
            html += `<tr>
                <td style="color:var(--gold); font-weight:bold; padding:10px;">${time}</td>
                <td>${transName}</td>
                <td style="color:#00ff88; font-size:0.8em;">Good</td>
            </tr>`;
        });
        body.innerHTML = html;
    };

    fillChaug('day-chaug-body', d.choghadiya?.day);
    fillChaug('night-chaug-body', d.choghadiya?.night);
};

// 5. CALENDAR & EVENTS (MERGED & OPTIMIZED)
window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    if (!container) return;

    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const months = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    
    const mDisplay = document.getElementById('monthDisplay');
    if (mDisplay) {
        const mName = window.translations?.[lang]?.[months[window.currentMonth]] || months[window.currentMonth];
        mDisplay.innerText = `${mName} ${window.currentYear}`;
    }

    container.innerHTML = '';
    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        
        if (window.selectedDay === d) daySquare.classList.add('active');

        // 🕉️ Today's Marker (Tera CSS class)
        if (d === today.getDate() && window.currentMonth === today.getMonth() && window.currentYear === today.getFullYear()) {
            daySquare.classList.add('today');
        }

        // ✨ Special Glow Logic (Purnima/Amavasya/Ekadashi)
        const mKey = String(window.currentMonth + 1).padStart(2, '0');
        const dKey = "d" + String(d).padStart(2, '0');
        const dayData = (window.yearlyPanchangData && window.yearlyPanchangData[mKey]) ? window.yearlyPanchangData[mKey][dKey] : null;
        
        if (dayData && dayData.tithi) {
            const t = dayData.tithi.toLowerCase();
            if (t.includes('purnima') || t.includes('amavasya') || t.includes('ekadashi')) {
                daySquare.classList.add('special-tithi');
            }
        }

        // 🚩 Event Dot
        const dateKey = `${window.currentYear}-${mKey}-${String(d).padStart(2, '0')}`;
        if (window.YEARLY_EVENTS_2026?.[dateKey]) {
            daySquare.classList.add('has-event');
        }

        daySquare.innerText = d;
        daySquare.onclick = () => { 
            window.selectedDay = d; 
            window.renderCalendar(); 
            window.updatePanchangDisplay(); 
        };
        container.appendChild(daySquare);
    }
    window.updateMonthlyEvents();
};

window.updateMonthlyEvents = function() {
    const list = document.getElementById('events-list');
    if (!list || !window.YEARLY_EVENTS_2026) return;

    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mKey = `${window.currentYear}-${String(window.currentMonth + 1).padStart(2, '0')}`;
    
    let html = '';
    Object.keys(window.YEARLY_EVENTS_2026).sort().forEach(date => {
        if (date.startsWith(mKey)) {
            const ev = window.YEARLY_EVENTS_2026[date];
            const dNum = parseInt(date.split('-')[2]);
            html += `
                <div class="event-item-card" onclick="window.selectedDay=${dNum}; window.renderCalendar(); window.updatePanchangDisplay();">
                    <div class="event-date-badge">${dNum}</div>
                    <div class="event-details">
                        <h4>${lang === 'hi' ? ev.hi : ev.en}</h4>
                        <p>${lang === 'hi' ? ev.desc_hi : ev.desc_en}</p>
                    </div>
                </div>`;
        }
    });
    list.innerHTML = html || '<p style="text-align:center; padding:20px; color:#888;">No Festivals</p>';
};

// 6. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
        window.selectedDay = 1;
        window.renderCalendar();
        window.updatePanchangDisplay();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
        window.selectedDay = 1;
        window.renderCalendar();
        window.updatePanchangDisplay();
    });
});

window.addEventListener('languageChanged', () => {
    window.renderCalendar();
    window.updatePanchangDisplay();
});

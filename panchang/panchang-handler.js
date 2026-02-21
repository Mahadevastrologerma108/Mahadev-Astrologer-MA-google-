import { db, rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. GLOBAL STATE
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();
window.yearlyPanchangData = null;

// 2. TRANSLATION MIDDLEMAN (Fresh Dictionary Access)
const MiddleMan = {
    getTranslation: function(val) {
        if (!val) return "--";
        // Forcefully getting fresh language choice
        const lang = localStorage.getItem('selectedLanguage') || 'hi';
        const dict = window.translations?.[lang];
        if (!dict) return val;
        
        let trimmedVal = val.toString().trim();
        return dict[trimmedVal] || val;
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
    } catch (e) { console.error("🔱 Firebase Error:", e); }
};

// 4. UI DISPLAY (Panchang + Choghadiya)
window.updatePanchangDisplay = function() {
    const data = window.yearlyPanchangData;
    if (!data) return;

    const mKey = String(window.currentMonth + 1).padStart(2, '0');
    const dKey = "d" + String(window.selectedDay).padStart(2, '0');
    const d = (data[mKey] && data[mKey][dKey]) ? data[mKey][dKey] : null;

    if (!d) {
        // Reset if data not found
        ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karana', 'pan-paksha'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerText = "--";
        });
        return;
    }

    const update = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = MiddleMan.getTranslation(val);
    };

    update('pan-tithi', d.tithi);
    update('pan-nak', d.nakshatra);
    update('pan-yoga', d.yoga);
    update('pan-karana', d.karan || d.karana);
    update('pan-paksha', d.paksha);

    if(document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = d.sun ? `${d.sun.rise} / ${d.sun.set}` : "--";
    if(document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = d.muhurat?.abhijit || "--";
    if(document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = d.muhurat?.rahukaal || "--";

    // Choghadiya Builder
    const fillChaug = (tableId, list) => {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        if (!list) { tableBody.innerHTML = '<tr><td colspan="3">No Data</td></tr>'; return; }

        let html = '';
        Object.entries(list).forEach(([tKey, name]) => {
            const time = tKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
            const transName = MiddleMan.getTranslation(name);
            
            let statusText = "Good", statusColor = "#00ff88"; 
            if (["Rog", "Kaal", "Udveg", "रोग", "काल", "उद्वेग"].includes(name)) {
                statusText = "Bad"; statusColor = "#ff4d4d";
            } else if (["Char", "चर"].includes(name)) {
                statusText = "Neutral"; statusColor = "#ffcc00";
            }

            html += `<tr>
                <td style="color:var(--gold); font-weight:bold; padding:10px;">${time}</td>
                <td>${transName}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px; color:${statusColor}; font-size: 0.85rem; font-weight: bold;">
                        <span style="font-size: 1.2rem; line-height: 0;">●</span>
                        <span>${MiddleMan.getTranslation(statusText)}</span>
                    </div>
                </td>
            </tr>`;
        });
        tableBody.innerHTML = html;
    };

    fillChaug('day-chaug-body', d.choghadiya?.day);
    fillChaug('night-chaug-body', d.choghadiya?.night);
};

// 5. CALENDAR & EVENTS
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

    for (let i = 0; i < firstDay; i++) {
        container.innerHTML += '<div class="calendar-day empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        const mKey = String(window.currentMonth + 1).padStart(2, '0');
        const dKey = String(d).padStart(2, '0');
        const fullDateKey = `${window.currentYear}-${mKey}-${dKey}`;

        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[fullDateKey]) daySquare.classList.add('has-event');

        const dayData = window.yearlyPanchangData?.[mKey]?.["d"+dKey];
        if (dayData?.tithi) {
            const t = dayData.tithi.toLowerCase();
            if (t.includes('purnima') || t.includes('amavasya') || t.includes('ekadashi')) daySquare.classList.add('special-tithi');
        }

        if (window.selectedDay === d) daySquare.classList.add('active');
        if (d === today.getDate() && window.currentMonth === today.getMonth() && window.currentYear === today.getFullYear()) daySquare.classList.add('today');

        daySquare.innerText = d;
        daySquare.onclick = () => { window.selectedDay = d; window.renderCalendar(); window.updatePanchangDisplay(); };
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
            html += `<div class="event-item-card" onclick="window.selectedDay=${dNum}; window.renderCalendar(); window.updatePanchangDisplay();">
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
    
    // Month Navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; window.getPanchangFromFirebase(window.currentYear); }
        window.selectedDay = 1; window.renderCalendar(); window.updatePanchangDisplay();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; window.getPanchangFromFirebase(window.currentYear); }
        window.selectedDay = 1; window.renderCalendar(); window.updatePanchangDisplay();
    });
});

// FORCE REFRESH ON LANGUAGE CHANGE
window.addEventListener('languageChanged', () => {
    console.log("🔱 Signal Received: Updating all translations...");
    window.masterTranslatePanchang();
    window.renderCalendar();
    window.updatePanchangDisplay();
});

window.masterTranslatePanchang = function() {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const dict = window.translations?.[lang];
    if (!dict) return;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key]) el.innerText = dict[key];
    });
};
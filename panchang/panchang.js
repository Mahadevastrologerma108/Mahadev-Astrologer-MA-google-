/* ==========================================================
   🕉️ PANCHANG SYSTEM - CORE ENGINE (Ver 2.2 FINAL)
   ========================================================== */

let today = new Date();
let currentMonthView = new Date(2026, 1, 1); // Feb 2026
let activeDate = new Date(2026, 1, today.getDate()); 
let lang = localStorage.getItem('preferredLang') || 'hi';

window.onload = function() {
    console.log("Mahadev: Panchang System Activated 🔱");
    renderCalendar();
    fetchAndDisplayData(activeDate);
};

/* ----------------------------------------------------------
   1. MAIN CALENDAR ENGINE (Glow & Indicators Added)
   ---------------------------------------------------------- */
function renderCalendar() {
    const grid = document.getElementById('calendarDays');
    const display = document.getElementById('monthDisplay');
    if(!grid || !display) return;
    
    grid.innerHTML = '';
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();

    const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const t = window.translations ? window.translations[lang] : {};
    display.innerText = (t[monthNames[month]] || monthNames[month]) + ` ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerText = d;

        // 🌟 GLOW LOGIC (Today)
        const realToday = new Date();
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) {
            dayEl.classList.add('today-glow'); 
        }
        
        // 🎯 ACTIVE LOGIC
        if (d === activeDate.getDate() && month === activeDate.getMonth() && year === activeDate.getFullYear()) {
            dayEl.classList.add('active');
        }

        // 🔱 INDICATOR LOGIC (Events)
        const hasEvent = window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr];
        if (hasEvent) dayEl.classList.add('has-event');

        // 🕯️ SPECIAL TITHI LOGIC (Ekadashi/Purnima)
        const dbName = `PANCHANG_DATA_${year}_${String(month + 1).padStart(2, '0')}`;
        const pData = (window[dbName] && window[dbName][dStr]);
        if (pData && pData.tithi) {
            const tithi = pData.tithi.toLowerCase();
            if (tithi.includes('ekadashi') || tithi.includes('purnima') || tithi.includes('amavasya')) {
                dayEl.classList.add('special-tithi');
            }
        }

        dayEl.onclick = function() {
            activeDate = new Date(year, month, d);
            renderCalendar();
            fetchAndDisplayData(activeDate);
        };
        grid.appendChild(dayEl);
    }
}

/* ----------------------------------------------------------
   2. DATA FETCHER (Ribbon & Cards)
   ---------------------------------------------------------- */
function fetchAndDisplayData(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;
    
    const dbName = `PANCHANG_DATA_${year}_${month}`;
    const db = window[dbName] || {}; 
    const data = db[dStr];
    const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[dStr] : null;
    const t = window.translations ? window.translations[lang] : {};

    const ribbon = document.getElementById('ribbon-text');
    const detailBox = document.getElementById('event-display-area');

    // 🕉️ EVENT & TRANSLATION LOGIC
    if (event) {
        ribbon.innerText = event[lang] || event.hi;
        if(detailBox) {
            detailBox.innerHTML = `
                <div class="selected-event-card">
                    <span class="event-icon">🕉️</span>
                    <h3 class="gold-text">${event[lang] || event.hi}</h3>
                    <p style="color:#ccc; font-size:14px; margin-top:5px;">${event['desc_' + lang] || 'Panchang Vishesh'}</p>
                </div>`;
        }
    } else {
        ribbon.innerText = t['pan_no_event'] || "Jai Mahadev";
        if(detailBox) detailBox.innerHTML = "";
    }

    if (data) {
        const set = (id, val) => { 
            const el = document.getElementById(id); 
            if(el) el.innerText = (t[val] || val || "--"); 
        };
        set('pan-tithi', data.tithi);
        set('pan-nak', data.nakshatra);
        set('pan-yoga', data.yoga);
        set('pan-karana', data.karana);
        set('pan-paksha', data.paksha);
        
        if(document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
        if(document.getElementById('pan-moon')) document.getElementById('pan-moon').innerText = data.moonrise || "--:--";
        if(document.getElementById('pan-muh')) document.getElementById('pan-muh').innerText = data.muhurat || "--:--";
        if(document.getElementById('pan-rahu')) document.getElementById('pan-rahu').innerText = data.rahu_kaal || "--:--";

        renderChaugTable(data.chaughadia.day, 'day-chaug-body');
        renderChaugTable(data.chaughadia.night, 'night-chaug-body');
    } else {
        const ids = ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karana', 'pan-paksha', 'pan-sun', 'pan-moon', 'pan-muh', 'pan-rahu'];
        ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = "--"; });
        if(document.getElementById('day-chaug-body')) document.getElementById('day-chaug-body').innerHTML = "";
    }
    renderMonthlyEvents(dStr);
}

/* ----------------------------------------------------------
   3. TABLE RENDERERS & NAVIGATION
   ---------------------------------------------------------- */
function renderChaugTable(list, id) {
    const el = document.getElementById(id);
    if(!el || !list) return;
    const t = window.translations ? window.translations[lang] : {};
    el.innerHTML = list.map(item => `
        <tr>
            <td>${item.time}</td>
            <td style="color:var(--gold)">${t[item.name] || item.name}</td>
            <td class="nature-${item.nature}">${t[item.status] || item.status}</td>
        </tr>
    `).join('');
}

function renderMonthlyEvents(dStr) {
    const listContainer = document.getElementById('events-list'); 
    if (!listContainer) return;
    listContainer.innerHTML = '';
    const currentYearMonth = dStr.substring(0, 7); 
    const events = window.YEARLY_EVENTS_2026 || {};
    
    Object.keys(events).sort().forEach(date => {
        if (date.startsWith(currentYearMonth)) {
            const ev = events[date];
            const dayNum = date.split('-')[2]; 
            const row = document.createElement('div');
            row.className = 'event-item-row'; 
            row.innerHTML = `
                <div class="ev-date">${dayNum}</div>
                <div class="ev-info">
                    <div style="color:#fff; font-weight:600;">${ev[lang] || ev.hi}</div>
                    <div style="font-size:12px; color:#aaa;">${ev['desc_' + lang] || 'Panchang Vishesh'}</div>
                </div>`;
            listContainer.appendChild(row);
        }
    });
}

// 🧭 NAVIGATION (With Auto-Select First Date)
document.getElementById('prevMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() - 1); 
    activeDate = new Date(currentMonthView.getFullYear(), currentMonthView.getMonth(), 1);
    renderCalendar(); 
};
document.getElementById('nextMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() + 1); 
    activeDate = new Date(currentMonthView.getFullYear(), currentMonthView.getMonth(), 1);
    renderCalendar(); 
};

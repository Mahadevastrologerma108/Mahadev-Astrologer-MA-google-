/* ==========================================================
   🕉️ PANCHANG SYSTEM - CORE ENGINE (Ver 2.1 - Restored)
   ========================================================== */

let today = new Date();
let currentMonthView = new Date(2026, 1, 1); 
let activeDate = new Date(2026, 1, today.getDate()); 
let lang = localStorage.getItem('preferredLang') || 'hi';

window.onload = function() {
    console.log("Mahadev: Panchang System Activated");
    renderCalendar();
    fetchAndDisplayData(activeDate);
};

/* ----------------------------------------------------------
   1. MAIN CALENDAR ENGINE (Logic Exactly as you sent)
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

        const realToday = new Date();
        // ✅ YOUR GLOW LOGIC (Untouched)
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) dayEl.classList.add('today');
        
        if (d === activeDate.getDate() && month === activeDate.getMonth() && year === activeDate.getFullYear()) {
            dayEl.classList.add('active');
        }

        const hasEvent = window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr];
        const dbName = `PANCHANG_DATA_${year}_${String(month + 1).padStart(2, '0')}`;
        const monthDB = window[dbName] || {};
        const pData = monthDB[dStr];

        if (hasEvent) dayEl.classList.add('has-event');

        if (pData) {
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

    activeDate = new Date(year, month, activeDate.getDate() > daysInMonth ? 1 : activeDate.getDate());
    fetchAndDisplayData(activeDate);
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

    // ✅ FIXED ONLY THIS: Language check for Yearly Events
    if (event) {
        const festivalName = event[lang] || event.hi; // Automatic switch between hi/en
        ribbon.innerText = festivalName;
        if(detailBox) {
            detailBox.innerHTML = `
                <div class="event-item-row" style="border-left:5px solid #ff4d4d; background: rgba(255, 77, 77, 0.05);">
                    <div class="ev-info">
                        <div style="color:var(--gold); font-size:18px; font-family:'Cinzel';">${festivalName}</div>
                        <div style="margin-top:5px; color:#ddd;">${event['desc_' + lang] || ''}</div>
                    </div>
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
        if(document.getElementById('night-chaug-body')) document.getElementById('night-chaug-body').innerHTML = "";
    }
    renderMonthlyEvents(dStr);
}

/* ----------------------------------------------------------
   3. TABLE & LIST RENDERERS (Original Logic Untouched)
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

window.showChaug = function(type) {
    const dayBox = document.getElementById('day-chaug');
    const nightBox = document.getElementById('night-chaug');
    if(dayBox && nightBox) {
        dayBox.style.display = type === 'day' ? 'block' : 'none';
        nightBox.style.display = type === 'night' ? 'block' : 'none';
        document.getElementById('btn-day').classList.toggle('active', type === 'day');
        document.getElementById('btn-night').classList.toggle('active', type === 'night');
    }
};

document.getElementById('prevMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() - 1); 
    activeDate.setDate(1); 
    renderCalendar(); 
};
document.getElementById('nextMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() + 1); 
    activeDate.setDate(1); 
    renderCalendar(); 
};

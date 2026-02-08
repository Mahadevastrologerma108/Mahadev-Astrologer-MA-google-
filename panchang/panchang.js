// 🕉️ Global Variables
let today = new Date();
let currentMonthView = new Date(2026, 1, 1); // Feb 2026 se shuru
let activeDate = new Date(2026, 1, today.getDate()); 
let lang = localStorage.getItem('preferredLang') || 'hi';

// 🕉️ Entry Point
window.onload = function() {
    console.log("Mahadev: Panchang System Activated");
    renderCalendar();
    fetchAndDisplayData(activeDate);
};

// 🕉️ 1. Main Calendar Engine (With Glow & Indicators)
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

        // Current & Active Classes
        const realToday = new Date();
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) dayEl.classList.add('today');
        if (d === activeDate.getDate() && month === activeDate.getMonth() && year === activeDate.getFullYear()) dayEl.classList.add('active');

        // Logic: Event & Tithi Check
        const hasEvent = window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr];
        const dbName = `PANCHANG_DATA_${year}_${String(month + 1).padStart(2, '0')}`;
        const monthDB = window[dbName] || {};
        const pData = monthDB[dStr];

        // 🚩 Festival Indicator
        if (hasEvent) {
            dayEl.classList.add('has-event');
        }

        // 🔱 Special Tithi Glow (Ekadashi, Purnima, Amavasya)
        if (pData) {
            const tithi = pData.tithi.toLowerCase();
            if (tithi.includes('ekadashi') || tithi.includes('purnima') || tithi.includes('amavasya')) {
                dayEl.style.boxShadow = "inset 0 0 10px rgba(245, 197, 66, 0.4)";
                dayEl.style.border = "1px solid var(--gold)";
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

// 🕉️ 2. Data Fetcher (Top Cards & Ribbon)
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

    // Ribbon & Event Display
    if (event) {
        ribbon.innerText = event[lang] || event.hi;
        if(detailBox) {
            detailBox.innerHTML = `
                <div class="event-item-row" style="border-left:5px solid #ff4d4d;">
                    <div class="ev-info">
                        <div style="color:var(--gold); font-size:18px;">${event[lang] || event.hi}</div>
                        <div style="margin-top:5px;">${event['desc_' + lang] || ''}</div>
                    </div>
                </div>`;
        }
    } else {
        ribbon.innerText = t['pan_no_event'] || "Jai Mahadev";
        if(detailBox) detailBox.innerHTML = "";
    }

    // Fill Panchang Cards
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
    }
    renderMonthlyEvents(dStr);
}

// 🕉️ 3. Chaughadia Table Renderer
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

// 🕉️ 4. Monthly List Logic
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
                    <div>${ev[lang] || ev.hi}</div>
                    <div>${ev['desc_' + lang] || ''}</div>
                </div>`;
            listContainer.appendChild(row);
        }
    });
}

// 🕉️ Helpers (Prev/Next/Tabs)
window.showChaug = function(type) {
    document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
    document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
    document.getElementById('btn-day').classList.toggle('active', type === 'day');
    document.getElementById('btn-night').classList.toggle('active', type === 'night');
};

document.getElementById('prevMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() + 1); renderCalendar(); };

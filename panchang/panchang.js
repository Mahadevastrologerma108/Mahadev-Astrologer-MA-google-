// 🕉️ Global Variables
let today = new Date();
let currentMonthView = new Date(2026, 1, 1); 
let activeDate = new Date(2026, 1, today.getDate()); 
let lang = localStorage.getItem('preferredLang') || 'hi';

// 🕉️ Entry Point
window.onload = function() {
    console.log("Mahadev: Panchang Loaded");
    renderCalendar();
    fetchAndDisplayData(activeDate);
};

// 🕉️ 1. Main Calendar Engine
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
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) dayEl.classList.add('today');
        if (d === activeDate.getDate() && month === activeDate.getMonth() && year === activeDate.getFullYear()) dayEl.classList.add('active');

        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) dayEl.classList.add('has-event');

        dayEl.onclick = function() {
            activeDate = new Date(year, month, d);
            renderCalendar();
            fetchAndDisplayData(activeDate);
        };
        grid.appendChild(dayEl);
    }
}

// 🕉️ 2. Data Fetcher & Monthly List Caller
function fetchAndDisplayData(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;
    
    const db = window.PANCHANG_DATA_2026_02 || {}; 
    const data = db[dStr];
    const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[dStr] : null;
    const t = window.translations ? window.translations[lang] : {};

    const staticTitle = document.getElementById('static-title');
    const ribbon = document.getElementById('ribbon-text');
    const detailBox = document.getElementById('event-display-area');

    // --- DOUBLE TITLE LOGIC START ---
    if(staticTitle) {
        staticTitle.innerText = t['today_panchang'] || "Today's Panchang";
    }

    if (event) {
        ribbon.innerText = event[lang] || event.hi;
        if(detailBox) {
            detailBox.innerHTML = `
                <div class="p-card" style="width:100%; text-align:left; border-left:4px solid var(--gold); padding:15px;">
                    <h3 style="color:var(--gold)">${event[lang] || event.hi}</h3>
                    <p style="color:#ccc; margin-top:5px; font-size:14px;">${event['desc_' + lang] || ''}</p>
                </div>`;
        }
    } else {
        ribbon.innerText = t['pan_no_event'] || "Jai Mahadev";
        if(detailBox) detailBox.innerHTML = `<p style="text-align:center; color:#666; padding:10px;">No specific event today.</p>`;
    }
    // --- DOUBLE TITLE LOGIC END ---

    if (data) {
        const set = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = (t[val] || val || "--"); };
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
        const fields = ['pan-tithi', 'pan-nak', 'pan-yoga', 'pan-karana', 'pan-paksha'];
        fields.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = "--"; });
    }
    renderMonthlyEvents(dStr);
}

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

window.showChaug = function(type) {
    if(!document.getElementById('day-chaug')) return;
    document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
    document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
    document.getElementById('btn-day').classList.toggle('active', type === 'day');
    document.getElementById('btn-night').classList.toggle('active', type === 'night');
};

document.getElementById('prevMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() - 1); 
    renderCalendar(); 
};

document.getElementById('nextMonth').onclick = () => { 
    currentMonthView.setMonth(currentMonthView.getMonth() + 1); 
    renderCalendar(); 
};

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
                <div class="ev-date" style="font-weight:bold; color:var(--gold); min-width:40px;">${dayNum}</div>
                <div class="ev-info" style="flex:1; padding-left:10px; border-left:1px solid #444;">
                    <div style="font-weight:bold;">${ev[lang] || ev.hi}</div>
                    <div style="font-size:12px; color:#aaa;">${ev['desc_' + lang] || ''}</div>
                </div>
            `;
            listContainer.appendChild(row);
        }
    });
}

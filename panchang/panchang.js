/* ==========================================================
   🕉️ RESTORED ORIGINAL - NO MORE UPDATES
   ========================================================== */

let today = new Date();
let currentMonthView = new Date(2026, 1, 1); // February 2026
let activeDate = new Date(2026, 1, today.getDate()); 
let lang = localStorage.getItem('preferredLang') || 'hi';

window.onload = function() {
    renderCalendar();
    fetchAndDisplayData(activeDate);
};

function renderCalendar() {
    const grid = document.getElementById('calendarDays');
    const display = document.getElementById('monthDisplay');
    if(!grid || !display) return;
    
    grid.innerHTML = '';
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();

    // ✅ Translation for Month Name
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

        // ✅ OM SYMBOL (Exactly as it was inside your box)
        const hasEvent = window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr];
        if (hasEvent) {
            dayEl.innerHTML = `${d}<span class="om-mark" style="display:block; font-size:10px; color:var(--gold);">🕉️</span>`;
            dayEl.classList.add('has-event');
        } else {
            dayEl.innerText = d;
        }

        // ✅ ORIGINAL CLASSES (No 'Glow' logic, just your 'today' and 'active')
        const realToday = new Date();
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) {
            dayEl.classList.add('today'); 
        }
        if (d === activeDate.getDate() && month === activeDate.getMonth() && year === activeDate.getFullYear()) {
            dayEl.classList.add('active');
        }

        dayEl.onclick = function() {
            activeDate = new Date(year, month, d);
            renderCalendar();
            fetchAndDisplayData(activeDate);
        };
        grid.appendChild(dayEl);
    }
}

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

    // ✅ Original Event View
    if (event) {
        ribbon.innerText = event[lang] || event.hi;
        if(detailBox) {
            detailBox.innerHTML = `<div class="event-item-row"><div class="ev-info"><div style="color:var(--gold); font-size:18px;">${event[lang] || event.hi}</div></div></div>`;
        }
    } else {
        ribbon.innerText = t['pan_no_event'] || "Jai Mahadev";
        if(detailBox) detailBox.innerHTML = "";
    }

    if (data) {
        // ✅ Your Original Card Logic
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
        
        renderChaugTable(data.chaughadia.day, 'day-chaug-body');
        renderChaugTable(data.chaughadia.night, 'night-chaug-body');
    }
    renderMonthlyEvents(dStr);
}

// REST OF THE CODE REMAINS EXACTLY SAME
function renderChaugTable(list, id) {
    const el = document.getElementById(id);
    if(!el || !list) return;
    const t = window.translations ? window.translations[lang] : {};
    el.innerHTML = list.map(item => `<tr><td>${item.time}</td><td style="color:var(--gold)">${t[item.name] || item.name}</td><td class="nature-${item.nature}">${t[item.status] || item.status}</td></tr>`).join('');
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
            const row = document.createElement('div');
            row.className = 'event-item-row'; 
            row.innerHTML = `<div class="ev-date">${date.split('-')[2]}</div><div class="ev-info"><div style="color:#fff;">${ev[lang] || ev.hi}</div></div>`;
            listContainer.appendChild(row);
        }
    });
}

document.getElementById('prevMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() - 1); activeDate = new Date(currentMonthView.getFullYear(), currentMonthView.getMonth(), 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() + 1); activeDate = new Date(currentMonthView.getFullYear(), currentMonthView.getMonth(), 1); renderCalendar(); };

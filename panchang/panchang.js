// 🕉️ Global State
let currentMonthView = new Date(2026, 1, 6); // Feb 2026
let activeDate = new Date(2026, 1, 6);
let lang = localStorage.getItem('preferredLang') || 'hi';

// 🕉️ Entry Point: Files load hone ka wait karein
window.onload = () => {
    init();
};

function init() {
    renderCalendar();
    loadPanchangData(activeDate);
}

// 🕉️ Calendar Logic
function renderCalendar() {
    const grid = document.getElementById('calendarDays');
    const monthLabel = document.getElementById('monthDisplay');
    if (!grid || !monthLabel) return;

    grid.innerHTML = '';
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();

    // Month Heading
    const monthKeys = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const t = window.translations[lang];
    monthLabel.innerText = `${t[monthKeys[month]] || monthKeys[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty spaces
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    // Days
    for (let d = 1; d <= totalDays; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayBox = document.createElement('div');
        dayBox.className = 'calendar-day';
        dayBox.innerText = d;

        // Today Marker
        const realToday = new Date();
        if (d === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear()) {
            dayBox.classList.add('today');
        }

        // Active selection
        if (d === activeDate.getDate() && month === activeDate.getMonth()) {
            dayBox.classList.add('active');
        }

        // Red dot for events
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) {
            dayBox.classList.add('has-event');
        }

        dayBox.onclick = () => {
            activeDate = new Date(year, month, d);
            renderCalendar();
            loadPanchangData(activeDate);
        };
        grid.appendChild(dayBox);
    }
}

// 🕉️ Data Mapping Logic (Fixes Undefined)
function loadPanchangData(dateObj) {
    const dStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const data = window.PANCHANG_DATA_2026_02 ? window.PANCHANG_DATA_2026_02[dStr] : null;
    const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[dStr] : null;
    const t = window.translations[lang];

    // 1. Ribbon & Descriptions
    const ribbon = document.getElementById('ribbon-text');
    const eventDesc = document.getElementById('event-display-area');
    
    if (event) {
        ribbon.innerText = event[lang] || event.hi;
        eventDesc.innerHTML = `<div class="p-card" style="width:100%; text-align:left; border-left:3px solid var(--gold); padding:15px;">
            <h3 style="color:var(--gold)">${event[lang] || event.hi}</h3>
            <p style="font-size:14px; margin-top:10px;">${event['desc_'+lang] || ''}</p>
        </div>`;
    } else {
        ribbon.innerText = t['pan_ribbon_loading'] || "Jai Mahadev";
        eventDesc.innerHTML = `<p style="color:#666; text-align:center;">No festivals listed for today.</p>`;
    }

    // 2. Main Grid
    if (data) {
        document.getElementById('pan-tithi').innerText = t[data.tithi] || data.tithi;
        document.getElementById('pan-nak').innerText = t[data.nakshatra] || data.nakshatra;
        document.getElementById('pan-paksha').innerText = t[data.paksha] || data.paksha;
        document.getElementById('pan-yoga').innerText = t[data.yoga] || data.yoga;
        document.getElementById('pan-karana').innerText = t[data.karana] || data.karana;
        document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
        document.getElementById('pan-moon').innerText = data.moonrise || "--:--";
        document.getElementById('pan-muh').innerText = data.muhurat || data.abhijit || "--:--";
        document.getElementById('pan-rahu').innerText = data.rahu_kaal || "--:--";

        // 3. Chaughadia
        fillChaug(data.chaughadia.day, 'day-chaug-body');
        fillChaug(data.chaughadia.night, 'night-chaug-body');
    }
}

function fillChaug(list, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const t = window.translations[lang];
    table.innerHTML = list.map(item => `
        <tr>
            <td>${item.time}</td>
            <td style="color:var(--gold)">${t[item.name] || item.name}</td>
            <td class="nature-${item.nature}">${t[item.status] || item.status}</td>
        </tr>
    `).join('');
}

// 🕉️ Global Tab Switcher
window.showChaug = function(type) {
    document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
    document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
    document.getElementById('btn-day').classList.toggle('active', type === 'day');
    document.getElementById('btn-night').classList.toggle('active', type === 'night');
};

// 🕉️ Nav Listeners
document.getElementById('prevMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentMonthView.setMonth(currentMonthView.getMonth() + 1); renderCalendar(); };

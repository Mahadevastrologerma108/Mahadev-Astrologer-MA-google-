let currentLang = localStorage.getItem('preferredLang') || 'hi';
let viewDate = new Date(2026, 1, 1); 
let selectedDate = new Date().toISOString().split('T')[0];
let currentChaugMode = 'day';

document.addEventListener('DOMContentLoaded', () => { initPanchang(); });

function initPanchang() {
    renderCalendar();
    updateUI();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('calendar-month-year');
    if (!grid || !title) return;

    grid.innerHTML = "";
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    title.innerText = `${window.translations[currentLang][monthNames[month]]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="calendar-day empty" style="visibility:hidden"></div>`;

    for (let d = 1; d <= days; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isEvent = window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr] ? 'has-event' : '';
        const isActive = dStr === selectedDate ? 'active' : '';

        const day = document.createElement('div');
        day.className = `calendar-day ${isEvent} ${isActive}`;
        day.innerText = d;
        day.onclick = () => { selectedDate = dStr; renderCalendar(); updateUI(); };
        grid.appendChild(day);
    }
}

function updateUI() {
    const lang = currentLang;
    const data = window.PANCHANG_DATA_2026_02 ? window.PANCHANG_DATA_2026_02[selectedDate] : null;
    const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[selectedDate] : null;

    // 1. Ribbon & Event Box
    const ribbon = document.getElementById('event-ribbon');
    if (event) {
        document.getElementById('ribbon-event-name').innerText = event[lang] || event.hi;
        document.getElementById('det-event-title').innerText = event[lang] || event.hi;
        document.getElementById('det-event-desc').innerText = event[`desc_${lang}`] || "";
        document.getElementById('detailed-event-box').style.display = "block";
        ribbon.classList.add('glow');
    } else {
        document.getElementById('ribbon-event-name').innerText = window.translations[lang]['pan_ribbon_loading'];
        document.getElementById('detailed-event-box').style.display = "none";
        ribbon.classList.remove('glow');
    }

    // 2. Astro Details
    if (data) {
        document.getElementById('val-tithi').innerText = window.translations[lang][data.tithi] || data.tithi;
        document.getElementById('val-paksha').innerText = window.translations[lang][data.paksha] || data.paksha;
        document.getElementById('val-nakshatra').innerText = window.translations[lang][data.nakshatra] || data.nakshatra;
        document.getElementById('val-sun-time').innerText = `${data.sunrise} / ${data.sunset}`;
        document.getElementById('val-moon-time').innerText = data.moonrise || "--:--";
        document.getElementById('val-muhurat').innerText = data.muhurat || "---";
        renderChaughadia(data.chaughadia[currentChaugMode]);
    }
}

function renderChaughadia(list) {
    const container = document.getElementById('chaughadia-list');
    if(!container || !list) return;
    container.innerHTML = list.map(item => `
        <div class="chaug-item nature-${item.nature}" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span>${item.time}</span>
            <strong style="color:var(--gold-main)">${window.translations[currentLang][item.name]}</strong>
        </div>
    `).join('');
}

window.switchChaug = (mode) => {
    currentChaugMode = mode;
    document.getElementById('btn-day').classList.toggle('active', mode === 'day');
    document.getElementById('btn-night').classList.toggle('active', mode === 'night');
    updateUI();
};

window.changeMonth = (dir) => { viewDate.setMonth(viewDate.getMonth() + dir); renderCalendar(); };

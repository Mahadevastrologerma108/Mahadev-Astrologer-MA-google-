/* --- Panchang Brain (Fixed & Guaranteed) --- */
let currentLang = localStorage.getItem('preferredLang') || 'hi';
let viewDate = new Date(2026, 1, 1); // February 2026
let selectedDate = "2026-02-06"; 

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
});

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

    // Month Logic
    const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
    const mKey = monthNames[month];
    title.innerText = (window.translations[currentLang][mKey] || mKey) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    // Fill Empty Slots
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day empty" style="opacity:0"></div>`;
    }

    // Fill Days
    for (let d = 1; d <= daysCount; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isEvent = (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) ? 'has-event' : '';
        const isActive = dStr === selectedDate ? 'active' : '';

        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isEvent} ${isActive}`;
        dayDiv.innerText = d;
        dayDiv.onclick = () => { selectedDate = dStr; renderCalendar(); updateUI(); };
        grid.appendChild(dayDiv);
    }
}

function updateUI() {
    const lang = currentLang;
    const data = window.PANCHANG_DATA_2026_02 ? window.PANCHANG_DATA_2026_02[selectedDate] : null;
    const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[selectedDate] : null;

    // 1. Ribbon/Event
    const rib = document.getElementById('ribbon-event-name');
    if(event) {
        rib.innerText = event[lang] || event.hi;
        document.getElementById('det-event-title').innerText = event[lang] || event.hi;
        document.getElementById('det-event-desc').innerText = event[`desc_${lang}`] || "";
        document.getElementById('detailed-event-box').style.display = "block";
    } else {
        rib.innerText = window.translations[lang]['pan_ribbon_loading'];
        document.getElementById('detailed-event-box').style.display = "none";
    }

    // 2. Data Check
    if (data) {
        document.getElementById('val-tithi').innerText = window.translations[lang][data.tithi] || data.tithi;
        document.getElementById('val-paksha').innerText = window.translations[lang][data.paksha] || data.paksha;
        document.getElementById('val-nakshatra').innerText = window.translations[lang][data.nakshatra] || data.nakshatra;
        document.getElementById('val-sun-time').innerText = `${data.sunrise} / ${data.sunset}`;
        document.getElementById('val-moon-time').innerText = data.moonrise || "--:--";
        document.getElementById('val-muhurat').innerText = data.muhurat || "---";
    }
}

window.changeMonth = (dir) => {
    viewDate.setMonth(viewDate.getMonth() + dir);
    renderCalendar();
};

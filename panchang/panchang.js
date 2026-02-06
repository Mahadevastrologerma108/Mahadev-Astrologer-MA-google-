let currentLang = localStorage.getItem('preferredLang') || 'en';
let viewDate = new Date(); // For calendar navigation
let selectedDate = new Date().toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
});

// Initialize Page
function initPanchang() {
    renderCalendar();
    loadMonthlyData();
    updateUI();
}

// Render Calendar
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYearTitle = document.getElementById('calendar-month-year');
    grid.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Set Month Title
    const monthKey = `mon_${new Intl.DateTimeFormat('en-US', {month: 'short'}).toLowerCase()}`;
    monthYearTitle.innerText = `${window.translations[currentLang][monthKey]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isEvent = window.YEARLY_EVENTS_2026?.[dStr] ? 'has-event' : '';
        const isActive = dStr === selectedDate ? 'active' : '';

        grid.innerHTML += `<div class="calendar-day ${isEvent} ${isActive}" onclick="handleDateClick('${dStr}')">${d}</div>`;
    }
}

// Handle Date Selection
function handleDateClick(dateStr) {
    selectedDate = dateStr;
    renderCalendar();
    updateUI();
}

// Update UI Elements
function updateUI() {
    const event = window.YEARLY_EVENTS_2026?.[selectedDate];
    const ribbon = document.getElementById('event-ribbon');
    
    // 1. Update Ribbon & Event Box
    if (event) {
        document.getElementById('ribbon-event-name').innerText = currentLang === 'hi' ? event.hi : event.en;
        document.getElementById('det-event-title').innerText = currentLang === 'hi' ? event.hi : event.en;
        document.getElementById('det-event-desc').innerText = currentLang === 'hi' ? event.desc_hi : event.desc_en;
        ribbon.classList.add('glow');
    } else {
        document.getElementById('ribbon-event-name').innerText = window.translations[currentLang]['pan_ribbon_loading'];
        document.getElementById('det-event-title').innerText = "";
        document.getElementById('det-event-desc').innerText = "";
        ribbon.classList.remove('glow');
    }

    // 2. Update Panchang Data from Monthly DB
    const monthKey = `DB_${selectedDate.substring(0,4)}_${selectedDate.substring(5,7)}`;
    const data = window[monthKey]?.[selectedDate];

    if (data) {
        document.getElementById('val-tithi').innerText = window.translations[currentLang][data.tithi] || data.tithi;
        document.getElementById('val-paksha').innerText = window.translations[currentLang][data.paksha] || data.paksha;
        document.getElementById('val-nakshatra').innerText = window.translations[currentLang][data.nakshatra] || data.nakshatra;
        document.getElementById('val-sun-time').innerText = `${data.sunrise} / ${data.sunset}`;
        document.getElementById('val-moon-time').innerText = data.moonrise;
        document.getElementById('val-muhurat').innerText = data.muhurat || "---";
        renderChaughadia(data.chaughadia?.day); // Default to day
    }
}

// Chaughadia Rendering logic
function renderChaughadia(list) {
    const container = document.getElementById('chaughadia-list');
    container.innerHTML = list ? list.map(item => `
        <div class="chaug-item ${item.nature}">
            <span>${item.time}</span>
            <strong>${window.translations[currentLang][item.name]}</strong>
            <small>${window.translations[currentLang][item.status]}</small>
        </div>
    `).join('') : "No Data";
}

// Month Navigation
function changeMonth(step) {
    viewDate.setMonth(viewDate.getMonth() + step);
    renderCalendar();
}

let currentViewDate = new Date(2026, 0, 1);

async function initPanchang() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Display Aaj ki Date
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('display-date').innerText = now.toLocaleDateString('hi-IN', options);

    const response = await fetch('../assets/data/panchang2026.json');
    const data = await response.json();

    // 1. Update Today's View
    if (data[today]) {
        const d = data[today];
        document.getElementById('pan-tithi').innerText = d.tithi;
        document.getElementById('pan-nak').innerText = d.nakshatra;
        document.getElementById('pan-sun').innerText = d.sunrise + " / " + d.sunset;
        document.getElementById('pan-muh').innerText = d.muhurat;
        if(d.festival !== "None") {
            document.getElementById('fest-box').style.display = 'block';
            document.getElementById('today-fest').innerText = d.festival;
        }
    }
    
    // 2. Render Monthly Calendar
    renderMonthlyCalendar(data);
}

function renderMonthlyCalendar(data) {
    const grid = document.getElementById('calendar-grid');
    const list = document.getElementById('event-list');
    const monthYearLabel = document.getElementById('month-name');
    
    grid.innerHTML = ''; list.innerHTML = '';
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    monthYearLabel.innerText = currentViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Fill Calendar
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const eventName = data[dateStr] ? data[dateStr].festival : "None";
        const hasEvent = eventName !== "None";

        grid.innerHTML += `<div class="cal-date ${hasEvent ? 'event-highlight' : ''}">${d}</div>`;
        if (hasEvent) {
            list.innerHTML += `<li><strong>${d}:</strong> ${eventName}</li>`;
        }
    }
}

function changeMonth(step) {
    currentViewDate.setMonth(currentViewDate.getMonth() + step);
    initPanchang();
}

window.onload = initPanchang;
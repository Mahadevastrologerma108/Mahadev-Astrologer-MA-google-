const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentYear = 2026;
let currentMonth = new Date().getMonth();

async function initPanchang() {
    try {
        const [resEvents, resDetails] = await Promise.all([fetch(eventPath), fetch(detailPath)]);
        const allEvents = await resEvents.json();
        const allDetails = await resDetails.json();

        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA');

        updateDailyView(allDetails[todayStr]);
        updateMonthlyEvents(allEvents);
        renderCalendar(currentMonth, currentYear); // Visual Grid Logic

    } catch (error) { console.error("Error loading data", error); }
}

function renderCalendar(month, year) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = "";
    
    // Add Weekday Headers
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
        grid.innerHTML += `<div class="day-header">${d}</div>`;
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day"></div>`;
    }

    // Actual Days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        grid.innerHTML += `<div class="calendar-day ${isToday ? 'today' : ''}">${d}</div>`;
    }
}

// Function: Sidebar List
function updateMonthlyEvents(allEvents) {
    const monthNameStr = monthNames[currentMonth];
    document.getElementById('month-name').innerText = `${monthNameStr} ${currentYear}`;
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = "";
    const monthlyData = allEvents[monthNameStr];

    if (monthlyData) {
        Object.keys(monthlyData).forEach(dateKey => {
            const dayNum = dateKey.split('-')[2];
            eventList.innerHTML += `<li style="padding:10px 0; border-bottom:1px solid rgba(255,215,0,0.1);">
                <span class="gold-text"><strong>${dayNum}:</strong></span> ${monthlyData[dateKey]}</li>`;
        });
    }
}

function updateDailyView(data) {
    if (!data) return;
    document.getElementById('pan-tithi').innerText = data.tithi;
    document.getElementById('pan-nak').innerText = data.nakshatra;
    document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
    document.getElementById('pan-muh').innerText = data.muhurat;
    if (data.festival !== "None") {
        document.getElementById('fest-box').style.display = "block";
        document.getElementById('today-fest').innerText = data.festival;
    }
}

function changeMonth(step) {
    currentMonth += step;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    initPanchang();
}

initPanchang();
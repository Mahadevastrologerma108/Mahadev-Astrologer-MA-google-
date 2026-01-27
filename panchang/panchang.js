const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentYear = 2026;
let currentMonth = new Date().getMonth();

async function initPanchang() {
    try {
        const [resEvents, resDetails] = await Promise.all([
            fetch(eventPath).then(res => res.json()),
            fetch(detailPath).then(res => res.json())
        ]);

        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA');

        updateDailyView(resDetails[todayStr]);
        updateMonthlyEvents(resEvents);
        renderCalendar(currentMonth, currentYear);

    } catch (error) { 
        console.error("Data load error:", error); 
    }
}

function renderCalendar(month, year) {
    const grid = document.getElementById('calendar-grid');
    if(!grid) return;
    grid.innerHTML = "";

    // Hindi Day Headers
    ['र','सो','मं','बु','गु','शु','श'].forEach(d => {
        grid.innerHTML += `<div class="day-header">${d}</div>`;
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill Blanks
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div></div>`;
    }

    // Fill Days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        grid.innerHTML += `<div class="calendar-day ${isToday ? 'today' : ''}">${d}</div>`;
    }
}

function updateMonthlyEvents(allEvents) {
    const monthNameStr = monthNames[currentMonth];
    document.getElementById('month-name').innerText = `${monthNameStr} ${currentYear}`;
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = "";
    
    const monthlyData = allEvents[monthNameStr];
    if (monthlyData) {
        Object.keys(monthlyData).sort().forEach(dateKey => {
            const dayNum = dateKey.split('-')[2];
            eventList.innerHTML += `<li><span class="gold-text"><strong>${dayNum}:</strong></span> ${monthlyData[dateKey]}</li>`;
        });
    } else {
        eventList.innerHTML = "<li>Is mahine koi ustav nahi hai.</li>";
    }
}

function updateDailyView(data) {
    if (!data) return;
    document.getElementById('pan-tithi').innerText = data.tithi || "--";
    document.getElementById('pan-nak').innerText = data.nakshatra || "--";
    document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
    document.getElementById('pan-muh').innerText = data.muhurat || "--";
    
    const festBox = document.getElementById('fest-box');
    if (data.festival && data.festival !== "None") {
        festBox.style.display = "block";
        document.getElementById('today-fest').innerText = data.festival;
    } else {
        festBox.style.display = "none";
    }
}

function changeMonth(step) {
    currentMonth += step;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    initPanchang();
}

initPanchang();
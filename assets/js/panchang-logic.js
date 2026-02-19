// Calendar logic for Main Site
let currentYear = 2026;
let currentMonth = new Date().getMonth(); 

async function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    
    // 🔱 Firebase se data fetch karna (Global window function use kar rahe hain)
    const yearlyData = await window.loadYearlyData(year);
    
    calendarDays.innerHTML = '';
    const date = new Date(year, month, 1);
    const firstDayIndex = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
    monthDisplay.innerText = `${monthNames[month]} ${year}`;

    // Blank spaces for previous month
    for (let x = 0; x < firstDayIndex; x++) {
        const div = document.createElement('div');
        calendarDays.appendChild(div);
    }

    // Days with Events
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-cell');
        dayDiv.innerText = i;
        
        const dateStr = `${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        if (yearlyData && yearlyData[dateStr]) {
            dayDiv.classList.add('has-event');
            const dot = document.createElement('span');
            dot.classList.add('event-dot');
            dayDiv.appendChild(dot);
        }

        dayDiv.onclick = () => showDetails(dateStr, i, yearlyData);
        calendarDays.appendChild(dayDiv);
    }
}

// Details dikhane ka logic
function showDetails(dateKey, day, data) {
    const dayData = data[dateKey] || { tithi: { hi: "N/A", en: "N/A" }, event: { hi: "No Event", en: "No Event" }, sun: { rise: "--", set: "--" } };
    
    // Aapke UI elements update karna
    document.getElementById('pan-tithi').innerText = dayData.tithi.en;
    document.getElementById('pan-sun').innerText = `${dayData.sun.rise} / ${dayData.sun.set}`;
    
    const eventArea = document.getElementById('event-display-area');
    eventArea.innerHTML = `<div class="event-card"><h4>${dayData.event.en}</h4></div>`;
}

// Navigation Buttons
document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentMonth, currentYear);
});

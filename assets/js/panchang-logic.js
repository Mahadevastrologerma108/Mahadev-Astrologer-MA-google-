window.currentYear = 2026;
window.currentMonth = 1; // February (0 index logic)

window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    if (!container) return;

    container.innerHTML = '';
    const date = new Date(window.currentYear, window.currentMonth, 1);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    monthDisplay.innerText = `${monthNames[window.currentMonth]} ${window.currentYear}`;

    // Month ke pehle din ka gap (Empty slots)
    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        container.appendChild(empty);
    }

    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 1; i <= daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day'; // 🔱 Aapke CSS se match kiya
        daySquare.innerText = i;

        const dateKey = `${String(window.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayData = window["Data" + window.currentYear] ? window["Data" + window.currentYear][dateKey] : null;

        // 🔱 Today Marker Logic
        if (today.getDate() === i && today.getMonth() === window.currentMonth && today.getFullYear() === window.currentYear) {
            daySquare.classList.add('today');
        }

        // 🔱 Special Tithi Glow (Ekadashi, Purnima etc logic)
        if (dayData && (dayData.tithi?.hi.includes('एकादशी') || dayData.tithi?.hi.includes('पूर्णिमा') || dayData.tithi?.hi.includes('अमावस्या'))) {
            daySquare.classList.add('special-tithi');
        }

        // 🔱 Has Event (Red Dot)
        if (dayData && dayData.festivals && dayData.festivals.length > 0) {
            daySquare.classList.add('has-event');
        }

        // 🔱 Click to Update Sandwich Layer
        daySquare.onclick = () => {
            // Purani active class hatao
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            daySquare.classList.add('active'); // 🔱 Aapka active CSS trigger hoga
            window.updatePanchangDisplay(window["Data" + window.currentYear], dateKey);
        };

        container.appendChild(daySquare);
    }
    console.log("✅ Practical Grid Rendered with Glow!");
};

// Next/Prev Buttons Logic
document.getElementById('prevMonth')?.addEventListener('click', () => {
    window.currentMonth--;
    if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
    window.renderCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    window.currentMonth++;
    if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
    window.renderCalendar();
});

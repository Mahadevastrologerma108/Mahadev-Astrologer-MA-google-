window.currentYear = 2026;
window.currentMonth = new Date().getMonth(); // Automatically current month uthayega

window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    if (!container) return;

    container.innerHTML = '';
    const date = new Date(window.currentYear, window.currentMonth, 1);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if (monthDisplay) monthDisplay.innerText = `${monthNames[window.currentMonth]} ${window.currentYear}`;

    // 1. Pehle din ka gap (Empty slots)
    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        container.appendChild(empty);
    }

    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();
    const today = new Date();

    // 2. Days Loop
    for (let i = 1; i <= daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        daySquare.innerText = i;

        const dateKey = `${String(window.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const fullDateKey = `${window.currentYear}-${dateKey}`; // Format: 2026-02-15
        
        const dayData = window["Data" + window.currentYear] ? window["Data" + window.currentYear][dateKey] : null;

        // Today Marker
        if (today.getDate() === i && today.getMonth() === window.currentMonth && today.getFullYear() === window.currentYear) {
            daySquare.classList.add('today');
        }

        // Special Tithi Glow (Ekadashi, Purnima, Amavasya)
        if (dayData && (dayData.tithi?.hi.includes('एकादशी') || dayData.tithi?.hi.includes('पूर्णिमा') || dayData.tithi?.hi.includes('अमावस्या'))) {
            daySquare.classList.add('special-tithi');
        }

        // 🚩 Has Event Marker (Bilingual file se check karega)
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[fullDateKey]) {
            daySquare.classList.add('has-event');
        }

        // Click Logic
        daySquare.onclick = () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            daySquare.classList.add('active');
            
            // Upar ke Panchang Cards update karein
            if (window.updatePanchangDisplay && window["Data" + window.currentYear]) {
                window.updatePanchangDisplay(window["Data" + window.currentYear], dateKey);
            }
        };

        container.appendChild(daySquare);
    }

    // 🚩🚩 SABSE ZAROORI: Niche ki Events List ko Refresh karna
    if (typeof window.updateMonthlyEvents === 'function') {
        window.updateMonthlyEvents();
    }

    console.log(`✅ Calendar Rendered for ${monthNames[window.currentMonth]}`);
};

// 3. Next/Prev Buttons Logic
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

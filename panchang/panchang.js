document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    let selectedDate = new Date();

    // 🕉️ 1. Main Calendar Engine
    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('monthDisplay');
        calendarDays.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthDisplay.innerText = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerText = day;

            // Today Marker
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayElement.classList.add('today');
            
            // Selected Marker
            if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) dayElement.classList.add('active');

            // 🔱 Festival Indicator Logic (Sample: 10th and 25th have events)
            if (day === 10 || day === 25) dayElement.classList.add('has-event');

            dayElement.onclick = () => {
                selectedDate = new Date(year, month, day);
                updatePanchangData(selectedDate);
                renderCalendar();
                // Smooth scroll to top to see data
                window.scrollTo({ top: 100, behavior: 'smooth' });
            };
            calendarDays.appendChild(dayElement);
        }
    }

    // 🕉️ 2. Data Update (Connects with Ribbon & Cards)
    window.updatePanchangData = function(date) {
        // Ribbon Update
        document.getElementById('ribbon-text').innerText = "Aaj Shattila Ekadashi ka shubh vrat hai.";
        
        // Cards Update (Dummy for now)
        document.getElementById('pan-tithi').innerText = "Shukla Navami";
        document.getElementById('pan-sun').innerText = "07:12 AM / 06:15 PM";

        // Chaughadia Table Update
        document.getElementById('day-chaug-body').innerHTML = `
            <tr><td>07:12 - 08:35</td><td>Shubh</td><td class="nature-shubh">Good</td></tr>
            <tr><td>08:35 - 09:58</td><td>Rog</td><td class="nature-ashubh">Bad</td></tr>
        `;
        
        if(window.updateUI) window.updateUI(); // Language refresh
    }

    // 🕉️ 3. Day/Night Tab Switcher
    window.showChaug = function(type) {
        document.querySelectorAll('.chaug-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.c-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(type + '-chaug').style.display = 'block';
        document.getElementById('btn-' + type).classList.add('active');
    }

    // Navigation
    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
    updatePanchangData(selectedDate);
});

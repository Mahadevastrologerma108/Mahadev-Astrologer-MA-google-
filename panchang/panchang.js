document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = new Date();

    // 🔱 1. Calendar Generate Function
    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        monthDisplay.innerText = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerText = day;

            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.classList.add('active');
            }

            dayElement.onclick = () => {
                selectedDate = new Date(year, month, day);
                updatePanchangData(selectedDate);
                renderCalendar(); 
            };
            calendarDays.appendChild(dayElement);
        }
    }

    // 🔱 2. Panchang & Chaughadia Data Update
    window.updatePanchangData = function(date) {
        console.log("Fetching data for:", date.toDateString());
        
        // --- Basic Panchang Update ---
        document.getElementById('pan-tithi').innerText = "Shukla Navami";
        document.getElementById('pan-nak').innerText = "Rohini";
        document.getElementById('pan-yoga').innerText = "Shubha";
        document.getElementById('pan-karana').innerText = "Balava";
        document.getElementById('pan-paksha').innerText = "Shukla";
        document.getElementById('pan-sun').innerText = "07:12 AM / 06:15 PM";
        document.getElementById('pan-moon').innerText = "01:45 PM";
        document.getElementById('pan-muh').innerText = "12:10 PM - 12:55 PM";
        document.getElementById('pan-rahu').innerText = "10:30 AM - 12:00 PM";

        // --- Chaughadia Table Update (Sample Data) ---
        const dayBody = document.getElementById('day-chaug-body');
        const nightBody = document.getElementById('night-chaug-body');

        // Day Data
        dayBody.innerHTML = `
            <tr><td>07:12 - 08:35</td><td>Shubh</td><td class="nature-shubh">Auspicious</td></tr>
            <tr><td>08:35 - 09:58</td><td>Rog</td><td class="nature-ashubh">Inauspicious</td></tr>
            <tr><td>09:58 - 11:21</td><td>Udhyog</td><td class="nature-ashubh">Bad</td></tr>
        `;

        // Night Data
        nightBody.innerHTML = `
            <tr><td>06:15 - 07:52</td><td>Amrit</td><td class="nature-shubh">Very Good</td></tr>
            <tr><td>07:52 - 09:29</td><td>Chal</td><td class="nature-chal">Neutral</td></tr>
        `;

        if(window.updateUI) window.updateUI();
    }

    // 🔱 3. Chaughadia Tab Switcher
    window.showChaug = function(type) {
        document.querySelectorAll('.chaug-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.c-tab').forEach(el => el.classList.remove('active'));
        
        document.getElementById(type + '-chaug').style.display = 'block';
        if(type === 'day') document.getElementById('btn-day').classList.add('active');
        else document.getElementById('btn-night').classList.add('active');
    }

    // 🔱 4. Month Navigation
    prevMonthBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    nextMonthBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    // Initial Load
    renderCalendar();
    updatePanchangData(selectedDate);
});

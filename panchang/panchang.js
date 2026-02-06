document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = new Date();

    // 🔱 1. Calendar Generate Karne ka Function
    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Month and Year Display set karein
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        monthDisplay.innerText = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Pichle mahine ke khaali din (Padding)
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            calendarDays.appendChild(emptyDiv);
        }

        // Mahine ke asli din
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerText = day;

            // Today highlight
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            // Selected Day highlight
            if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.classList.add('active');
            }

            // Click Event: Jab date par click ho
            dayElement.onclick = () => {
                selectedDate = new Date(year, month, day);
                updatePanchangData(selectedDate);
                renderCalendar(); // UI Refresh highlight ke liye
            };

            calendarDays.appendChild(dayElement);
        }
    }

    // 🔱 2. Panchang Data Update Function (Dummy Logic abhi ke liye)
    function updatePanchangData(date) {
        console.log("Fetching data for:", date.toDateString());
        
        // Yahan tum API se data fetch karoge. Abhi main placeholder dikha raha hoon
        document.getElementById('pan-tithi').innerText = "Shukla Navami";
        document.getElementById('pan-nak').innerText = "Rohini";
        document.getElementById('pan-yoga').innerText = "Shubha";
        document.getElementById('pan-karana').innerText = "Balava";
        document.getElementById('pan-paksha').innerText = "Shukla";
        document.getElementById('pan-sun').innerText = "07:12 AM / 06:15 PM";
        document.getElementById('pan-moon').innerText = "01:45 PM";
        document.getElementById('pan-muh').innerText = "12:10 PM - 12:55 PM";
        document.getElementById('pan-rahu').innerText = "10:30 AM - 12:00 PM";

        // Translation update trigger agar language switch hui ho
        if(window.updateUI) window.updateUI();
    }

    // 🔱 3. Month Navigation
    prevMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };

    nextMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };

    // Initial Load
    renderCalendar();
    updatePanchangData(selectedDate);
});

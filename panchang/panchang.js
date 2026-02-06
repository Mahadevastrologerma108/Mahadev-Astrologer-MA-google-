document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date(2026, 1, 6); // Shuruat Feb 2026 se
    let selectedDate = new Date(2026, 1, 6);
    let currentLang = localStorage.getItem('preferredLang') || 'hi';
    let currentChaugMode = 'day';

    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('monthDisplay');
        if (!calendarDays || !monthDisplay) return;

        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
        monthDisplay.innerText = (window.translations[currentLang][monthNames[month]] || monthNames[month]) + ` ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let d = 1; d <= daysInMonth; d++) {
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerText = d;

            // 🔱 Red Dot Logic
            if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) dayEl.classList.add('has-event');

            // 🕉️ Today Logic
            const today = new Date();
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayEl.classList.add('today');
            
            // Selection Logic
            if (d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) dayEl.classList.add('active');

            dayEl.onclick = () => {
                selectedDate = new Date(year, month, d);
                updatePanchangData(selectedDate);
                renderCalendar();
            };
            calendarDays.appendChild(dayEl);
        }
    }

    window.updatePanchangData = function(dateObj) {
        const dStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        const data = window.PANCHANG_DATA_2026_02 ? window.PANCHANG_DATA_2026_02[dStr] : null;
        const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[dStr] : null;

        // Ribbon
        document.getElementById('ribbon-text').innerText = event ? (event[currentLang] || event.hi) : (window.translations[currentLang]['pan_ribbon_loading']);
        
        if (data) {
            document.getElementById('pan-tithi').innerText = window.translations[currentLang][data.tithi] || data.tithi;
            document.getElementById('pan-paksha').innerText = window.translations[currentLang][data.paksha] || data.paksha;
            document.getElementById('pan-nak').innerText = window.translations[currentLang][data.nakshatra] || data.nakshatra;
            document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
            document.getElementById('pan-moon').innerText = data.moonrise || "--:--";
            document.getElementById('pan-muh').innerText = data.muhurat || "---";

            renderChaugTable(data.chaughadia.day, 'day-chaug-body');
            renderChaugTable(data.chaughadia.night, 'night-chaug-body');
        }
    };

    function renderChaugTable(list, bodyId) {
        const body = document.getElementById(bodyId);
        if(!body || !list) return;
        body.innerHTML = list.map(item => `
            <tr><td>${item.time}</td><td>${window.translations[currentLang][item.name] || item.name}</td><td class="nature-${item.nature}">${window.translations[currentLang][item.status] || item.status}</td></tr>
        `).join('');
    }

    window.showChaug = function(type) {
        currentChaugMode = type;
        document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
        document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
        document.getElementById('btn-day').classList.toggle('active', type === 'day');
        document.getElementById('btn-night').classList.toggle('active', type === 'night');
    };

    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
    updatePanchangData(selectedDate);
});

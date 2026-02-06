document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date(2026, 1, 6); // Shuruat Feb 2026 se
    let selectedDate = new Date(2026, 1, 6);
    let currentLang = localStorage.getItem('preferredLang') || 'hi';

    // 🕉️ 1. Main Calendar Engine (Enhanced with 2026 Logic)
    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('monthDisplay');
        if (!calendarDays || !monthDisplay) return;

        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Translations use kar rahe hain month ke liye
        const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
        const mKey = monthNames[month];
        monthDisplay.innerText = (window.translations[currentLang][mKey] || mKey) + ` ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty slots for alignment
        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerText = day;

            // Date String matching (YYYY-MM-DD)
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // 🔱 Festival Indicator Logic (From events-2026.js)
            if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) {
                dayElement.classList.add('has-event');
            }

            // Today Marker
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Selected Marker
            if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayElement.classList.add('active');
            }

            dayElement.onclick = () => {
                selectedDate = new Date(year, month, day);
                updatePanchangData(selectedDate);
                renderCalendar();
                window.scrollTo({ top: 100, behavior: 'smooth' });
            };
            calendarDays.appendChild(dayElement);
        }
    }

    // 🕉️ 2. Data Update (Connected to db-2026-02.js)
    window.updatePanchangData = function(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dStr = `${year}-${month}-${day}`;

        // Fetch Data from JS Database
        const data = (window.PANCHANG_DATA_2026_02 && window.PANCHANG_DATA_2026_02[dStr]) ? window.PANCHANG_DATA_2026_02[dStr] : null;
        const event = (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) ? window.YEARLY_EVENTS_2026[dStr] : null;
        const lang = currentLang;

        // --- Ribbon Update (Glow Logic) ---
        const ribText = document.getElementById('ribbon-text');
        const ribbonContainer = document.getElementById('event-ribbon'); // Make sure this ID exists in HTML
        if (event) {
            ribText.innerText = event[lang] || event.hi;
            if(ribbonContainer) ribbonContainer.classList.add('glow');
        } else {
            ribText.innerText = window.translations[lang]['pan_ribbon_loading'] || "Mahadev's Grace...";
            if(ribbonContainer) ribbonContainer.classList.remove('glow');
        }
        
        // --- Cards Update ---
        if (data) {
            document.getElementById('pan-tithi').innerText = window.translations[lang][data.tithi] || data.tithi;
            document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
            
            // Nakshatra aur Paksha agar aapke HTML mein IDs hain:
            if(document.getElementById('pan-nak')) document.getElementById('pan-nak').innerText = window.translations[lang][data.nakshatra] || data.nakshatra;
            if(document.getElementById('pan-paksha')) document.getElementById('pan-paksha').innerText = window.translations[lang][data.paksha] || data.paksha;

            // --- Chaughadia Table Update ---
            renderChaughadiaTable(data.chaughadia.day, 'day-chaug-body');
            renderChaughadiaTable(data.chaughadia.night, 'night-chaug-body');
        }
    }

    // Helper to render Chaughadia Rows
    function renderChaughadiaTable(list, bodyId) {
        const body = document.getElementById(bodyId);
        if(!body || !list) return;
        body.innerHTML = list.map(item => `
            <tr>
                <td>${item.time}</td>
                <td>${window.translations[currentLang][item.name] || item.name}</td>
                <td class="nature-${item.nature}">${window.translations[currentLang][item.status] || item.status}</td>
            </tr>
        `).join('');
    }

    // 🕉️ 3. Day/Night Tab Switcher
    window.showChaug = function(type) {
        document.querySelectorAll('.chaug-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.c-tab').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(type + '-chaug');
        if(target) target.style.display = 'block';
        const btn = document.getElementById('btn-' + type);
        if(btn) btn.classList.add('active');
    }

    // Navigation
    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    // Initial Load
    renderCalendar();
    updatePanchangData(selectedDate);
});

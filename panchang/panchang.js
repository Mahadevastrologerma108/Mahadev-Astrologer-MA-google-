document.addEventListener('DOMContentLoaded', () => {
    // Shuruat aaj ki date se ya Feb 2026 se
    let currentDate = new Date(2026, 1, 6); 
    let selectedDate = new Date(2026, 1, 6);
    let currentLang = localStorage.getItem('preferredLang') || 'hi';

    // 🕉️ 1. Calendar Engine
    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('monthDisplay');
        if (!calendarDays || !monthDisplay) return;

        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Month Title Translation
        const monthNames = ["mon_jan", "mon_feb", "mon_mar", "mon_apr", "mon_may", "mon_jun", "mon_jul", "mon_aug", "mon_sep", "mon_oct", "mon_nov", "mon_dec"];
        const mKey = monthNames[month];
        monthDisplay.innerText = (window.translations[currentLang][mKey] || mKey) + ` ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let d = 1; d <= daysInMonth; d++) {
            const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerText = d;

            // 🔴 Event Indicator (Red Dot)
            if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) {
                dayEl.classList.add('has-event');
            }

            // 🕉️ Today Marker
            const today = new Date();
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            
            // 🌟 Active Selection
            if (d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
                dayEl.classList.add('active');
            }

            dayEl.onclick = () => {
                selectedDate = new Date(year, month, d);
                updatePanchangData(selectedDate);
                renderCalendar();
            };
            calendarDays.appendChild(dayEl);
        }
    }

    // 🕉️ 2. Data Update (All Fields)
    window.updatePanchangData = function(dateObj) {
        const dStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        
        // Data sources
        const data = window.PANCHANG_DATA_2026_02 ? window.PANCHANG_DATA_2026_02[dStr] : null;
        const event = window.YEARLY_EVENTS_2026 ? window.YEARLY_EVENTS_2026[dStr] : null;
        const lang = currentLang;

        // --- Ribbon Update ---
        const ribText = document.getElementById('ribbon-text');
        const ribbon = document.getElementById('today-event-ribbon');
        if (event) {
            ribText.innerText = event[lang] || event.hi;
            ribbon.style.display = 'block'; // Show if event exists
        } else {
            ribText.innerText = window.translations[lang]['pan_ribbon_loading'] || "...";
        }
        
        // --- Main Grid Update ---
        if (data) {
            document.getElementById('pan-tithi').innerText = window.translations[lang][data.tithi] || data.tithi;
            document.getElementById('pan-nak').innerText = window.translations[lang][data.nakshatra] || data.nakshatra;
            document.getElementById('pan-yoga').innerText = window.translations[lang][data.yoga] || data.yoga || "--";
            document.getElementById('pan-karana').innerText = window.translations[lang][data.karana] || data.karana || "--";
            document.getElementById('pan-paksha').innerText = window.translations[lang][data.paksha] || data.paksha;
            document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
            document.getElementById('pan-moon').innerText = data.moonrise || "--:--";
            document.getElementById('pan-muh').innerText = data.muhurat || "--:--";
            document.getElementById('pan-rahu').innerText = data.rahu_kaal || "--:--";

            // --- Chaughadia Tables ---
            renderChaug(data.chaughadia.day, 'day-chaug-body');
            renderChaug(data.chaughadia.night, 'night-chaug-body');

            // --- Detailed Events Area ---
            const eventArea = document.getElementById('event-display-area');
            if(event) {
                eventArea.innerHTML = `
                    <div class="p-card" style="width:100%; text-align:left; padding:20px;">
                        <h3 style="color:var(--gold)">${event[lang]}</h3>
                        <p style="font-size:14px; margin-top:10px; color:#ccc;">${event['desc_' + lang] || ''}</p>
                    </div>
                `;
            } else {
                eventArea.innerHTML = `<p style="text-align:center; color:#666;">No special events for this day.</p>`;
            }
        }
    };

    function renderChaug(list, bodyId) {
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

    // 🕉️ 3. Tab Switcher
    window.showChaug = function(type) {
        document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
        document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
        document.getElementById('btn-day').classList.toggle('active', type === 'day');
        document.getElementById('btn-night').classList.toggle('active', type === 'night');
    };

    // Navigation
    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
    updatePanchangData(selectedDate);
});

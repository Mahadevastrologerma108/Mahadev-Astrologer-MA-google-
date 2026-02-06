document.addEventListener('DOMContentLoaded', () => {
    // Shuruat 6 Feb 2026 se (Testing ke liye)
    let currentDate = new Date(2026, 1, 6); 
    let selectedDate = new Date(2026, 1, 6);
    let currentLang = localStorage.getItem('preferredLang') || 'hi';

    // 🕉️ 1. Calendar Engine (Clickable & Fixed)
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

            // Indicator for Events
            if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) {
                dayEl.classList.add('has-event');
            }

            // Selection & Today
            const today = new Date();
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayEl.classList.add('today');
            if (d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) dayEl.classList.add('active');

            // CLICK EVENT FIXED
            dayEl.addEventListener('click', () => {
                selectedDate = new Date(year, month, d);
                updatePanchangData(selectedDate);
                renderCalendar();
            });
            
            calendarDays.appendChild(dayEl);
        }
    }

    // 🕉️ 2. Data Update (Object Mapping Fixed)
    window.updatePanchangData = function(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dStr = `${year}-${month}-${day}`;
        
        const data = (window.PANCHANG_DATA_2026_02 && window.PANCHANG_DATA_2026_02[dStr]) ? window.PANCHANG_DATA_2026_02[dStr] : null;
        const event = (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[dStr]) ? window.YEARLY_EVENTS_2026[dStr] : null;
        const trans = window.translations[currentLang];

        // 1. Ribbon & Event Area
        const ribText = document.getElementById('ribbon-text');
        const eventArea = document.getElementById('event-display-area');

        if (event) {
            ribText.innerText = event[currentLang] || event.hi;
            if(eventArea) {
                eventArea.innerHTML = `
                    <div class="p-card" style="width:100%; text-align:left; padding:20px; border-left:4px solid var(--gold);">
                        <h3 style="color:var(--gold); font-family:'Cinzel';">${event[currentLang]}</h3>
                        <p style="margin-top:10px; font-size:14px; color:#ccc; line-height:1.6;">${event['desc_' + currentLang] || ''}</p>
                    </div>`;
            }
        } else {
            ribText.innerText = trans['pan_ribbon_loading'] || "Jai Bhole";
            if(eventArea) eventArea.innerHTML = `<p style="text-align:center; color:#666; font-size:12px;">No specific festival today.</p>`;
        }
        
        // 2. Main Grid Mapping (Undefined Fix)
        if (data) {
            // Mapping exactly what's in db-2026-02.js
            setVal('pan-tithi', trans[data.tithi] || data.tithi);
            setVal('pan-nak', trans[data.nakshatra] || data.nakshatra);
            setVal('pan-paksha', trans[data.paksha] || data.paksha);
            setVal('pan-sun', `${data.sunrise} / ${data.sunset}`);
            setVal('pan-moon', data.moonrise || "--:--");
            setVal('pan-muh', data.muhurat || "---");
            setVal('pan-yoga', trans[data.yoga] || data.yoga || "---");
            setVal('pan-karana', trans[data.karana] || data.karana || "---");
            setVal('pan-rahu', data.rahu_kaal || "---");

            // 3. Chaughadia Tables
            renderChaug(data.chaughadia.day, 'day-chaug-body');
            renderChaug(data.chaughadia.night, 'night-chaug-body');
        }
    };

    // Helper functions to prevent errors
    function setVal(id, val) {
        const el = document.getElementById(id);
        if(el) el.innerText = val;
    }

    function renderChaug(list, bodyId) {
        const body = document.getElementById(bodyId);
        if(!body || !list) return;
        body.innerHTML = list.map(item => `
            <tr>
                <td style="font-size:11px;">${item.time}</td>
                <td style="color:var(--gold); font-weight:600;">${window.translations[currentLang][item.name] || item.name}</td>
                <td class="nature-${item.nature}">${window.translations[currentLang][item.status] || item.status}</td>
            </tr>
        `).join('');
    }

    // Tab switcher stays same
    window.showChaug = function(type) {
        document.getElementById('day-chaug').style.display = type === 'day' ? 'block' : 'none';
        document.getElementById('night-chaug').style.display = type === 'night' ? 'block' : 'none';
        document.getElementById('btn-day').classList.toggle('active', type === 'day');
        document.getElementById('btn-night').classList.toggle('active', type === 'night');
    };

    // Nav Fix
    document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
    updatePanchangData(selectedDate);
});

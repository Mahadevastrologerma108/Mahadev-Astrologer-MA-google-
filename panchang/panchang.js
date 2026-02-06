document.addEventListener('DOMContentLoaded', () => {

  let currentDate = new Date();
  let selectedDate = new Date();

  const fmt = d => d.toISOString().split('T')[0];

  /* =========================
     📅 CALENDAR RENDER
  ========================== */
  function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    calendarDays.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthDisplay.innerText = currentDate.toLocaleString('default', {
      month: 'long', year: 'numeric'
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendarDays.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const el = document.createElement('div');
      el.className = 'calendar-day';
      el.innerText = day;

      const dateObj = new Date(year, month, day);
      const key = fmt(dateObj);

      if (key === fmt(new Date())) el.classList.add('today');
      if (key === fmt(selectedDate)) el.classList.add('active');
      if (window.EVENTS_2026[key]) el.classList.add('has-event');

      el.onclick = () => {
        selectedDate = dateObj;
        updatePanchang(dateObj);
        renderCalendar();
        window.scrollTo({ top: 80, behavior: 'smooth' });
      };

      calendarDays.appendChild(el);
    }
  }

  /* =========================
     🕉️ PANCHANG + EVENTS
  ========================== */
  function updatePanchang(date) {
    const key = fmt(date);
    const pan = window.PANCHANG_DB[key];
    const events = window.EVENTS_2026[key];

    // Ribbon
    document.getElementById('ribbon-text').innerText =
      events ? events.map(e => e.title).join(', ')
             : 'Aaj koi vishesh tyohaar nahi';

    // Detailed Events Section
    const eventBox = document.getElementById('event-display-area');
    eventBox.innerHTML = '';

    if (events) {
      events.forEach(e => {
        eventBox.innerHTML += `
          <div class="event-item">
            🪔 <strong>${e.title}</strong>
          </div>`;
      });
    } else {
      eventBox.innerHTML = '<p>No events for this date.</p>';
    }

    if (!pan) return;

    set('tithi', pan.tithi);
    set('nak', pan.nakshatra);
    set('yoga', pan.yoga);
    set('karana', pan.karana);
    set('paksha', pan.paksha);
    set('sun', pan.sunrise + ' / ' + pan.sunset);
    set('moon', pan.moonrise);
    set('muh', pan.abhijit);
    set('rahu', pan.rahu);

    fillChaug('day', pan.chaughadia.day);
    fillChaug('night', pan.chaughadia.night);

    if (window.updateUI) updateUI();
  }

  const set = (id, val) =>
    document.getElementById('pan-' + id).innerText = val;

  /* =========================
     🌞🌙 CHAUGHADIA
  ========================== */
  function fillChaug(type, data) {
    const body = document.getElementById(type + '-chaug-body');
    body.innerHTML = '';
    data.forEach(c => {
      body.innerHTML += `
        <tr>
          <td>${c.time}</td>
          <td>${c.name}</td>
          <td class="${c.nature === 'Good' ? 'nature-shubh' : 'nature-ashubh'}">
            ${c.nature}
          </td>
        </tr>`;
    });
  }

  window.showChaug = type => {
    ['day','night'].forEach(t => {
      document.getElementById(t + '-chaug').style.display = 'none';
      document.getElementById('btn-' + t).classList.remove('active');
    });
    document.getElementById(type + '-chaug').style.display = 'block';
    document.getElementById('btn-' + type).classList.add('active');
  };

  /* =========================
     ⏮️ ⏭️ NAVIGATION
  ========================== */
  document.getElementById('prevMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };

  document.getElementById('nextMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

  renderCalendar();
  updatePanchang(selectedDate);
});

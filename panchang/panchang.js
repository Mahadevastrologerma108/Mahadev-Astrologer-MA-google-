document.addEventListener('DOMContentLoaded', () => {

  let currentDate = new Date();
  let selectedDate = new Date();

  const format = d => d.toISOString().split('T')[0];

  function updatePanchang(date) {
    const key = format(date);
    const pan = PANCHANG_DB[key];
    const ev = EVENTS_2026[key];

    document.getElementById('ribbon-text').innerText =
      ev ? ev.map(e => e.title).join(', ') : 'Aaj koi vishesh tyohaar nahi';

    if (!pan) return;

    panMap('tithi', pan.tithi);
    panMap('nak', pan.nakshatra);
    panMap('yoga', pan.yoga);
    panMap('karana', pan.karana);
    panMap('paksha', pan.paksha);
    panMap('sun', pan.sunrise + ' / ' + pan.sunset);
    panMap('moon', pan.moonrise);
    panMap('muh', pan.abhijit);
    panMap('rahu', pan.rahu);

    fillChaug('day', pan.chaughadia.day);
    fillChaug('night', pan.chaughadia.night);
  }

  const panMap = (id, val) =>
    document.getElementById('pan-' + id).innerText = val;

  function fillChaug(type, data) {
    const body = document.getElementById(type + '-chaug-body');
    body.innerHTML = '';
    data.forEach(c => {
      body.innerHTML += `<tr><td>${c.time}</td><td>${c.name}</td><td>${c.nature}</td></tr>`;
    });
  }

  window.showChaug = type => {
    document.getElementById('day-chaug').classList.add('hidden');
    document.getElementById('night-chaug').classList.add('hidden');
    document.getElementById(type + '-chaug').classList.remove('hidden');
    document.getElementById('btn-day').classList.remove('active');
    document.getElementById('btn-night').classList.remove('active');
    document.getElementById('btn-' + type).classList.add('active');
  };

  function renderCalendar() {
    const box = document.getElementById('calendarDays');
    const month = document.getElementById('monthDisplay');
    box.innerHTML = '';

    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    month.innerText = currentDate.toLocaleString('default',{month:'long',year:'numeric'});

    const days = new Date(y, m + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
      const d = new Date(y, m, i);
      const el = document.createElement('div');
      el.innerText = i;

      const key = format(d);
      if (key === format(new Date())) el.classList.add('today');
      if (EVENTS_2026[key]) el.classList.add('event');

      el.onclick = () => {
        selectedDate = d;
        updatePanchang(d);
        renderCalendar();
      };

      box.appendChild(el);
    }
  }

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

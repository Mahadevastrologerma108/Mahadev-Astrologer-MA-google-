let curYear = 2026;
let curMonth = new Date().getMonth();

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Fill Today's Data
    const d = window.panchangData && window.panchangData[today];
    if (d) {
        document.getElementById('pan-tithi').innerText = d.tithi;
        document.getElementById('pan-nak').innerText = d.nakshatra;
        document.getElementById('pan-sun').innerText = d.sunrise + " / " + d.sunset;
        document.getElementById('pan-muh').innerText = d.muhurat || '--';
        document.getElementById('pan-rahu').innerText = d.rahuKaal;
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia;
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia;
    }

    // 2. Render Calendar
    renderCalendar(lang);
}

function renderCalendar(lang) {
    const grid = document.getElementById('calendar-grid');
    const mLabel = document.getElementById('month-name');
    if(!grid) return;

    const months = {
        hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
        en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    };

    mLabel.innerText = `${months[lang][curMonth]} ${curYear}`;
    grid.innerHTML = ""; 

    // Add Day Headers
    const days = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    days.forEach(day => {
        grid.innerHTML += `<div class="day-header" style="color:#ffd700; font-weight:bold;">${day}</div>`;
    });

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

    // Empty slots
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    // Month Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = (new Date().toISOString().split('T')[0] === dateKey) ? 'today' : '';
        grid.innerHTML += `<div class="calendar-day ${isToday}" onclick="window.viewDay('${dateKey}')">${d}</div>`;
    }
}

window.changeMonth = (dir) => {
    curMonth += dir;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    else if (curMonth < 0) { curMonth = 11; curYear--; }
    initPanchang();
};

window.viewDay = (dateKey) => {
    const d = window.panchangData[dateKey];
    if(d) {
        document.getElementById('pan-tithi').innerText = d.tithi;
        document.getElementById('pan-nak').innerText = d.nakshatra;
        document.getElementById('pan-sun').innerText = d.sunrise + " / " + d.sunset;
        document.getElementById('pan-rahu').innerText = d.rahuKaal;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Start
window.onload = initPanchang;
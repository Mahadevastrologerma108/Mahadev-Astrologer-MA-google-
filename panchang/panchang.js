let curYear = 2026;
let curMonth = new Date().getMonth();

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    updateView(todayStr, lang);
    renderCalendar(lang);
}

window.addEventListener('storage', (e) => {
    if (e.key === 'selectedLang') initPanchang();
});

function updateView(dateKey, lang) {
    const d = window.panchangData ? window.panchangData[dateKey] : null;
    const events = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};

    const fields = {
        'pan-tithi': d?.tithi,
        'pan-nak': d?.nakshatra,
        'pan-yoga': d?.yoga,
        'pan-karana': d?.karana,
        'pan-paksha': d?.paksha,
        'pan-sun': (d?.sunrise && d?.sunset) ? `${d.sunrise} / ${d.sunset}` : null,
        'pan-moon': d?.moonrise,
        'pan-muh': d?.muhurat,
        'pan-rahu': d?.rahuKaal,
        'day-chaughadia': d?.dayChaughadia,
        'night-chaughadia': d?.nightChaughadia
    };

    for (let id in fields) {
        const el = document.getElementById(id);
        if (el) el.innerText = fields[id] || "--";
    }

    document.getElementById('display-date').innerText = (lang === 'hi' ? "पंचांग: " : "Panchang: ") + dateKey;
    
    const fBox = document.getElementById('fest-box');
    if (fBox) {
        fBox.style.display = events[dateKey] ? "block" : "none";
        document.getElementById('today-fest').innerText = events[dateKey] || "";
    }
}

function renderCalendar(lang) {
    const grid = document.getElementById('calendar-grid');
    const mLabel = document.getElementById('month-name');
    const eList = document.getElementById('event-list');
    const events = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};
    const months = {
        hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
        en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    };

    mLabel.innerText = `${months[lang][curMonth]} ${curYear}`;
    grid.innerHTML = ""; 
    const days = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    days.forEach(day => grid.innerHTML += `<div class="day-header">${day}</div>`);

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    let eventHtml = "";
    const prefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${prefix}-${String(d).padStart(2, '0')}`;
        const hasEv = events[dStr] ? 'has-event' : '';
        const isToday = (new Date().toISOString().split('T')[0] === dStr) ? 'today' : '';
        
        // CSS matching structure: Number + Event Indicator
        grid.innerHTML += `
            <div class="calendar-day ${hasEv} ${isToday}" onclick="updateView('${dStr}', '${lang}')">
                <span>${d}</span>
            </div>`;
        
        if (events[dStr]) {
            eventHtml += `<li><span class="gold-text">${d} ${months[lang][curMonth].substring(0,3)}:</span> <span>${events[dStr]}</span></li>`;
        }
    }
    if (eList) eList.innerHTML = eventHtml || "<li>No events this month</li>";
}

window.changeMonth = (dir) => {
    curMonth += dir;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    else if (curMonth < 0) { curMonth = 11; curYear--; }
    renderCalendar(localStorage.getItem('selectedLang') || 'hi');
};

window.onload = initPanchang;
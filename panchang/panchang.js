/** 🔱 MAHADEV ASTROLOGER MA - ULTIMATE STABLE ENGINE 🔱 **/

let curYear = 2026;
let curMonth = new Date().getMonth();

// 🚩 1. DATA CHECKER (Wait for files)
function startEngine() {
    if (window.panchangData && window.MasterEvents) {
        initUI();
    } else {
        setTimeout(startEngine, 500); 
    }
}

// 🚩 2. INITIALIZE UI
function initUI() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const events = window.MasterEvents[lang] || {};

    renderDetails(lang, events);
    renderCalendar(lang, events);
    
    // Translation for Labels (data-key)
    if(window.translations && window.translations[lang]) {
        const t = window.translations[lang];
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if(t[key]) el.innerText = t[key];
        });
    }
}

// 🚩 3. RENDER PANCHANG & CHAUGHADIA
function renderDetails(lang, events, forcedDate = null) {
    const now = new Date();
    const todayStr = forcedDate || `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const d = window.panchangData[todayStr];

    const fill = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val || "--"; };

    if (d) {
        fill('pan-tithi', d.tithi);
        fill('pan-nak', d.nakshatra);
        fill('pan-sun', d.sunrise + " / " + d.sunset);
        fill('pan-muh', d.muhurat);
        fill('pan-rahu', d.rahuKaal);
        fill('day-chaughadia', d.dayChaughadia);
        fill('night-chaughadia', d.nightChaughadia);
        fill('display-date', todayStr); // Optional: sets title to current date
    }

    const fBox = document.getElementById('fest-box');
    if(fBox) {
        if(events[todayStr]) {
            fBox.style.display = "block";
            document.getElementById('today-fest').innerText = events[todayStr];
        } else {
            fBox.style.display = "none";
        }
    }
}

// 🚩 4. RENDER CALENDAR GRID
function renderCalendar(lang, events) {
    const grid = document.getElementById('calendar-grid');
    const mLabel = document.getElementById('month-name');
    const eList = document.getElementById('event-list');
    if(!grid) return;

    const months = {
        hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
        en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    };

    mLabel.innerText = months[lang][curMonth] + " " + curYear;
    let html = "";
    const days = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    days.forEach(d => html += `<div class="day-header" style="color:#ffd700; font-weight:bold;">${d}</div>`);

    const first = new Date(curYear, curMonth, 1).getDay();
    const count = new Date(curYear, curMonth + 1, 0).getDate();
    const isoToday = new Date().toISOString().split('T')[0];

    for(let i=0; i<first; i++) html += `<div></div>`;

    for(let d=1; d<=count; d++) {
        const dk = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasE = events[dk] ? 'has-event' : '';
        const isT = (isoToday === dk) ? 'today' : '';
        html += `<div class="calendar-day ${hasE} ${isT}" onclick="window.viewDay('${dk}')">${d}</div>`;
    }
    grid.innerHTML = html;

    // Monthly List
    let eHtml = "";
    const prefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;
    Object.keys(events).sort().forEach(k => {
        if(k.startsWith(prefix)) eHtml += `<li><b style="color:#ffd700;">${k.split('-')[2]}:</b> ${events[k]}</li>`;
    });
    if(eList) eList.innerHTML = eHtml || "<li>No major events</li>";
}

// 🚩 5. HELPERS
window.viewDay = (dateKey) => {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    renderDetails(lang, window.MasterEvents[lang] || {}, dateKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.changeMonth = (step) => {
    curMonth += step;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    initUI();
};

startEngine();
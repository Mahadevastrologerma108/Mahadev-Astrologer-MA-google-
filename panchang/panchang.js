/** 🔱 MAHADEV ASTROLOGER MA - FINAL STABLE ENGINE 2026 🔱 **/

let curYear = 2026;
let curMonth = new Date().getMonth();

const monthsMap = {
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
};

// 🚩 1. STARTUP: Wait for Data files to load
function startAstroEngine() {
    if (window.panchangData && window.MasterEvents) {
        initPanchang();
    } else {
        setTimeout(startAstroEngine, 100); // Retry every 100ms
    }
}

// 🚩 2. CORE INITIALIZATION
window.initPanchang = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const events = window.MasterEvents[lang] || {};

    renderDaily(lang, events);
    renderCalendar(lang, events);
    
    // Auto-Translate everything with 'data-key'
    applyMyTranslations(lang);
};

// 🚩 3. DAILY PANCHANG & CHAUGHADIA
function renderDaily(lang, events, forcedDate = null) {
    const now = new Date();
    const todayStr = forcedDate || `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const d = window.panchangData[todayStr];

    const fill = (id, val) => { 
        const el = document.getElementById(id);
        if(el) el.innerText = val || "--"; 
    };

    if (d) {
        fill('pan-tithi', d.tithi);
        fill('pan-nak', d.nakshatra);
        fill('pan-sun', `${d.sunrise} / ${d.sunset}`);
        fill('pan-muh', d.muhurat);
        fill('pan-rahu', d.rahuKaal);
        fill('day-chaughadia', d.dayChaughadia);
        fill('night-chaughadia', d.nightChaughadia);
    }

    // Festival Alert Box
    const fBox = document.getElementById('fest-box');
    const fText = document.getElementById('today-fest');
    if(fBox && fText) {
        if(events[todayStr]) {
            fBox.style.display = "block";
            fText.innerText = events[todayStr];
        } else {
            fBox.style.display = "none";
        }
    }
}

// 🚩 4. CALENDAR GRID & MONTHLY LIST
function renderCalendar(lang, events) {
    const grid = document.getElementById('calendar-grid');
    const mLabel = document.getElementById('month-name');
    const eList = document.getElementById('event-list');
    if(!grid) return;

    mLabel.innerText = `${monthsMap[lang][curMonth]} ${curYear}`;
    
    let html = "";
    const daysArr = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    daysArr.forEach(d => html += `<div class="day-header">${d}</div>`);

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysCount = new Date(curYear, curMonth + 1, 0).getDate();
    const realToday = new Date().toISOString().split('T')[0];

    for(let i=0; i<firstDay; i++) html += `<div class="empty-day"></div>`;

    for(let d=1; d<=daysCount; d++) {
        const dKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEv = events[dKey] ? 'has-event' : '';
        const isTd = (realToday === dKey) ? 'today' : '';
        html += `<div class="calendar-day ${hasEv} ${isTd}" onclick="viewDay('${dKey}')">${d}</div>`;
    }
    grid.innerHTML = html;

    // Sidebar Events
    let eventHtml = "";
    const prefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;
    Object.keys(events).sort().forEach(k => {
        if(k.startsWith(prefix)) {
            eventHtml += `<li><span class="gold-text">${k.split('-')[2]}:</span> ${events[k]}</li>`;
        }
    });
    if(eList) eList.innerHTML = eventHtml || `<li>No festivals this month</li>`;
}

// 🚩 5. INTERACTIVE FUNCTIONS
window.viewDay = (dateKey) => {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    renderDaily(lang, window.MasterEvents[lang] || {}, dateKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.changeMonth = (step) => {
    curMonth += step;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    initPanchang();
};

// 🚩 6. TRANSLATION HELPER (Fixes data-key issues)
function applyMyTranslations(lang) {
    if(!window.translations || !window.translations[lang]) return;
    const t = window.translations[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(t[key]) el.innerText = t[key];
    });
}

// Launch!
startAstroEngine();
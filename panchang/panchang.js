/** * 🔱 MAHADEV ASTROLOGER MA - MASTER PANCHANG ENGINE 2026 
 * Final Neat & Clean Version
 */

// ==========================================
// 🚩 SECTION 1: CONFIGURATION & STATE
// ==========================================
let curYear = 2026;
let curMonth = new Date().getMonth();

const monthsMap = {
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
};

// ==========================================
// 🚩 SECTION 2: CORE INITIALIZATION
// ==========================================
window.initPanchang = window.updatePanchangLanguage = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    
    // 1. Get Data Sources
    const festivalSource = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};
    const dailyDataSource = window.panchangData || {};

    // 2. Trigger UI Updates
    renderCalendarGrid(lang, festivalSource);
    renderEventSidebar(lang, festivalSource);
    renderDailyDetails(lang, dailyDataSource, festivalSource);
};

// ==========================================
// 🚩 SECTION 3: CALENDAR GENERATOR
// ==========================================
function renderCalendarGrid(lang, events) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // Header (Days Name)
    const daysArr = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    daysArr.forEach(day => grid.innerHTML += `<div class="day-header">${day}</div>`);

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

    // Padding for empty days
    for(let i=0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    // Actual Days
    const todayISO = new Date().toISOString().split('T')[0];
    for(let d=1; d <= daysInMonth; d++) {
        const dKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = events[dKey] ? 'has-event' : '';
        const isToday = (todayISO === dKey) ? 'today' : '';
        
        grid.innerHTML += `<div class="calendar-day ${hasEvent} ${isToday}">${d}</div>`;
    }
}

// ==========================================
// 🚩 SECTION 4: SIDEBAR EVENTS LIST
// ==========================================
function renderEventSidebar(lang, events) {
    const monthTitle = document.getElementById('month-name');
    const eventList = document.getElementById('event-list');
    if(monthTitle) monthTitle.innerText = `${monthsMap[lang][curMonth]} ${curYear}`;
    if(!eventList) return;

    eventList.innerHTML = "";
    let found = false;
    const monthKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;

    Object.keys(events).sort().forEach(key => {
        if(key.startsWith(monthKey)) {
            found = true;
            const dayPart = key.split('-')[2];
            eventList.innerHTML += `<li><span class="gold-text"><strong>${dayPart}:</strong></span> ${events[key]}</li>`;
        }
    });

    if(!found) {
        eventList.innerHTML = `<li>${lang === 'en' ? 'No major festivals.' : 'कोई मुख्य त्योहार नहीं।'}</li>`;
    }
}

// ==========================================
// 🚩 SECTION 5: DAILY PANCHANG DETAILS
// ==========================================
function renderDailyDetails(lang, dailyData, events) {
    const now = new Date();
    const todayStr = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const d = dailyData[todayStr];

    if (d) {
        const updateText = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val || "--"; };
        
        updateText('pan-tithi', d.tithi);
        updateText('pan-nak', d.nakshatra);
        updateText('pan-sun', `${d.sunrise} / ${d.sunset}`);
        updateText('pan-muh', d.muhurat);
        updateText('pan-rahu', d.rahuKaal);

        // Today's Festival Highlight
        const festBox = document.getElementById('fest-box');
        if(festBox) {
            if(events[todayStr]) {
                festBox.style.display = "block";
                document.getElementById('today-fest').innerText = events[todayStr];
            } else {
                festBox.style.display = "none";
            }
        }
    }
}

// ==========================================
// 🚩 SECTION 6: NAVIGATION & AUTO-LOAD
// ==========================================
window.changeMonth = function(step) {
    curMonth += step;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    window.initPanchang();
};

document.addEventListener('DOMContentLoaded', () => {
    // 100ms ka delay taaki sare global variables (MasterEvents etc) window par register ho jayein
    setTimeout(() => {
        window.initPanchang();
    }, 100);
});
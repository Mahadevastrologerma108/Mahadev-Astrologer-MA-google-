/** 🔱 MAHADEV ASTROLOGER MA - CONTENT RESTORE MODE **/

let curYear = 2026;
let curMonth = new Date().getMonth();

// 🚩 1. Sabse Simple Data Checker
function loadPanchangNow() {
    // Agar data files load ho gayi hain
    if (window.panchangData) {
        console.log("Data mil gaya! Content wapas la raha hoon...");
        renderEverything();
    } else {
        // Agar nahi mili, toh har aadhe second mein check karega
        console.log("Data dhoond raha hoon...");
        setTimeout(loadPanchangNow, 500);
    }
}

// 🚩 2. Content Bharne Wala Main Function
function renderEverything() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const now = new Date();
    const todayStr = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Data nikalna
    const d = window.panchangData[todayStr];
    const events = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};

    // --- Daily Panchang Sections ---
    const fill = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "--";
    };

    if (d) {
        fill('pan-tithi', d.tithi);
        fill('pan-nak', d.nakshatra);
        fill('pan-sun', d.sunrise + " / " + d.sunset);
        fill('pan-muh', d.muhurat);
        fill('pan-rahu', d.rahuKaal);
        fill('day-chaughadia', d.dayChaughadia);
        fill('night-chaughadia', d.nightChaughadia);
    }

    // --- Festival Alert Box ---
    const festBox = document.getElementById('fest-box');
    if (festBox) {
        if (events[todayStr]) {
            festBox.style.display = "block";
            const festText = document.getElementById('today-fest');
            if (festText) festText.innerText = events[todayStr];
        } else {
            festBox.style.display = "none";
        }
    }

    // --- Calendar Render ---
    renderCalendarGrid(lang, events);
}

// 🚩 3. Calendar Grid (Taarikh aur Month)
function renderCalendarGrid(lang, events) {
    const grid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('month-name');
    if (!grid || !monthTitle) return;

    const mNames = {
        hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
        en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    };

    monthTitle.innerText = mNames[lang][curMonth] + " " + curYear;

    let html = "";
    const daysArr = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    daysArr.forEach(day => html += `<div class="day-header" style="color:#ffd700; font-weight:bold; padding:10px;">${day}</div>`);

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();
    const todayISO = new Date().toISOString().split('T')[0];

    for (let i = 0; i < firstDay; i++) html += `<div></div>`;

    for (let d = 1; d <= totalDays; d++) {
        const dKey = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = (todayISO === dKey) ? 'today' : '';
        const hasEvent = events[dKey] ? 'has-event' : '';
        
        // Custom style for dots/events
        const eventStyle = hasEvent ? "border-bottom: 2px solid #ffd700;" : "";
        const todayStyle = isToday ? "background:#ffd700; color:#000; font-weight:bold;" : "";

        html += `<div class="calendar-day" style="padding:15px; cursor:pointer; border-radius:5px; ${eventStyle} ${todayStyle}" onclick="window.viewSpecificDay('${dKey}')">${d}</div>`;
    }
    grid.innerHTML = html;
}

// 🚩 4. Interaction Functions
window.viewSpecificDay = function(dateKey) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const events = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};
    
    // Sirf Panchang wala hissa update karo
    const d = window.panchangData[dateKey];
    if (d) {
        const fill = (id, val) => { if (document.getElementById(id)) document.getElementById(id).innerText = val || "--"; };
        fill('pan-tithi', d.tithi);
        fill('pan-nak', d.nakshatra);
        fill('pan-sun', d.sunrise + " / " + d.sunset);
        fill('pan-muh', d.muhurat);
        fill('pan-rahu', d.rahuKaal);
        fill('day-chaughadia', d.dayChaughadia);
        fill('night-chaughadia', d.nightChaughadia);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.changeMonth = function(step) {
    curMonth += step;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    else if (curMonth < 0) { curMonth = 11; curYear--; }
    renderEverything();
};

// Engine Start!
loadPanchangNow();
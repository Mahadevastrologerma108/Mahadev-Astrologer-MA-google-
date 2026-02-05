/**
 * 🔱 Mahadev Astrologer MA - Diagnostic Engine
 * Isme Data Detection aur Error Reporting inbuilt hai.
 */

let curYear = 2026;
let curMonth = new Date().getMonth();

const monthsMap = {
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("🔱 Engine Started: Checking Assets...");
    
    // Check if data sources are available in global window object
    console.log("Panchang Technical Data:", window.panchangData ? "✅ Found" : "❌ MISSING (Check panchang-data.js)");
    console.log("Hindi Events:", window.hindiEventsData ? "✅ Found" : "❌ MISSING (Check calendar-events.js)");
    console.log("English Events:", window.englishEventsData ? "✅ Found" : "❌ MISSING (Check events-lang.js)");

    // Delay to allow layout.js and other assets to settle
    setTimeout(initPanchang, 250);
});

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    
    // Current Date logic for 2026
    const now = new Date();
    const todayStr = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    console.log("🔱 Rendering for Date:", todayStr, "| Language:", lang);

    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
    
    // Command Translation Engine
    if(window.translatePage) {
        window.translatePage(lang);
    }
}

function updateDaily(dateKey, lang) {
    const pData = window.panchangData || {};
    const eSource = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});

    const d = pData[dateKey];
    if (d) {
        // IDs must match exactly with HTML
        const safeSet = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val || "--";
        };

        safeSet('pan-tithi', d.tithi);
        safeSet('pan-nak', d.nakshatra);
        safeSet('pan-sun', `${d.sunrise} / ${d.sunset}`);
        safeSet('pan-muh', d.muhurat);
        safeSet('pan-rahu', d.rahuKaal);
        safeSet('day-chaughadia', d.dayChaughadia);
        safeSet('night-chaughadia', d.nightChaughadia);

        // Festival Banner logic
        const box = document.getElementById('fest-box');
        const festTxt = document.getElementById('today-fest');
        if(box && festTxt && eSource[dateKey]) {
            box.style.display = "block";
            festTxt.innerText = eSource[dateKey];
        } else if(box) {
            box.style.display = "none";
        }
    } else {
        console.error("⚠️ Data Error: No technical data found for date", dateKey, "in panchang-data.js");
    }
}

function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    const days = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    days.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    const eSource = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    const start = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();

    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d<=totalDays; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && eSource[dateKey]) ? 'has-event' : '';
        const isToday = (new Date().toISOString().split('T')[0] === dateKey) ? 'today' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent} ${isToday}" onclick="selectDate('${dateKey}')">${d}</div>`;
    }
}

function updateEvents(lang) {
    const monthEl = document.getElementById('month-name');
    if(monthEl) monthEl.innerText = `${monthsMap[lang][curMonth]} ${curYear}`;
    
    const list = document.getElementById('event-list');
    if(!list) return;
    list.innerHTML = "";
    
    const eSource = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    let found = false;

    Object.keys(eSource).forEach(k => {
        const p = k.split('-');
        if(parseInt(p[1]) === (curMonth + 1) && parseInt(p[0]) === curYear) {
            found = true;
            list.innerHTML += `<li><span class="gold-text"><strong>${p[2]}:</strong></span> ${eSource[k]}</li>`;
        }
    });

    if(!found) list.innerHTML = `<li>${lang === 'en' ? 'No major festivals.' : 'कोई मुख्य त्योहार नहीं।'}</li>`;
}

// User interaction: Click date to see that day's Panchang
function selectDate(dateKey) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    updateDaily(dateKey, lang);
    // Scroll to top to see data
    window.scrollTo({top: 100, behavior: 'smooth'});
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    initPanchang();
}
let curYear = 2026;
let curMonth = new Date().getMonth();

const monthsMap = {
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
};

// 🔱 Ye function header ke switch ke saath connect hoga
window.updatePanchangLanguage = function(lang) {
    console.log("Switching Panchang Language to:", lang);
    const todayStr = `2026-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    
    // Sab kuch refresh karo nayi bhasha mein
    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
    
    if(window.translatePage) window.translatePage(lang);
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const lang = localStorage.getItem('selectedLang') || 'hi';
        window.updatePanchangLanguage(lang);
    }, 300);
});

function updateDaily(dateKey, lang) {
    const pData = window.panchangData || {};
    // Language ke basis par event source chuno
    const eSource = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    const d = pData[dateKey];

    if (d) {
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || "--";
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || "--";

        const box = document.getElementById('fest-box');
        if(box && eSource[dateKey]) {
            box.style.display = "block";
            document.getElementById('today-fest').innerText = eSource[dateKey];
        } else if(box) { box.style.display = "none"; }
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
        grid.innerHTML += `<div class="calendar-day ${hasEvent} ${isToday}">${d}</div>`;
    }
}

function updateEvents(lang) {
    // Month name translation fix
    document.getElementById('month-name').innerText = `${monthsMap[lang][curMonth]} ${curYear}`;
    
    const list = document.getElementById('event-list');
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

    if(!found) {
        list.innerHTML = `<li>${lang === 'en' ? 'No major festivals.' : 'कोई मुख्य त्योहार नहीं।'}</li>`;
    }
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    window.updatePanchangLanguage(localStorage.getItem('selectedLang') || 'hi');
}
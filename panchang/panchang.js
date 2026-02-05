const langMap = {
    hi: {
        months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        days: ['र','सो','मं','बु','गु','शु','श'],
        noEvent: "कोई त्योहार नहीं।"
    },
    en: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        noEvent: "No major festivals."
    }
};

let curYear = 2026;
let curMonth = new Date().getMonth();

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
});

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";

    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

function updateDaily(dateKey, lang) {
    const pData = window.panchangData || {};
    const eData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});

    if (pData[dateKey]) {
        const d = pData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || "--";
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || "--";

        const box = document.getElementById('fest-box');
        const txt = document.getElementById('today-fest');
        if(box && eData[dateKey]) {
            box.style.display = "block";
            txt.innerText = eData[dateKey];
        } else { box.style.display = "none"; }
    }
}

function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    langMap[lang].days.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    const eData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && eData[dateKey]) ? 'has-event' : '';
        const isToday = (new Date().toISOString().split('T')[0] === dateKey) ? 'today' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent} ${isToday}">${d}</div>`;
    }
}

function updateEvents(lang) {
    document.getElementById('month-name').innerText = `${langMap[lang].months[curMonth]} ${curYear}`;
    const list = document.getElementById('event-list');
    list.innerHTML = "";

    const eData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    let found = false;

    Object.keys(eData).forEach(k => {
        const dObj = new Date(k);
        if(dObj.getMonth() === curMonth && dObj.getFullYear() === curYear) {
            found = true;
            list.innerHTML += `<li><span class="gold-text"><strong>${k.split('-')[2]}:</strong></span> ${eData[k]}</li>`;
        }
    });
    if(!found) list.innerHTML = `<li>${langMap[lang].noEvent}</li>`;
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    initPanchang();
}

window.changeLanguage = function(lang) {
    localStorage.setItem('selectedLang', lang);
    location.reload(); 
};
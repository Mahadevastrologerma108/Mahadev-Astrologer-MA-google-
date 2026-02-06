let curYear = 2026;
let curMonth = new Date().getMonth();

// 🚩 LANGUAGE OBSERVER: Menu se language badalte hi ye function chalega
function listenToLangChange() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'selectedLang') {
            initPanchang();
        }
    });
    
    // Agar aapka translation script custom events use karta hai
    document.addEventListener('languageChanged', () => {
        initPanchang();
    });
}

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const now = new Date();
    // Aaj ki date select karne ke liye
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    updateView(todayStr, lang);
    renderCalendar(lang);
}

function updateView(dateKey, lang) {
    const d = window.panchangData ? window.panchangData[dateKey] : null;
    const events = (window.MasterEvents && window.MasterEvents[lang]) ? window.MasterEvents[lang] : {};

    if (d) {
        // Core Details
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-yoga').innerText = d.yoga || "--";
        document.getElementById('pan-karana').innerText = d.karana || "--";
        document.getElementById('pan-paksha').innerText = d.paksha || "--";
        
        // Timings
        document.getElementById('pan-sun').innerText = (d.sunrise && d.sunset) ? `${d.sunrise} / ${d.sunset}` : "--";
        document.getElementById('pan-moon').innerText = d.moonrise || "--";
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";
        
        // Chaughadia
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || "--";
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || "--";
        
        // Header Date Update
        const dateHead = lang === 'hi' ? "पंचांग: " : "Panchang: ";
        document.getElementById('display-date').innerText = dateHead + dateKey;

        // Festival Box
        const fBox = document.getElementById('fest-box');
        if (fBox) {
            if (events[dateKey]) {
                fBox.style.display = "block";
                document.getElementById('today-fest').innerText = events[dateKey];
            } else {
                fBox.style.display = "none";
            }
        }
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

    // Day Headers
    const days = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    days.forEach(day => grid.innerHTML += `<div class="day-header" style="color:#ffd700; font-weight:bold; text-align:center;">${day}</div>`);

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    let eventHtml = "";
    const prefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${prefix}-${String(d).padStart(2, '0')}`;
        const hasEv = events[dStr] ? 'has-event' : '';
        const isToday = (new Date().toISOString().split('T')[0] === dStr) ? 'today' : '';
        
        grid.innerHTML += `<div class="calendar-day ${hasEv} ${isToday}" onclick="updateView('${dStr}', '${lang}')">${d}</div>`;
        
        if (events[dStr]) {
            eventHtml += `<li><b class="gold-text">${d} ${months[lang][curMonth].substring(0,3)}:</b> ${events[dStr]}</li>`;
        }
    }
    
    if (eList) {
        eList.innerHTML = eventHtml || (lang === 'hi' ? "<li>कोई त्योहार नहीं</li>" : "<li>No major events</li>");
    }
}

window.changeMonth = (dir) => {
    curMonth += dir;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    else if (curMonth < 0) { curMonth = 11; curYear--; }
    renderCalendar(localStorage.getItem('selectedLang') || 'hi');
};

// Sab kuch start karo
window.onload = () => {
    initPanchang();
    listenToLangChange();
};
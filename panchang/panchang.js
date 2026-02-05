/** * 🔱 MAHADEV ASTROLOGER MA - MASTER PANCHANG ENGINE 2026 🔱
 * Format: Clean, Modular, and Multi-language Compatible
 */

// ==========================================
// 🚩 SECTION 1: GLOBAL SETTINGS & VARIABLES
// ==========================================
let curYear = 2026;
let curMonth = new Date().getMonth();
let lastLang = localStorage.getItem('selectedLang') || 'hi';

const monthsMap = {
    hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
};

// ==========================================
// 🚩 SECTION 2: THE WATCHDOG (AUTO-REFRESH)
// ==========================================
// Ye har 800ms mein check karega ki bhasha badli ya nahi
setInterval(() => {
    let currentLang = localStorage.getItem('selectedLang') || 'hi';
    if (currentLang !== lastLang) {
        lastLang = currentLang;
        // Jab bhasha badle, tab poore UI ko refresh karo
        window.initPanchang();
    }
}, 800);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    window.initPanchang();
});

// ==========================================
// 🚩 SECTION 3: CORE INITIALIZATION
// ==========================================
window.initPanchang = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const now = new Date();
    // Aaj ki date key (YYYY-MM-DD)
    const todayStr = `2026-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    renderCal(curMonth, curYear, lang);
    updateEvents(lang);
    updateDaily(todayStr, lang);
};

// ==========================================
// 🚩 SECTION 4: TODAY'S PANCHANG (DAILY VIEW)
// ==========================================
function updateDaily(dateKey, lang) {
    const pData = window.panchangData || {};
    const master = window.MasterEvents || { hi: {}, en: {} };
    const eSource = master[lang] || {};
    const d = pData[dateKey];

    if (d) {
        const setEl = (id, val) => { if(document.getElementById(id)) document.getElementById(id).innerText = val || "--"; };
        
        setEl('pan-tithi', d.tithi);
        setEl('pan-nak', d.nakshatra);
        setEl('pan-sun', `${d.sunrise} / ${d.sunset}`);
        setEl('pan-muh', d.muhurat);
        setEl('pan-rahu', d.rahuKaal);
        setEl('day-chaughadia', d.dayChaughadia);
        setEl('night-chaughadia', d.nightChaughadia);

        // 🚩 AAJ KA FESTIVAL BOX
        const box = document.getElementById('fest-box');
        if(box) {
            if(eSource[dateKey]) {
                box.style.display = "block";
                document.getElementById('today-fest').innerText = eSource[dateKey];
            } else { 
                box.style.display = "none"; 
            }
        }
    }
}

// ==========================================
// 🚩 SECTION 5: CALENDAR GRID GENERATOR
// ==========================================
function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    const daysArr = (lang === 'en') ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['र','सो','मं','बु','गु','शु','श'];
    daysArr.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);
    
    const master = window.MasterEvents || { hi: {}, en: {} };
    const eSource = master[lang] || {};
    
    const start = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();

    // Khali div pehle ke dino ke liye
    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;
    
    // Tarikhein bharna
    for(let d=1; d<=totalDays; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = eSource[dateKey] ? 'has-event' : '';
        const isToday = (new Date().toISOString().split('T')[0] === dateKey) ? 'today' : '';
        
        grid.innerHTML += `<div class="calendar-day ${hasEvent} ${isToday}">${d}</div>`;
    }
}

// ==========================================
// 🚩 SECTION 6: MONTHLY EVENTS SIDEBAR
// ==========================================
function updateEvents(lang) {
    const mName = document.getElementById('month-name');
    if(mName) mName.innerText = `${monthsMap[lang][curMonth]} ${curYear}`;
    
    const list = document.getElementById('event-list');
    if(!list) return;
    
    list.innerHTML = "";
    const master = window.MasterEvents || { hi: {}, en: {} };
    const eSource = master[lang] || {};
    
    let found = false;
    // Keys ko sort karke list banana
    Object.keys(eSource).sort().forEach(k => {
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

// ==========================================
// 🚩 SECTION 7: NAVIGATION (MONTH CHANGE)
// ==========================================
window.changeMonth = function(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    window.initPanchang();
};
/**
 * Mahadev Astrologer MA - Professional Panchang Engine
 */

const months = {
    hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

const dayHeadersLang = {
    hi: ['र','सो','मं','बु','गु','शु','श'],
    en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};

let curYear = 2026;
let curMonth = new Date().getMonth();

// 🔱 Master Function jo har jagah se call ho sake
window.initPanchang = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";

    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
};

document.addEventListener('DOMContentLoaded', () => {
    window.initPanchang();
    setupMenu();
});

// 🔱 Calendar Grid Logic (Headers: Sun vs रवि)
function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // Headers set karna
    const headers = dayHeadersLang[lang];
    headers.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    // Sahi source check karna
    const sourceData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && sourceData[dateKey]) ? 'has-event' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent}">${d}</div>`;
    }
}

// 🔱 Monthly Events List Update
function updateEvents(lang) {
    const monthList = months[lang];
    const monthNameEl = document.getElementById('month-name');
    if(monthNameEl) monthNameEl.innerText = `${monthList[curMonth]} ${curYear}`;

    const list = document.getElementById('event-list');
    if(!list) return;
    list.innerHTML = "";

    const sourceData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    let found = false;

    Object.keys(sourceData).forEach(k => {
        const dObj = new Date(k);
        if(dObj.getMonth() === curMonth && dObj.getFullYear() === curYear) {
            found = true;
            const dayNum = k.split('-')[2];
            list.innerHTML += `<li><span class="gold-text"><strong>${dayNum}:</strong></span> ${sourceData[k]}</li>`;
        }
    });

    if(!found) {
        list.innerHTML = `<li>${lang === 'en' ? 'No major festivals.' : 'कोई मुख्य त्योहार नहीं।'}</li>`;
    }
}

// 🔱 Daily Panchang Details
function updateDaily(dateKey, lang) {
    const sourceData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});

    if(window.panchangData && window.panchangData[dateKey]) {
        const d = window.panchangData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";

        const box = document.getElementById('fest-box');
        if(sourceData[dateKey]) { 
            box.style.display="block"; 
            document.getElementById('today-fest').innerText = sourceData[dateKey]; 
        } else { box.style.display="none"; }
    }
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    window.initPanchang();
}

function setupMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    if(mobileMenu) {
        mobileMenu.onclick = () => { navDrawer.style.right = "0"; menuOverlay.style.display = "block"; };
    }
    const close = () => { 
        if(navDrawer) navDrawer.style.right = "-100%"; 
        if(menuOverlay) menuOverlay.style.display = "none"; 
    };
    if(document.getElementById('close-menu')) document.getElementById('close-menu').onclick = close;
    if(menuOverlay) menuOverlay.onclick = close;
}
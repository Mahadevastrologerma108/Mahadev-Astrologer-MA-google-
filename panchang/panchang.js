/**
 * Mahadev Astrologer MA - Panchang & Calendar Engine
 * Fully Bilingual Support (HI/EN)
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

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
    setupMenu();
});

// Sidebar/Menu Logic
function setupMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');

    if(mobileMenu) mobileMenu.onclick = () => { 
        navDrawer.style.right = "0"; 
        menuOverlay.style.display = "block"; 
    };
    const close = () => { 
        navDrawer.style.right = "-100%"; 
        menuOverlay.style.display = "none"; 
    };
    if(closeMenu) closeMenu.onclick = close;
    if(menuOverlay) menuOverlay.onclick = close;
}

// Initializing the Page
function initPanchang() {
    const today = new Date();
    const lang = localStorage.getItem('selectedLang') || 'hi';
    
    // Sirf 2026 ka data hai hamare paas
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";
    
    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

// 🔱 Calendar Grid Logic (Headers: Sun vs रवि)
function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // Bridge: Sahi din ke naam uthana
    const headers = dayHeadersLang[lang];
    headers.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    // Sahi source check karna (hindiEventsData vs englishEventsData)
    const sourceData = (lang === 'en') ? englishEventsData : hindiEventsData;

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && typeof sourceData !== 'undefined' && sourceData[dateKey]) ? 'has-event' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent}">${d}</div>`;
    }
}

// 🔱 Monthly Events List (January vs जनवरी)
function updateEvents(lang) {
    const monthList = months[lang];
    document.getElementById('month-name').innerText = `${monthList[curMonth]} ${curYear}`;
    
    const list = document.getElementById('event-list');
    list.innerHTML = "";

    if (curYear !== 2026) {
        const msg = (lang === 'en') ? "2026 Panchang data is available" : "2026 पंचांग गणना उपलब्ध है";
        list.innerHTML = `<div class="consult-box"><p class="gold-text">${msg}</p><a href="../index.html#book" class="consult-link">CONSULT NOW 🔱</a></div>`;
        return;
    }

    const sourceData = (lang === 'en') ? englishEventsData : hindiEventsData;
    let found = false;

    if(typeof sourceData !== 'undefined') {
        Object.keys(sourceData).forEach(k => {
            const eventDate = new Date(k);
            if(eventDate.getMonth() === curMonth) {
                found = true;
                const dayNum = k.split('-')[2];
                list.innerHTML += `<li><span class="gold-text"><strong>${dayNum}:</strong></span> ${sourceData[k]}</li>`;
            }
        });
    }

    if(!found) {
        const noMsg = (lang === 'en') ? "No major festivals this month." : "इस महीने कोई मुख्य त्योहार नहीं है।";
        list.innerHTML = `<li>${noMsg}</li>`;
    }
}

// 🔱 Top Section Update (Daily Details)
function updateDaily(dateKey, lang) {
    const sourceData = (lang === 'en') ? englishEventsData : hindiEventsData;

    if(typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";
        
        // Default values for Chaughadia if missing
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || (lang === 'en' ? "Amrit, Shubh, Labh" : "अमृत, शुभ, लाभ");
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || (lang === 'en' ? "Labh, Amrit, Shubh" : "लाभ, अमृत, शुभ");

        const box = document.getElementById('fest-box');
        if(sourceData[dateKey]) { 
            box.style.display="block"; 
            document.getElementById('today-fest').innerText = sourceData[dateKey]; 
        } else { box.style.display="none"; }
    }
}

// Navigation for Calendar
function changeMonth(s) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}
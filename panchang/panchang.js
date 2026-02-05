/**
 * Mahadev Astrologer MA - Integrated Panchang & Calendar Engine
 * Handles: Calendar Grid, Monthly Events, Daily Panchang & Bilingual Logic
 */

// --- Configuration & Data Maps ---
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
    setupMenu();
});

/**
 * 🔱 MASTER CONTROLLER: Language Switcher
 * Ise aapke HTML buttons call karenge: changeLanguage('en') ya changeLanguage('hi')
 */
function changeLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    
    // Static translations (translations.js) update karne ke liye
    if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }
    
    // UI ko refresh karein
    initPanchang();
}

function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const today = new Date();
    
    // Default to Jan 1st if current date is not in 2026
    const todayStr = (today.getFullYear() === 2026) ? 
                     today.toISOString().split('T')[0] : "2026-01-01";

    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

// --- UI Rendering Functions ---

// 🔱 Calendar Grid (Headers & Dates)
function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // 1. Render Headers (Sun vs रवि)
    const headers = dayHeadersLang[lang];
    headers.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    // 2. Event Bridge: Check which data source to use
    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    // Fill empty slots
    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    // Fill Days
    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && sourceData[dateKey]) ? 'has-event' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent}">${d}</div>`;
    }
}

// 🔱 Monthly Events Sidebar (January vs जनवरी)
function updateEvents(lang) {
    const monthList = months[lang];
    document.getElementById('month-name').innerText = `${monthList[curMonth]} ${curYear}`;

    const list = document.getElementById('event-list');
    if (!list) return;
    list.innerHTML = "";

    // If outside 2026
    if (curYear !== 2026) {
        const msg = (lang === 'en') ? "2026 Panchang data is available" : "2026 पंचांग गणना उपलब्ध है";
        list.innerHTML = `<div class="consult-box"><p class="gold-text">${msg}</p></div>`;
        return;
    }

    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});
    
    let found = false;

    Object.keys(sourceData).forEach(k => {
        const eventDate = new Date(k);
        if(eventDate.getMonth() === curMonth && eventDate.getFullYear() === curYear) {
            found = true;
            const dayNum = k.split('-')[2];
            list.innerHTML += `<li><span class="gold-text"><strong>${dayNum}:</strong></span> ${sourceData[k]}</li>`;
        }
    });

    if(!found) {
        const noMsg = (lang === 'en') ? "No major festivals this month." : "इस महीने कोई मुख्य त्योहार नहीं है।";
        list.innerHTML = `<li>${noMsg}</li>`;
    }
}

// 🔱 Daily Panchang Details
function updateDaily(dateKey, lang) {
    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});

    if(typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        
        // Update Table Fields
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";

        // Chaughadia Labels
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || (lang === 'en' ? "Amrit, Shubh, Labh" : "अमृत, शुभ, लाभ");
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || (lang === 'en' ? "Labh, Amrit, Shubh" : "लाभ, अमृत, शुभ");

        // Top Banner Festival
        const box = document.getElementById('fest-box');
        if(sourceData[dateKey]) { 
            box.style.display="block"; 
            document.getElementById('today-fest').innerText = sourceData[dateKey]; 
        } else { 
            box.style.display="none"; 
        }
    }
}

// --- Helpers ---

function changeMonth(s) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }

    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

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
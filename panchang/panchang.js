/**
 * 🔱 Mahadev Astrologer MA - The Ultimate Bilingual Engine
 * No more lang-engine.js needed. Everything is handled here.
 */

const months = {
    hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

const dayHeadersLang = {
    hi: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

let curYear = 2026;
let curMonth = new Date().getMonth();

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
    setupMenu();
});

// 🔱 1. THE SWITCHER: Ye hi woh master function hai jo sab badlega
function changeLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    document.documentElement.lang = lang;

    // Static labels ke liye (translations.js)
    if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }

    // Poore UI ko naye siray se redraw karna
    initPanchang();
}

// 🔱 2. THE INITIALIZER
function initPanchang() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";

    // Teeno main pillars ko refresh karo
    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

// 🔱 3. CALENDAR RENDERER (Day names aur Dates ke liye)
function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; // Purana grid saaf karo

    // Din ke naam (Sun vs र)
    const headers = dayHeadersLang[lang];
    headers.forEach(d => {
        grid.innerHTML += `<div class="day-header">${d}</div>`;
    });

    // Sahi data source pakadna (English vs Hindi)
    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    // Khali blocks
    for (let i = 0; i < start; i++) grid.innerHTML += `<div></div>`;

    // Tarikh aur Event Indicator (.)
    for (let d = 1; d <= days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && sourceData[dateKey]) ? 'has-event' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent}">${d}</div>`;
    }
}

// 🔱 4. EVENT LIST UPDATER (Month name aur List ke liye)
function updateEvents(lang) {
    const monthList = months[lang];
    const monthDisplay = document.getElementById('month-name');
    if(monthDisplay) {
        monthDisplay.innerText = `${monthList[curMonth]} ${curYear}`;
    }

    const list = document.getElementById('event-list');
    if (!list) return;
    list.innerHTML = "";

    if (curYear !== 2026) {
        const msg = (lang === 'en') ? "2026 Data Available" : "2026 डेटा उपलब्ध है";
        list.innerHTML = `<li class="gold-text">${msg}</li>`;
        return;
    }

    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});
    
    let found = false;
    Object.keys(sourceData).forEach(k => {
        const eventDate = new Date(k);
        if (eventDate.getMonth() === curMonth) {
            found = true;
            const dayNum = k.split('-')[2];
            list.innerHTML += `<li><span class="gold-text"><strong>${dayNum}:</strong></span> ${sourceData[k]}</li>`;
        }
    });

    if (!found) {
        list.innerHTML = `<li>${lang === 'en' ? 'No major festivals.' : 'कोई मुख्य त्योहार नहीं।'}</li>`;
    }
}

// 🔱 5. DAILY PANCHANG (Table data)
function updateDaily(dateKey, lang) {
    const sourceData = (lang === 'en') ? 
                       (typeof englishEventsData !== 'undefined' ? englishEventsData : {}) : 
                       (typeof hindiEventsData !== 'undefined' ? hindiEventsData : {});

    if (typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        
        // Agar aapne ID sahi rakhi hai, toh ye update hoga
        if(document.getElementById('pan-tithi')) document.getElementById('pan-tithi').innerText = d.tithi || "--";
        if(document.getElementById('pan-nak')) document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        if(document.getElementById('pan-sun')) document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        
        // Chaughadia Bilingual logic
        if(document.getElementById('day-chaughadia')) 
            document.getElementById('day-chaughadia').innerText = d.dayChaughadia || (lang === 'en' ? "Amrit, Shubh" : "अमृत, शुभ");

        // Daily Festival Alert
        const box = document.getElementById('fest-box');
        const festTxt = document.getElementById('today-fest');
        if (box && festTxt) {
            if (sourceData[dateKey]) {
                box.style.display = "block";
                festTxt.innerText = sourceData[dateKey];
            } else {
                box.style.display = "none";
            }
        }
    }
}

// 🔱 Navigation
function changeMonth(s) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    curMonth += s;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    else if (curMonth < 0) { curMonth = 11; curYear--; }
    
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

// 🔱 Mobile Menu (Isolated logic)
function setupMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    if(mobileMenu && navDrawer && menuOverlay) {
        mobileMenu.onclick = () => { navDrawer.style.right = "0"; menuOverlay.style.display = "block"; };
        const close = () => { navDrawer.style.right = "-100%"; menuOverlay.style.display = "none"; };
        menuOverlay.onclick = close;
        if(document.getElementById('close-menu')) document.getElementById('close-menu').onclick = close;
    }
}
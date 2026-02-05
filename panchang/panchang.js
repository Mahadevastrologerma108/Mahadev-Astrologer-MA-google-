// panchang.js
let curYear = 2026;
let curMonth = new Date().getMonth();

// 1. Month aur Day names ke dher (Bilingual)
const langMap = {
    hi: {
        months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        days: ['र','सो','मं','बु','गु','शु','श'],
        noEvent: "कोई मुख्य त्योहार नहीं।"
    },
    en: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        noEvent: "No major festivals."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Ye line magic hai: Har load par bhasha check karegi
    const currentLang = localStorage.getItem('selectedLang') || 'hi';
    renderEverything(currentLang); 
    setupMenu();
});

function renderEverything(lang) {
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";
    
    updateDaily(todayStr, lang);
    updateEvents(lang);
    renderCal(curMonth, curYear, lang);
}

function renderCal(m, y, lang) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // Day Headers (Sun vs र) - Ab ye pakka badlega!
    langMap[lang].days.forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

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

function updateEvents(lang) {
    document.getElementById('month-name').innerText = `${langMap[lang].months[curMonth]} ${curYear}`;
    const list = document.getElementById('event-list');
    list.innerHTML = "";
    
    const sourceData = (lang === 'en') ? (window.englishEventsData || {}) : (window.hindiEventsData || {});
    let found = false;
    Object.keys(sourceData).forEach(k => {
        if(new Date(k).getMonth() === curMonth) {
            found = true;
            list.innerHTML += `<li><span class="gold-text"><strong>${k.split('-')[2]}:</strong></span> ${sourceData[k]}</li>`;
        }
    });
    if(!found) list.innerHTML = `<li>${langMap[lang].noEvent}</li>`;
}

// ... updateDaily aur baaki functions mein bhi (lang) pass kar dena ...
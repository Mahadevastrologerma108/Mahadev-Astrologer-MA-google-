// 🔱 PANCHANG HANDLER - STICKY VERSION (Doesn't break Layout)
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();

// 🔱 Layout ke sath sync karne ke liye
const getLang = () => localStorage.getItem('selectedLang') || 'hi';

const initPanchang = async () => {
    const lang = getLang();
    const mStr = String(currentMonth + 1).padStart(2, '0');
    
    // 1. Load Data
    await loadMonthlyFile(currentYear, currentMonth);
    
    // 2. Refresh UI elements
    updatePanchangData(lang);
    renderCalendar(lang);
    renderEvents(mStr, lang);
};

// 🔱 Data Loading Logic (Isolated)
const loadMonthlyFile = (year, month) => {
    return new Promise((resolve) => {
        const mStr = String(month + 1).padStart(2, '0');
        const scriptId = 'pan-data-script';
        const old = document.getElementById(scriptId);
        if(old) old.remove();

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `data/${year}/${mStr}-${year}.js`; 
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
};

// 🔱 Card Data Update
const updatePanchangData = (lang) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');
    const data = window.PANCHANG_DATABASE?.[currentYear]?.[mStr]?.[dStr]?.[lang];

    if (data) {
        const fields = {
            'pan-tithi': data.tithi, 'pan-nak': data.nak, 'pan-yoga': data.yoga,
            'pan-karan': data.karan, 'pan-paksha': data.paksha,
            'pan-muh': data.abhijit, 'pan-rahu': data.rahu, 'pan-sun': data.sun
        };
        Object.entries(fields).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || "--";
        });
        
        // Choghadiya Trigger
        renderChaugTable(data.chaug, lang);
    }
};

// 🔱 Choghadiya Table Logic
const renderChaugTable = (chaugData, lang) => {
    const tbody = document.getElementById('chaug-body');
    if (!tbody || !chaugData) return;
    
    tbody.innerHTML = Object.entries(chaugData).map(([time, name]) => {
        const cleanTime = time.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
        return `<tr>
            <td class="gold-text">${cleanTime}</td>
            <td>${name}</td>
            <td style="font-size: 0.8rem;">● ${lang === 'hi' ? 'शुभ समय' : 'Auspicious'}</td>
        </tr>`;
    }).join('');
};

// 🔱 Event Indicators (The Dots)
const renderCalendar = (lang) => {
    const grid = document.getElementById('calendarDays');
    if (!grid) return;
    grid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) grid.innerHTML += '<div class="calendar-day empty"></div>';

    for(let d=1; d<=totalDays; d++) {
        const dStr = String(d).padStart(2, '0');
        const mStr = String(currentMonth + 1).padStart(2, '0');
        const fullDate = `${currentYear}-${mStr}-${dStr}`;
        const hasEv = window.YEARLY_EVENTS_2026?.[fullDate];

        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''} ${hasEv ? 'has-event' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>${hasEv ? '<div class="event-dot"></div>' : ''}`;
        dayEl.onclick = () => { selectedDay = d; updatePanchangData(getLang()); renderCalendar(getLang()); };
        grid.appendChild(dayEl);
    }
    
    // Month Display update
    const mNames = window.translations?.[lang]?.months || []; // Make sure this key exists in translations.js
    if(mNames[currentMonth]) document.getElementById('monthDisplay').innerText = `${mNames[currentMonth]} ${currentYear}`;
};

// 🔱 Change Month Control
window.changeMonth = (dir) => {
    currentMonth += dir;
    if(currentMonth < 0) { currentMonth = 11; currentYear--; }
    if(currentMonth > 11) { currentMonth = 0; currentYear++; }
    initPanchang();
};

// 🔱 THE SAVIOR: Wait for Layout to finish
window.addEventListener('load', () => {
    // Layout ke load hone ke 200ms baad panchang chalu karo
    setTimeout(initPanchang, 200);
});

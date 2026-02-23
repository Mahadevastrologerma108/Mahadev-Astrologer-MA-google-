// 🔱 Global Variables
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let activeMode = 'day';

// 🔱 1. Month Loader (Yearly Folder Logic: data/2026/02.js)
const loadMonthlyFile = (year, month) => {
    return new Promise((resolve) => {
        const mStr = String(month + 1).padStart(2, '0');
        const scriptId = 'panchang-data-script';
        
        const oldScript = document.getElementById(scriptId);
        if(oldScript) oldScript.remove();

        const script = document.createElement('script');
        script.id = scriptId;
        
        // 🔱 FIXED PATH: Ab ye data/2026/02-2026.js ko dhundega
        script.src = `data/${year}/${mStr}-${year}.js`; 
        
        script.onload = () => {
            console.log("Success! File Loaded:", script.src);
            resolve();
        };
        script.onerror = () => {
            console.error("Path Error! File not found at:", script.src);
            resolve();
        };
        document.head.appendChild(script);
    });
};

// 🔱 2. Main Update Function (Everything Together)
const updateAll = async () => {
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');

    // A. Pehle Data Load Karo
    await loadMonthlyFile(currentYear, currentMonth);

    // B. Static Labels (Translations)
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (window.translations?.[lang]?.[key]) el.innerText = window.translations[lang][key];
    });

    // C. Calendar & Events (Firebase code se uthaya logic)
    renderCalendar(lang);
    renderEvents(mStr, lang);

    // D. Data Cards & Choghadiya
    const dayData = window.PANCHANG_DATABASE?.[currentYear]?.[mStr]?.[dStr]?.[lang];
    
    if (dayData) {
        const mapping = {
            'pan-tithi': dayData.tithi, 'pan-nak': dayData.nak, 'pan-yoga': dayData.yoga,
            'pan-karan': dayData.karan, 'pan-paksha': dayData.paksha,
            'pan-muh': dayData.abhijit, 'pan-rahu': dayData.rahu, 'pan-sun': dayData.sun
        };
        Object.entries(mapping).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || "--";
        });

        // Choghadiya Logic
        const tbody = document.getElementById('chaug-body');
        if (tbody && dayData.chaug) {
            tbody.innerHTML = Object.entries(dayData.chaug).map(([timeKey, name]) => {
                const displayTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
                return `<tr>
                    <td class="gold-text" style="text-align: center;">${displayTime}</td>
                    <td style="text-align: center;">${name}</td>
                    <td style="text-align: center;">● ${lang === 'hi' ? 'स्थिति' : 'Status'}</td>
                </tr>`;
            }).join('');
        }
    }
};

// 🔱 3. Calendar & Events Rendering (From your old code)
const renderCalendar = (lang) => {
    const months = {
        hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    document.getElementById('monthDisplay').innerText = `${months[lang][currentMonth]} ${currentYear}`;

    const grid = document.getElementById('calendarDays');
    if (grid) {
        grid.innerHTML = '';
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const total = new Date(currentYear, currentMonth + 1, 0).getDate();
        for(let i=0; i<firstDay; i++) grid.innerHTML += '<div class="calendar-day empty"></div>';
        for(let d=1; d<=total; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
            dayEl.innerHTML = `<span>${d}</span>`;
            dayEl.onclick = () => { selectedDay = d; updateAll(); };
            grid.appendChild(dayEl);
        }
    }
};

const renderEvents = (mStr, lang) => {
    const datePrefix = `${currentYear}-${mStr}`;
    const evList = document.getElementById('events-list');
    if (evList) {
        evList.innerHTML = Object.entries(window.YEARLY_EVENTS_2026 || {})
            .filter(([date]) => date.startsWith(datePrefix))
            .map(([date, ev]) => `
                <div class="event-card">
                    <span class="event-date-number">${date.split('-')[2]}</span>
                    <span>${ev[lang] || ev.en}</span>
                </div>`)
            .join('') || `<p class="center" style="grid-column: 1/-1; opacity:0.5;">No Events</p>`;
    }
};

// 🔱 4. Global Controls
window.changeMonth = (dir) => { 
    currentMonth += dir; 
    if(currentMonth < 0) { currentMonth = 11; currentYear--; } 
    if(currentMonth > 11) { currentMonth = 0; currentYear++; } 
    updateAll(); 
};

window.switchChaug = (mode) => { 
    activeMode = mode; 
    document.getElementById('btn-day').classList.toggle('active', mode === 'day'); 
    document.getElementById('btn-night').classList.toggle('active', mode === 'night'); 
    updateAll(); 
};

// 🔱 5. Initial Load
document.addEventListener('DOMContentLoaded', updateAll);

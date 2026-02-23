// 🔱 PANCHANG HANDLER - REPAIRED VERSION
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();

const getLang = () => localStorage.getItem('selectedLang') || 'hi';

const initPanchang = async () => {
    const lang = getLang();
    const mStr = String(currentMonth + 1).padStart(2, '0');
    
    await loadMonthlyFile(currentYear, currentMonth);
    
    updatePanchangData(lang);
    renderCalendar(lang);
    renderEvents(mStr, lang); // Ab ye function niche defined hai
};

const loadMonthlyFile = (year, month) => {
    return new Promise((resolve) => {
        const mStr = String(month + 1).padStart(2, '0');
        const scriptId = 'pan-data-script';
        const old = document.getElementById(scriptId);
        if(old) old.remove();

        const script = document.createElement('script');
        script.id = scriptId;
        // File path format: data/2026/02-2026.js
        script.src = `data/${year}/${mStr}-${year}.js`; 
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
};

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
        
        renderChaugTable(data.chaug, lang);
    }
};

// 🔱 CHOGHADIYA - CENTER ALIGNED & LOGIC FIXED
const renderChaugTable = (chaugData, lang) => {
    const tbody = document.getElementById('chaug-body');
    if (!tbody || !chaugData) return;
    
    const trans = window.translations[lang];

    tbody.innerHTML = Object.entries(chaugData).map(([time, name]) => {
        const cleanTime = time.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
        
        // Nature Check: Kaunsa shubh hai kaunsa ashubh
        let natureKey = "good"; 
        const badList = ["Rog", "Kaal", "Udveg", "रोग", "काल", "उद्वेग"];
        const neutralList = ["Char", "चर"];

        if(badList.includes(name)) natureKey = "bad";
        else if(neutralList.includes(name)) natureKey = "neutral";

        const natureText = trans[natureKey] || natureKey;
        const colorClass = natureKey === 'bad' ? 'text-danger' : (natureKey === 'good' ? 'gold-text' : '');

        return `<tr>
            <td class="gold-text" style="text-align: center;">${cleanTime}</td>
            <td style="text-align: center;">${name}</td>
            <td class="${colorClass}" style="font-size: 0.8rem; text-align: center;">● ${natureText}</td>
        </tr>`;
    }).join('');
};

// 🔱 EVENTS LIST - FIXED (JO GAYAB THI)
const renderEvents = (mStr, lang) => {
    const list = document.getElementById('events-list');
    if (!list) return;
    list.innerHTML = '';

    const events = window.YEARLY_EVENTS_2026 || {};
    const trans = window.translations[lang];

    // Is mahine ke events filter karo
    const monthlyEvents = Object.entries(events).filter(([date]) => date.includes(`-2026-${mStr}`));

    if (monthlyEvents.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:rgba(255,255,255,0.5);">${trans.no_events || 'No festivals today'}</p>`;
        return;
    }

    monthlyEvents.forEach(([date, names]) => {
        const d = date.split('-')[2]; 
        const div = document.createElement('div');
        div.className = 'event-item';
        div.style = "display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid rgba(245, 197, 66, 0.2);";
        div.innerHTML = `
            <span class="gold-text" style="font-weight: bold;">${d} ${trans.months[currentMonth]}</span>
            <span style="color: white;">${names[lang]}</span>
        `;
        list.appendChild(div);
    });
};

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
        dayEl.onclick = () => { 
            selectedDay = d; 
            updatePanchangData(getLang()); 
            renderCalendar(getLang()); 
        };
        grid.appendChild(dayEl);
    }
    
    const mNames = window.translations?.[lang]?.months || [];
    if(mNames[currentMonth]) document.getElementById('monthDisplay').innerText = `${mNames[currentMonth]} ${currentYear}`;
};

window.changeMonth = (dir) => {
    currentMonth += dir;
    if(currentMonth < 0) { currentMonth = 11; currentYear--; }
    if(currentMonth > 11) { currentMonth = 0; currentYear++; }
    initPanchang();
};

// 🔱 INITIALIZER
window.addEventListener('load', () => {
    setTimeout(initPanchang, 200);
});

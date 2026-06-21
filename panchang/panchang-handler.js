// 🔱 PANCHANG HANDLER - LIFETIME MASTER VERSION (UPDATED WITH STATIC TRANSLATOR)
let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let currentChaugMode = 'day'; 

const getLang = () => localStorage.getItem('selectedLang') || 'hi';

// 🔱 NEW: Static Text Translator Engine (For H1, H2, H3, H4, P tags)
const updateStaticText = (lang) => {
    // Check both pageTranslations and translations just to be safe
    const translations = window.pageTranslations?.[lang] || window.translations?.[lang];
    if (!translations) return;

    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key]) {
            el.innerHTML = translations[key]; // innerHTML allows <strong> tags
        }
    });
};

// 1. Initialize Panchang
const initPanchang = async () => {
    const lang = getLang();
    const mStr = String(currentMonth + 1).padStart(2, '0');
    
    // ➔ NEW: Pehle static HTML (headings/paragraphs) ko translate karega
    updateStaticText(lang); 
    
    await loadMonthlyFile(currentYear, currentMonth);
    
    updatePanchangData(lang);
    renderCalendar(lang);
    renderEvents(mStr, lang); 
};

// 2. Day/Night Switcher (Logic Fix)
window.switchChaug = (mode) => {
    currentChaugMode = mode;
    const btnDay = document.getElementById('btn-day');
    const btnNight = document.getElementById('btn-night');
    if(btnDay) btnDay.classList.toggle('active', mode === 'day');
    if(btnNight) btnNight.classList.toggle('active', mode === 'night');
    
    updatePanchangData(getLang());
};

// 3. Load Monthly Data JS
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

// 4. Update UI with Data
const updatePanchangData = (lang) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');
    const data = window.PANCHANG_DATABASE?.[currentYear]?.[mStr]?.[dStr]?.[lang];

    if (data) {
        // Tithi, Nakshatra, etc.
        const fields = {
            'pan-tithi': data.tithi, 'pan-nak': data.nak, 'pan-yoga': data.yoga,
            'pan-karan': data.karan, 'pan-paksha': data.paksha,
            'pan-muh': data.abhijit, 'pan-rahu': data.rahu, 'pan-sun': data.sun
        };
        Object.entries(fields).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || "--";
        });
        
        // 🔱 SMART CHAUGHADIA SELECTOR
        // Pehle chaug_day/night check karega, agar nahi mila toh 'chaug' use karega
        let selectedChaug;
        if (currentChaugMode === 'day') {
            selectedChaug = data.chaug_day || data.chaug;
        } else {
            selectedChaug = data.chaug_night || data.chaug;
        }
        
        renderChaugTable(selectedChaug, lang);
    }
};

// 5. Choghadiya Table Rendering
const renderChaugTable = (chaugData, lang) => {
    const tbody = document.getElementById('chaug-body');
    if (!tbody || !chaugData) return;
    
    const trans = window.translations?.[lang] || window.pageTranslations?.[lang];

    tbody.innerHTML = Object.entries(chaugData).map(([time, name]) => {
        // Time format check (t0652 -> 06:52)
        let cleanTime = time.replace('t', '');
        if (cleanTime.length === 4 && !cleanTime.includes(':')) {
            cleanTime = cleanTime.replace(/^(\d{2})(\d{2})$/, '$1:$2');
        }
        
        let natureKey = "good"; 
        const badList = ["Rog", "Kaal", "Udveg", "रोग", "काल", "उद्वेग"];
        const neutralList = ["Char", "चर"];

        if(badList.includes(name)) natureKey = "bad";
        else if(neutralList.includes(name)) natureKey = "neutral";

        const natureText = trans?.[natureKey] || natureKey;
        const colorClass = natureKey === 'bad' ? 'text-danger' : (natureKey === 'good' ? 'gold-text' : '');

        return `<tr>
            <td class="gold-text" style="text-align: center; font-weight: 500;">${cleanTime}</td>
            <td style="text-align: center;">${name}</td>
            <td class="${colorClass}" style="font-size: 0.8rem; text-align: center;">● ${natureText}</td>
        </tr>`;
    }).join('');
};

// 6. Events List (Screenshot 3 - Card Style)
const renderEvents = (mStr, lang) => {
    const list = document.getElementById('events-list');
    if (!list) return;
    list.innerHTML = '';

    const events = window.YEARLY_EVENTS_2026 || {};
    const trans = window.translations?.[lang] || window.pageTranslations?.[lang] || {};

    const monthlyEvents = Object.entries(events).filter(([date]) => {
        return date.startsWith(`${currentYear}-${mStr}`);
    });

    if (monthlyEvents.length === 0) {
        list.innerHTML = `<p style="text-align:center; padding: 20px; color:rgba(255,255,255,0.5);">${trans.no_events || 'No festivals this month'}</p>`;
        return;
    }

    // Grid Layout for Cards
    list.style.display = "grid";
    list.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr))";
    list.style.gap = "15px";

    monthlyEvents.sort().forEach(([date, names]) => {
        const d = date.split('-')[2]; 
        const div = document.createElement('div');
        div.className = 'service-card';
        div.style = "text-align: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(245, 197, 66, 0.2);";
        
        // Added fallback logic so it doesn't crash if 'months' array is missing
        const monthName = trans.months ? trans.months[currentMonth] : '--';

        div.innerHTML = `
            <div class="gold-text cinzel" style="font-size: 1.4rem; font-weight: bold;">${d}</div>
            <div style="font-size: 0.7rem; color: #aaa; margin-bottom: 5px;">${monthName}</div>
            <div style="font-size: 0.85rem; color: white; font-weight: 600;">${names[lang] || names['en'] || ''}</div>
        `;
        list.appendChild(div);
    });
};

// 7. Calendar Rendering
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
    
    const trans = window.translations?.[lang] || window.pageTranslations?.[lang];
    if(trans?.months?.[currentMonth]) {
        document.getElementById('monthDisplay').innerText = `${trans.months[currentMonth]} ${currentYear}`;
    }
};

window.changeMonth = (dir) => {
    currentMonth += dir;
    if(currentMonth < 0) { currentMonth = 11; currentYear--; }
    if(currentMonth > 11) { currentMonth = 0; currentYear++; }
    initPanchang();
};

window.addEventListener('load', () => {
    setTimeout(initPanchang, 200);
});
// 8. 🔱 DYNAMIC DATA TRIGGER ONLY (HTML translation is handled globally by V-MAX)
document.addEventListener('click', (e) => {
    // Check if the clicked element is the language toggle button
    if (e.target.closest('#langToggle') || e.target.closest('.lang-switch')) {
        setTimeout(() => {
            const newLang = getLang();
            const mStr = String(currentMonth + 1).padStart(2, '0');
            
            // ❌ updateStaticText(newLang) यहाँ से हटा दिया गया है
            
            // ✅ सिर्फ तुम्हारी JS वाली डायनामिक चीज़ों को नई भाषा में रीलोड करो
            if (typeof updatePanchangData === 'function') updatePanchangData(newLang);
            if (typeof renderCalendar === 'function') renderCalendar(newLang);
            if (typeof renderEvents === 'function') renderEvents(mStr, newLang);
            
        }, 100); // 100ms delay ensures localStorage is updated first
    }
});

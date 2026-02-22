import { rtdb } from './panchang-config.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentYear = 2026;
let currentMonth = new Date().getMonth();
let selectedDay = new Date().getDate();
let panchangData = null;
let activeMode = 'day';

// SUPREME TRANSLATOR
const smartTranslate = (word) => {
    if (!word) return "--";
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const dict = window.translations?.[lang] || {};
    let clean = word.toString().trim();
    if (dict[clean]) return dict[clean];
    let lower = clean.toLowerCase();
    if (dict[lower]) return dict[lower];
    let cap = lower.charAt(0).toUpperCase() + lower.slice(1);
    return dict[cap] || clean;
};

// 5 CONDITIONS COLOR LOGIC
const getStatusMeta = (name) => {
    const n = name ? name.toLowerCase().trim() : "";
    const bad = ["rog", "kaal", "udveg", "रोग", "काल", "उद्वेग"];
    const neutral = ["char", "cher", "चर"];
    if (bad.some(b => n.includes(b))) return { label: "bad", color: "#ff4d4d" };
    if (neutral.some(neu => n.includes(neu))) return { label: "neutral", color: "#ffcc00" };
    return { label: "good", color: "#00ff88" };
};

const updateUI = () => {
    if (!panchangData) return;
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = "d" + String(selectedDay).padStart(2, '0');
    const data = panchangData[mStr]?.[dStr];

    // Update Cards
    const ids = ['tithi', 'nak', 'yoga', 'karan', 'paksha', 'muh', 'rahu'];
    ids.forEach(id => {
        let val = (id === 'muh') ? data?.muhurat?.abhijit : 
                  (id === 'rahu') ? data?.muhurat?.rahukaal : 
                  (id === 'karan') ? (data?.karan || data?.karana) : data?.[id];
        document.getElementById(`pan-${id}`).innerText = smartTranslate(val);
    });
    document.getElementById('pan-sun').innerText = data?.sun ? `${data.sun.rise} / ${data.sun.set}` : "--";

    // Update Choghadiya
    const chaugList = data?.choghadiya?.[activeMode] || {};
    document.getElementById('chaug-body').innerHTML = Object.entries(chaugList).map(([time, name]) => {
        const status = getStatusMeta(name);
        const displayTime = time.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
        return `<tr><td class="gold-text">${displayTime}</td><td>${smartTranslate(name)}</td><td style="color:${status.color}">● ${smartTranslate(status.label)}</td></tr>`;
    }).join('');

    // Update Events
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const datePrefix = `${currentYear}-${mStr}`;
    document.getElementById('events-list').innerHTML = Object.entries(window.YEARLY_EVENTS_2026 || {})
        .filter(([date]) => date.startsWith(datePrefix))
        .map(([date, ev]) => `<div class="event-card"><span class="event-date-number">${date.split('-')[2]}</span><span>${lang === 'hi' ? ev.hi : ev.en}</span></div>`)
        .join('') || '<p class="center">--</p>';
};

window.changeMonth = (dir) => { currentMonth += dir; if(currentMonth<0){currentMonth=11;currentYear--;} if(currentMonth>11){currentMonth=0;currentYear++;} renderCalendar(); updateUI(); };
window.switchChaug = (mode) => { activeMode = mode; document.getElementById('btn-day').classList.toggle('active', mode==='day'); document.getElementById('btn-night').classList.toggle('active', mode==='night'); updateUI(); };

const renderCalendar = () => {
    const container = document.getElementById('calendarDays');
    const months = ["mon_jan","mon_feb","mon_mar","mon_apr","mon_may","mon_jun","mon_jul","mon_aug","mon_sep","mon_oct","mon_nov","mon_dec"];
    document.getElementById('monthDisplay').innerText = `${smartTranslate(months[currentMonth])} ${currentYear}`;
    container.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) container.innerHTML += '<div class="calendar-day empty"></div>';
    for(let d=1; d<=daysInMonth; d++) {
        const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const isEv = window.YEARLY_EVENTS_2026?.[dateKey];
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${selectedDay === d ? 'active' : ''}`;
        dayEl.innerHTML = `<span>${d}</span>${isEv ? '<div class="event-dot"></div>' : ''}`;
        dayEl.onclick = () => { selectedDay = d; renderCalendar(); updateUI(); };
        container.appendChild(dayEl);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const snap = await get(ref(rtdb, `panchang/${currentYear}`));
    if(snap.exists()) { panchangData = snap.val(); renderCalendar(); updateUI(); }
    setInterval(() => { updateUI(); renderCalendar(); }, 800);
});

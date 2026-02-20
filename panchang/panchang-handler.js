import { db, rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Dedicated Panchang Handler Active");

window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; 
            await window.updatePanchangDisplay(data);
            if (typeof window.renderCalendar === 'function') window.renderCalendar();
        }
    } catch (e) { console.error("Firebase Error:", e); }
};

window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[dateKey];
    if (!d) return;

    const map = {
        'pan-tithi': d.tithi.hi, 'pan-nak': d.nakshatra?.hi || "--",
        'pan-yoga': d.yoga?.hi || "--", 'pan-karana': d.karan?.hi || "--",
        'pan-paksha': d.paksha?.hi || "--", 'pan-sun': `${d.sun.rise} / ${d.sun.set}`,
        'pan-moon': d.moon?.rise || "--", 'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    if (d.choghadiya) {
        const fill = (id, cData) => {
            const body = document.getElementById(id);
            if (body) body.innerHTML = Object.entries(cData)
                .map(([t, n]) => `<tr><td>${t}</td><td>${n}</td><td class="nature-shubh">Shubh</td></tr>`).join('');
        };
        fill('day-chaug-body', d.choghadiya.day);
        fill('night-chaug-body', d.choghadiya.night);
    }
};

window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    if (!container || !window.YEARLY_EVENTS_2026) return;

    const eventsData = window.YEARLY_EVENTS_2026;
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + 1).padStart(2, '0');
    let html = "";

    Object.keys(eventsData).sort().forEach(dateKey => {
        if (dateKey.startsWith(`2026-${currentM}`)) {
            const dayNum = dateKey.split('-')[2];
            const event = eventsData[dateKey];
            html += `<div class="event-item-row"><div class="ev-date">${dayNum}</div><div class="ev-info"><h4>${event.hi}</h4><p>${event.en}</p></div></div>`;
        }
    });
    container.innerHTML = html || `<p style="text-align:center;color:#888;">No festivals.</p>`;
};

document.addEventListener('DOMContentLoaded', () => window.getPanchangFromFirebase(2026));

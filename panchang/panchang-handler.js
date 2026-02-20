import { db, rtdb } from './panchang-config.js'; 
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Dedicated Panchang Handler Active");

// --- 1. GET DATA FROM FIREBASE ---
window.getPanchangFromFirebase = async function(year) {
    try {
        const panRef = ref(rtdb, `panchang/${year}`);
        const snapshot = await get(panRef); 
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            window["Data" + year] = data; // Global storage for logic.js

            // Top section update
            await window.updatePanchangDisplay(data);
            
            // Calendar and Events update
            if (typeof window.renderCalendar === 'function') {
                window.renderCalendar();
            } else {
                window.updateMonthlyEvents();
            }
        }
    } catch (e) { 
        console.error("🔱 Handler Error:", e); 
    }
};

// --- 2. UPDATE TOP CARDS & CHOUGHADIA ---
window.updatePanchangDisplay = async function(yearlyData, customDate = null) {
    const today = new Date();
    // Format: MM-DD
    const dateKey = customDate || `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const d = yearlyData[dateKey];
    
    if (!d) {
        console.log("No data for date:", dateKey);
        return;
    }

    const mapping = {
        'pan-tithi': d.tithi.hi,
        'pan-nak': d.nakshatra?.hi || "--",
        'pan-yoga': d.yoga?.hi || "--",
        'pan-karana': d.karan?.hi || "--",
        'pan-paksha': d.paksha?.hi || "--",
        'pan-sun': `${d.sun.rise} / ${d.sun.set}`,
        'pan-moon': d.moon?.rise || "--",
        'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    // Update UI elements
    Object.entries(mapping).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    // Update Chaughadia Tables
    if (d.choghadiya) {
        const fillTable = (id, tableData) => {
            const body = document.getElementById(id);
            if (body) {
                body.innerHTML = Object.entries(tableData)
                    .map(([time, name]) => `<tr><td>${time}</td><td>${name}</td><td class="nature-shubh">Shubh</td></tr>`)
                    .join('');
            }
        };
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    }
};

// --- 3. UPDATE FESTIVAL LIST (BOTTOM) ---
window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    if (!container) return;

    // Check if yearly-events-2026.js data is loaded
    if (!window.YEARLY_EVENTS_2026) {
        console.log("🔱 Waiting for Festivals Data...");
        setTimeout(window.updateMonthlyEvents, 500);
        return;
    }

    const eventsData = window.YEARLY_EVENTS_2026;
    // Current month (uses calendar state if available, else real date)
    const currentM = String((window.currentMonth !== undefined ? window.currentMonth : new Date().getMonth()) + 1).padStart(2, '0');
    let html = "";

    // Filter events for the selected month
    Object.keys(eventsData).sort().forEach(dateKey => {
        if (dateKey.startsWith(`2026-${currentM}`)) {
            const dayNum = dateKey.split('-')[2];
            const event = eventsData[dateKey];
            html += `
                <div class="event-item-row">
                    <div class="ev-date">${dayNum}</div>
                    <div class="ev-info">
                        <h4 style="color:var(--gold); margin:0; font-family:'Cinzel'; font-size:15px;">${event.hi}</h4>
                        <p style="color:#888; margin:2px 0 0; font-size:11px;">${event.en}</p>
                    </div>
                </div>`;
        }
    });

    container.innerHTML = html || `<p style="text-align:center; color:#888; padding:20px;">इस महीने कोई प्रमुख व्रत या त्यौहार नहीं हैं।</p>`;
};

// --- 4. START THE ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
    window.getPanchangFromFirebase(2026);
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let curYear = 2026;
let curMonth = new Date().getMonth();

function initPanchang() {
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) 
        ? today.toISOString().split('T')[0] 
        : "2026-01-01";
    
    updateDaily(todayStr);
    updateEvents();
    renderCal(curMonth, curYear);
}

function renderCal(m, y) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";

    // 1. Day Headers (Original Style)
    ['र','सो','मं','बु','गु','शु','श'].forEach(d => {
        grid.innerHTML += `<div class="day-header">${d}</div>`;
    });

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date();

    // 2. Empty Slots
    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    // 3. Date Blocks (Restoring your original logic)
    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isT = today.getDate()===d && today.getMonth()===m && today.getFullYear()===y;
        
        // Check for events in calendar-events.js
        const hasEventClass = (y === 2026 && typeof annualEvents !== 'undefined' && annualEvents[dateKey]) ? 'has-event' : '';
        const eventTitle = (y === 2026 && typeof annualEvents !== 'undefined' && annualEvents[dateKey]) ? annualEvents[dateKey] : '';

        grid.innerHTML += `<div class="calendar-day ${isT ? 'today' : ''} ${hasEventClass}" title="${eventTitle}">${d}</div>`;
    }
}

function updateEvents() {
    document.getElementById('month-name').innerText = `${monthNames[curMonth]} ${curYear}`;
    const list = document.getElementById('event-list');
    list.innerHTML = "";

    // --- 2026 FUTURE/PAST LOCK ---
    if (curYear !== 2026) {
        list.innerHTML = `
            <div style="text-align:center; padding:20px; border: 1px solid var(--gold); border-radius:10px; background:rgba(255,215,0,0.05);">
                <p class="gold-text" style="font-size:0.9rem;">${curYear} पंचांग गणना अभी अपडेट की जा रही है।</p>
                <p style="font-size:0.8rem; margin:10px 0;">व्यक्तिगत परामर्श के लिए यहाँ क्लिक करें।</p>
                <a href="../index.html#book" class="consult-link" style="padding:5px 15px; display:inline-block;">CONSULT NOW 🔱</a>
            </div>`;
        return;
    }

    // Filter events for 2026 month
    let found = false;
    if(typeof annualEvents !== 'undefined') {
        Object.keys(annualEvents).forEach(k => {
            const d = new Date(k);
            if(d.getMonth() === curMonth) {
                found = true;
                list.innerHTML += `<li><span class="gold-text"><strong>${k.split('-')[2]}:</strong></span> ${annualEvents[k]}</li>`;
            }
        });
    }
    if(!found) list.innerHTML = "<li>No major festivals this month.</li>";
}

function updateDaily(dateKey) {
    // Mapping data to your original HTML IDs
    if(typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        
        const box = document.getElementById('fest-box');
        if(annualEvents && annualEvents[dateKey]) {
            box.style.display = "block";
            document.getElementById('today-fest').innerText = annualEvents[dateKey];
        } else {
            box.style.display = "none";
        }
    } else {
        // Range lock or missing data fallback
        ['pan-tithi', 'pan-nak', 'pan-muh'].forEach(id => document.getElementById(id).innerText = "Consult Guruji");
        document.getElementById('pan-sun').innerText = "-- / --";
    }
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    updateEvents();
    renderCal(curMonth, curYear);
}

document.addEventListener('DOMContentLoaded', initPanchang);
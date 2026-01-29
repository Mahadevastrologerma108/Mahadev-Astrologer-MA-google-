const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let curYear = 2026;
let curMonth = new Date().getMonth();

function initPanchang() {
    const today = new Date();
    const todayStr = `2026-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Initial Load
    updateDaily(todayStr);
    updateEvents();
    renderCal(curMonth, curYear);
}

function renderCal(m, y) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";
    ['र','सो','मं','बु','गु','शु','श'].forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d<=days; d++) {
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (y === 2026 && typeof annualEvents !== 'undefined' && annualEvents[dateKey]) ? 'has-event' : '';
        grid.innerHTML += `<div class="calendar-day ${hasEvent}">${d}</div>`;
    }
}

function updateEvents() {
    document.getElementById('month-name').innerText = `${monthNames[curMonth]} ${curYear}`;
    const list = document.getElementById('event-list');
    list.innerHTML = "";

    if (curYear !== 2026) {
        list.innerHTML = `<div style="text-align:center; padding:15px;"><p class="gold-text">Events for ${curYear} available on request.</p><a href="../index.html#book" class="consult-link" style="display:inline-block; margin-top:10px; background:var(--gold); color:#000; padding:8px 15px; border-radius:5px; text-decoration:none; font-weight:bold;">CONSULT NOW 🔱</a></div>`;
        return;
    }

    let found = false;
    if(typeof annualEvents !== 'undefined') {
        Object.keys(annualEvents).forEach(key => {
            const d = new Date(key);
            if(d.getMonth() === curMonth) {
                found = true;
                list.innerHTML += `<li><span class="gold-text"><strong>${key.split('-')[2]}:</strong></span> ${annualEvents[key]}</li>`;
            }
        });
    }
    if(!found) list.innerHTML = "<li>No major festivals this month.</li>";
}

function updateDaily(dateKey) {
    const festBox = document.getElementById('fest-box');
    document.getElementById('display-date').innerText = "Aaj Ka Panchang (" + dateKey + ")";

    if(typeof annualEvents !== 'undefined' && annualEvents[dateKey]) {
        festBox.style.display = "block";
        document.getElementById('today-fest').innerText = annualEvents[dateKey];
    } else { festBox.style.display = "none"; }

    if(typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi;
        document.getElementById('pan-nak').innerText = d.nakshatra;
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat;
    } else {
        ['pan-tithi', 'pan-nak', 'pan-muh'].forEach(id => document.getElementById(id).innerText = "Consult Now");
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
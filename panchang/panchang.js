const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let curYear = 2026;
let curMonth = new Date().getMonth();

async function initPanchang() {
    try {
        const [resE, resD] = await Promise.all([fetch(eventPath), fetch(detailPath)]);
        const allE = await resE.json();
        const allD = await resD.json();
        const todayStr = new Date().toLocaleDateString('en-CA');

        updateDaily(allD[todayStr]);
        updateEvents(allE);
        renderCal(curMonth, curYear);
    } catch (err) { console.error("Error loading JSON:", err); }
}

function renderCal(m, y) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = "";
    ['र','सो','मं','बु','गु','शु','श'].forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date();

    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;
    for(let d=1; d<=days; d++) {
        const isT = today.getDate()===d && today.getMonth()===m && today.getFullYear()===y;
        grid.innerHTML += `<div class="calendar-day ${isT ? 'today' : ''}">${d}</div>`;
    }
}

function updateEvents(data) {
    const mName = monthNames[curMonth];
    document.getElementById('month-name').innerText = `${mName} ${curYear}`;
    const list = document.getElementById('event-list');
    list.innerHTML = "";
    const mData = data[mName];
    if(mData) {
        Object.keys(mData).sort().forEach(k => {
            list.innerHTML += `<li><span class="gold-text"><strong>${k.split('-')[2]}:</strong></span> ${mData[k]}</li>`;
        });
    }
}

function updateDaily(d) {
    if(!d) return;
    document.getElementById('pan-tithi').innerText = d.tithi;
    document.getElementById('pan-nak').innerText = d.nakshatra;
    document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
    document.getElementById('pan-muh').innerText = d.muhurat;
    const box = document.getElementById('fest-box');
    if(d.festival !== "None") {
        box.style.display = "block";
        document.getElementById('today-fest').innerText = d.festival;
    } else box.style.display = "none";
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    initPanchang();
}

initPanchang();
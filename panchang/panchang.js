const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let curYear = 2026;
let curMonth = new Date().getMonth();
let cachedEvents = null; // Events ko save karne ke liye

async function initPanchang() {
    try {
        const [resE, resD] = await Promise.all([
            fetch(eventPath).then(res => res.json()),
            fetch(detailPath).then(res => res.json())
        ]);
        
        cachedEvents = resE; // Global save
        const todayStr = new Date().toLocaleDateString('en-CA');

        updateDaily(resD[todayStr]);
        updateEvents(cachedEvents);
        renderCal(curMonth, curYear, cachedEvents);
    } catch (err) { 
        console.error("Data loading issue:", err); 
    }
}

function renderCal(m, y, allEvents) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = "";
    
    // Day Headers
    ['र','सो','मं','बु','गु','शु','श'].forEach(d => grid.innerHTML += `<div class="day-header">${d}</div>`);

    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    
    const mName = monthNames[m];
    const monthlyData = allEvents ? allEvents[mName] : null;

    // Blanks
    for(let i=0; i<start; i++) grid.innerHTML += `<div></div>`;
    
    // Days
    for(let d=1; d<=days; d++) {
        const isT = today.getDate()===d && today.getMonth()===m && today.getFullYear()===y;
        
        // Date key format: 2026-01-01
        const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvent = (monthlyData && monthlyData[dateKey]) ? 'has-event' : '';
        const eventTitle = (monthlyData && monthlyData[dateKey]) ? monthlyData[dateKey] : '';

        grid.innerHTML += `<div class="calendar-day ${isT ? 'today' : d} ${hasEvent}" title="${eventTitle}">${d}</div>`;
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
    } else {
        list.innerHTML = "<li>No festivals this month.</li>";
    }
}

function updateDaily(d) {
    if(!d) return;
    document.getElementById('pan-tithi').innerText = d.tithi || "--";
    document.getElementById('pan-nak').innerText = d.nakshatra || "--";
    document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
    document.getElementById('pan-muh').innerText = d.muhurat || "--";
    const box = document.getElementById('fest-box');
    if(d.festival && d.festival !== "None") {
        box.style.display = "block";
        document.getElementById('today-fest').innerText = d.festival;
    } else {
        box.style.display = "none";
    }
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    
    // Month change pe sirf events aur calendar update honge
    updateEvents(cachedEvents);
    renderCal(curMonth, curYear, cachedEvents);
}

initPanchang();
// --- Yaha se Menu Logic shuru ---
const mobileMenu = document.getElementById('mobile-menu');
const navDrawer = document.getElementById('nav-drawer');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenu = document.getElementById('close-menu');

if (mobileMenu) {
    mobileMenu.onclick = () => {
        navDrawer.style.right = "0";
        menuOverlay.style.display = "block";
    };
}

if (closeMenu) {
    closeMenu.onclick = () => {
        navDrawer.style.right = "-100%";
        menuOverlay.style.display = "none";
    };
}

if (menuOverlay) {
    menuOverlay.onclick = () => {
        navDrawer.style.right = "-100%";
        menuOverlay.style.display = "none";
    };
}
// --- Yaha tak Menu Logic khatam ---
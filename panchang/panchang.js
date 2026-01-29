const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let curYear = 2026;
let curMonth = new Date().getMonth();

document.addEventListener('DOMContentLoaded', () => {
    initPanchang();
    setupMenu();
});

function setupMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');
    
    if(mobileMenu) mobileMenu.onclick = () => { 
        navDrawer.style.right = "0"; 
        menuOverlay.style.display = "block"; 
    };
    const close = () => { 
        navDrawer.style.right = "-100%"; 
        menuOverlay.style.display = "none"; 
    };
    if(closeMenu) closeMenu.onclick = close;
    if(menuOverlay) menuOverlay.onclick = close;
}

function initPanchang() {
    const today = new Date();
    const todayStr = (today.getFullYear() === 2026) ? today.toISOString().split('T')[0] : "2026-01-01";
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
        list.innerHTML = `<div style="text-align:center; padding:15px; border:1px dashed var(--gold); border-radius:10px;"><p class="gold-text">2026 पंचांग गणना उपलब्ध है</p><a href="../index.html#book" class="consult-link" style="display:inline-block; margin-top:10px; color:var(--gold); border:1px solid var(--gold); padding:5px 12px; border-radius:5px; text-decoration:none;">CONSULT NOW 🔱</a></div>`;
        return;
    }
    let found = false;
    if(typeof annualEvents !== 'undefined') {
        Object.keys(annualEvents).forEach(k => {
            if(new Date(k).getMonth() === curMonth) {
                found = true;
                list.innerHTML += `<li><span class="gold-text"><strong>${k.split('-')[2]}:</strong></span> ${annualEvents[k]}</li>`;
            }
        });
    }
    if(!found) list.innerHTML = "<li>Is mahine koi mukhya tyohar nahi hai.</li>";
}

function updateDaily(dateKey) {
    if(typeof panchangData !== 'undefined' && panchangData[dateKey]) {
        const d = panchangData[dateKey];
        document.getElementById('pan-tithi').innerText = d.tithi || "--";
        document.getElementById('pan-nak').innerText = d.nakshatra || "--";
        document.getElementById('pan-sun').innerText = `${d.sunrise} / ${d.sunset}`;
        document.getElementById('pan-muh').innerText = d.muhurat || "--";
        document.getElementById('pan-rahu').innerText = d.rahuKaal || "--";
        document.getElementById('day-chaughadia').innerText = d.dayChaughadia || "अमृत, शुभ, लाभ";
        document.getElementById('night-chaughadia').innerText = d.nightChaughadia || "लाभ, अमृत, शुभ";
        const box = document.getElementById('fest-box');
        if(annualEvents[dateKey]) { 
            box.style.display="block"; 
            document.getElementById('today-fest').innerText = annualEvents[dateKey]; 
        } else { box.style.display="none"; }
    }
}

function changeMonth(s) {
    curMonth += s;
    if(curMonth > 11) { curMonth=0; curYear++; }
    else if(curMonth < 0) { curMonth=11; curYear--; }
    updateEvents();
    renderCal(curMonth, curYear);
}
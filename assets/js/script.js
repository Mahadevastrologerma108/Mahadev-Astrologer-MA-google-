// --- 1. LAYOUT & MENU LOGIC ---
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');
        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            // 🔱 Menu Activation (Hamburger Logic)
            initMenu();
            
            // 🔱 UI Translation
            window.updateUI();
        }
    } catch (e) { console.log("Layout error:", e); }
}

function initMenu() {
    const menuBtn = document.getElementById('mobile-menu');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    if (menuBtn && drawer) {
        menuBtn.onclick = () => {
            drawer.style.right = '0';
            if(overlay) overlay.style.display = 'block';
        };

        const hideMenu = () => {
            drawer.style.right = '-280px';
            if(overlay) overlay.style.display = 'none';
        };

        if (closeBtn) closeBtn.onclick = hideMenu;
        if (overlay) overlay.onclick = hideMenu;
    }
}

// --- 2. TRANSLATION LOGIC ---
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const t = window.translations;
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) el.innerHTML = t[lang][key];
    });

    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (t[lang][key]) el.placeholder = t[lang][key];
    });

    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    
    // Form logic ko bhi update karo
    if(typeof applyFormLogic === 'function') applyFormLogic();
};

window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

// --- 3. DYNAMIC FORM & SUBMIT LOGIC ---
window.applyFormLogic = function() {
    const svc = document.getElementById('service-select')?.value;
    if(!svc) return;

    const singleSec = document.getElementById('section-single');
    const matchingSec = document.getElementById('section-matching');
    const palmInst = document.getElementById('palm-instruction');
    const birthFields = document.getElementById('birth-fields');
    const timePlaceGroup = document.getElementById('time-place-group');

    const sDob = document.getElementById('single-dob');
    const sTime = document.getElementById('single-time');
    const sPlace = document.getElementById('single-place');

    // Default Reset
    if(singleSec) singleSec.style.display = 'block';
    if(matchingSec) matchingSec.style.display = 'none';
    if(palmInst) palmInst.style.display = 'none';
    if(birthFields) birthFields.style.display = 'block';
    if(timePlaceGroup) timePlaceGroup.style.display = 'grid';

    // Required Field Reset
    [sDob, sTime, sPlace].forEach(el => { if(el) el.required = false; });

    // Conditional Logic
    if (svc === 'kundli_making') {
        [sDob, sTime, sPlace].forEach(el => { if(el) el.required = true; });
    } else if (svc === 'kundli_matching') {
        if(singleSec) singleSec.style.display = 'none';
        if(matchingSec) matchingSec.style.display = 'block';
    } else if (svc === 'palmistry') {
        if(birthFields) birthFields.style.display = 'none';
        if(palmInst) palmInst.style.display = 'block';
    } else if (svc === 'numerology') {
        if(timePlaceGroup) timePlaceGroup.style.display = 'none';
        if(sDob) sDob.required = true;
    } else if (svc === 'combo_analysis') {
        if(palmInst) palmInst.style.display = 'block';
        [sDob, sTime, sPlace].forEach(el => { if(el) el.required = true; });
    }
};

window.handleDivineSubmit = function(e) {
    e.preventDefault();
    // (Yahan aapka pura Message formatting wala code rahega)
    alert("Pranaam! Aapka message WhatsApp par bheja ja raha hai.");
};

// --- 4. STARTUP ---
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    document.getElementById('consultation-form')?.addEventListener('submit', window.handleDivineSubmit);
});

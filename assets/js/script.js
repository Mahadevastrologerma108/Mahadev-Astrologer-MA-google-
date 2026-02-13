// --- 1. LAYOUT & MENU LOGIC ---
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');
        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            initMenu();
            window.updateUI(); // Layout load hone ke baad content fill karein
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

// --- 2. TRANSLATION LOGIC (FIXED) ---
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations;
    if (!t || !t[lang]) return;

    // Static text update
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) el.innerHTML = t[lang][key];
    });

    // Placeholder update (Matching your HTML data-placeholder-key)
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-placeholder-key');
        if (t[lang][key]) el.placeholder = t[lang][key];
    });

    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    
    if(typeof applyFormLogic === 'function') applyFormLogic();
};

window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'hi';
    localStorage.setItem('preferredLang', current === 'hi' ? 'en' : 'hi');
    location.reload(); 
};

// --- 3. FORM LOGIC (REFINED) ---
window.syncContactMethod = function(type) {
    const input = document.getElementById('contact-detail');
    const warning = document.getElementById('email-warning');
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations[lang];

    if (!input) return;

    if (type === 'WA') {
        input.placeholder = t.ph_contact || "WhatsApp Number";
        if(warning) warning.style.display = "none";
    } else if (type === 'TG') {
        input.placeholder = "Telegram Username / Link";
        if(warning) warning.style.display = "none";
    } else if (type === 'EM') {
        input.placeholder = "Your Email Address";
        if(warning) warning.style.display = "block";
    }
};

window.applyFormLogic = function() {
    const svc = document.getElementById('service-select')?.value;
    const singleSec = document.getElementById('section-single');
    const matchingSec = document.getElementById('section-matching');
    const palmInst = document.getElementById('palm-instruction');
    const timePlaceGroup = document.getElementById('time-place-group');

    if (!svc) return;

    // Default Reset
    if(singleSec) singleSec.style.display = 'block';
    if(matchingSec) matchingSec.style.display = 'none';
    if(palmInst) palmInst.style.display = 'none';
    if(timePlaceGroup) timePlaceGroup.style.display = 'grid';

    if (svc === 'kundli_matching') {
        if(singleSec) singleSec.style.display = 'none';
        if(matchingSec) matchingSec.style.display = 'block';
    } else if (svc === 'palmistry') {
        if(palmInst) palmInst.style.display = 'block';
    } else if (svc === 'numerology') {
        if(timePlaceGroup) timePlaceGroup.style.display = 'none';
    } else if (svc === 'combo_analysis') {
        if(palmInst) palmInst.style.display = 'block';
    }
};

// --- 4. STARTUP ---
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    window.updateUI(); // Immediate call for local content
    document.getElementById('consultation-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("🔱 Pranaam! Mahadev Astrologer MA will contact you soon.");
    });
});

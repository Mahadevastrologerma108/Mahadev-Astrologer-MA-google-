// --- 1. LAYOUT & MENU LOGIC ---
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');
        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            initMenu();
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
        menuBtn.onclick = () => { drawer.style.right = '0'; if(overlay) overlay.style.display = 'block'; };
        const hideMenu = () => { drawer.style.right = '-280px'; if(overlay) overlay.style.display = 'none'; };
        if (closeBtn) closeBtn.onclick = hideMenu;
        if (overlay) overlay.onclick = hideMenu;
    }
}

// --- 2. TRANSLATION LOGIC (Text + Links) ---
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations;
    if (!t || !t[lang]) return;

    // Text & Link Update
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];
        if (val) {
            if (el.tagName === 'A' || key.includes('url')) { el.href = val; } 
            else { el.innerHTML = val; }
        }
    });

    // Language Toggle Button Text
    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'hi') ? 'Eng / हिंदी' : 'हिंदी / Eng';

    // ✅ SAFE CALL: Agar script.js load hai, to form logic update karo
    if (typeof window.syncWithTranslation === 'function') {
        window.syncWithTranslation();
    }
};

window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'hi';
    localStorage.setItem('preferredLang', current === 'hi' ? 'en' : 'hi');
    location.reload(); 
};

document.addEventListener('DOMContentLoaded', loadLayout);

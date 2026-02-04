// 1. Translation Function (Ab ye Har Waqt Ready Hai)
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const t = window.translations;
    
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) {
            el.innerHTML = t[lang][key];
        }
    });

    // Language button text update
    const btnText = document.getElementById('lang-text');
    if (btnText) {
        btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    }
};

// 2. Main Layout Loader
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            // 🚩 SBSE ZAROORI: Header aate hi translation chala do!
            window.updateUI();

            // --- Mobile Menu Logic ---
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if (menuBtn && drawer) {
                menuBtn.onclick = () => {
                    drawer.style.right = '0';
                    overlay.style.display = 'block';
                };
                const hideMenu = () => {
                    drawer.style.right = '-280px';
                    overlay.style.display = 'none';
                };
                if (closeBtn) closeBtn.onclick = hideMenu;
                if (overlay) overlay.onclick = hideMenu;
            }
        }
    } catch (e) {
        console.log("Layout error:", e);
    }
}

// 3. Language Switch (Ab Refresh ke saath Change bhi hoga)
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

// Start the show
document.addEventListener('DOMContentLoaded', loadLayout);
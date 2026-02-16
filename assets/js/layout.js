// 1. Translation Function (Handles Texts & Links)
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations;
    
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];

        if (val) {
            // Agar key 'event_url' hai, toh href (link) badlo
            if (key === 'event_url') {
                el.href = val;
            } else {
                // Baki sab ke liye text badlo
                el.innerHTML = val;
            }
        }
    });

    // Language button text update
    const btnText = document.getElementById('lang-text');
    if (btnText) {
        btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    }
};

// 2. Main Layout Loader (Header, Footer & Menu)
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            // UI Update: Sabse pehle translations apply karein
            setTimeout(() => { window.updateUI(); }, 100);

            // Mobile Menu Elements
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if (menuBtn && drawer) {
                menuBtn.onclick = () => {
                    drawer.style.right = '0';
                    if (overlay) overlay.style.display = 'block';
                };
                
                const hideMenu = () => {
                    drawer.style.right = '-280px';
                    if (overlay) overlay.style.display = 'none';
                };

                if (closeBtn) closeBtn.onclick = hideMenu;
                if (overlay) overlay.onclick = hideMenu;
            }
        }
    } catch (e) {
        console.log("Layout loading error:", e);
    }
}

// 3. Language Switch Function
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'hi';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

// Initial Load
document.addEventListener('DOMContentLoaded', loadLayout);

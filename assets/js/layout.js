// 1. Translation Function (Ab ye Links bhi handle karega)
window.updateUI = function() {
    // [cite: 2026-02-06, 2026-02-10] context se pata hai ki aap preferredLang use kar rahe hain
    const lang = localStorage.getItem('preferredLang') || 'hi'; 
    const t = window.translations;
    
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) {
            // AGAR KEY LINK HAI (event_url), TO HREF BADLO
            if (key === 'event_url') {
                el.href = t[lang][key];
            } else {
                // BAKI SAB KE LIYE TEXT BADLO
                el.innerHTML = t[lang][key];
            }
        }
    });

    // Language button text update
    const btnText = document.getElementById('lang-text');
    if (btnText) {
        btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    }
};

// 2. Main Layout Loader (Isme koi badlav nahi, ye perfect hai)
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            window.updateUI();

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

// 3. Language Switch
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'hi';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

document.addEventListener('DOMContentLoaded', loadLayout);

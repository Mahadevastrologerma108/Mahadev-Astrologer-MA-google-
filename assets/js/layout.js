// 1. UI UPDATE FUNCTION (Sabse Important)
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const t = window.translations;
    
    if (!t || !t[lang]) return;

    // Har us element ko dhundho jisme data-key hai
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) {
            // Stability Check: Sirf tabhi badlo jab zarurat ho
            if (el.innerHTML !== t[lang][key]) {
                el.innerHTML = t[lang][key];
            }
        }
    });

    // Language switch button text update
    const btnText = document.getElementById('lang-text');
    if (btnText) {
        btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    }
};

// 2. TOGGLE FUNCTION (Button click ke liye)
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    window.updateUI();
};

// 3. LAYOUT LOADER (Header/Footer + Mobile Menu)
async function loadLayout() {
    try {
        const [hResp, fResp] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            
            // Layout load hote hi bhasha set karo
            window.updateUI();

            // --- MOBILE MENU LOGIC (Open/Close) ---
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if (menuBtn && drawer) {
                menuBtn.onclick = () => {
                    drawer.style.right = '0';
                    overlay.style.display = 'block';
                };

                const hide = () => {
                    drawer.style.right = '-280px';
                    overlay.style.display = 'none';
                };

                if (closeBtn) closeBtn.onclick = hide;
                if (overlay) overlay.onclick = hide;
            }
        }
    } catch (e) {
        console.error("Layout Load Error:", e);
    }
}

// 4. EXECUTION & AUTO-WATCH (For Home Page Cards)
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();

    // 🚩 Ye hissa Home Page ke Firebase cards ko auto-translate karega
    const observer = new MutationObserver(() => {
        window.updateUI();
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
});
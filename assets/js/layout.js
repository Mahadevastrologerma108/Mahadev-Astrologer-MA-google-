// 1. Bhasha badalne ka logic (Sabse pehle)
window.updateUI = function() {
    let lang = localStorage.getItem('preferredLang') || 'en';
    let t = window.translations;
    
    if (t && t[lang]) {
        // Poore page par jahan bhi data-key hai, unhe badlo
        document.querySelectorAll('[data-key]').forEach(el => {
            let key = el.getAttribute('data-key');
            if (t[lang][key]) {
                el.innerHTML = t[lang][key];
            }
        });

        // Button ka text badlo (Hindi / Eng)
        let btnText = document.getElementById('lang-text');
        if (btnText) {
            btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
        }
    }
};

// 2. Button click karne par kya hoga
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    window.updateUI(); // Turant bhasha badlo
};

// 3. Header aur Footer load karne ka main kaam
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            
            // Header aane ke baad bhasha set karo
            window.updateUI();

            // --- 🔱 MOBILE MENU (Hamburger) FIX ---
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if (menuBtn && drawer) {
                // Menu kholna
                menuBtn.onclick = () => {
                    drawer.style.right = '0';
                    overlay.style.display = 'block';
                };

                // Menu band karna (X par click ya bahar click)
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

// 4. Page khulte hi sab shuru karo
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    // Cards ke liye thodi der baad ek baar fir se bhasha check karo
    setTimeout(window.updateUI, 500);
});
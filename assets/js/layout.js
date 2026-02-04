// --- 🔱 MAHADEV ASTROLOGER: GLOBAL TRANSLATION LOGIC ---
let currentLang = localStorage.getItem('preferredLang') || 'en';

window.updateUI = function() {
    // 🚩 translations.js ko global window se pakadna
    const t = window.translations;
    if (!t) return;

    // Poore page par jahan bhi data-key hai, sabko badlo
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (t[currentLang] && t[currentLang][key]) {
            if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
                elem.placeholder = t[currentLang][key];
            } else {
                elem.innerHTML = t[currentLang][key];
            }
        }
    });
    document.documentElement.lang = currentLang;
};

window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('preferredLang', currentLang);
    window.updateUI();
};

// --- 🔱 LOAD LAYOUT FUNCTION (HEADER/FOOTER) ---
async function loadLayout() {
    try {
        const [hResp, fResp] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);

        if (!hResp.ok || !fResp.ok) throw new Error("Header or Footer missing!");

        document.getElementById('header-placeholder').innerHTML = await hResp.text();
        document.getElementById('footer-placeholder').innerHTML = await fResp.text();

        // 🚩 Header/Footer aane ke turant baad unhe translate karo
        window.updateUI();

        // Mobile Menu Logic
        const initMenu = () => {
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if(menuBtn && drawer) {
                menuBtn.onclick = (e) => { 
                    e.preventDefault();
                    drawer.style.right = '0'; 
                    overlay.style.display = 'block'; 
                };
                const hide = () => { 
                    drawer.style.right = '-280px'; 
                    overlay.style.display = 'none'; 
                };
                if(closeBtn) closeBtn.onclick = hide;
                if(overlay) overlay.onclick = hide;
            }
        };
        initMenu();

    } catch (e) { 
        console.error("Layout Load Error:", e); 
    }
}

// 🚩 Sabse pehle layout load karo aur page translate karo
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    window.updateUI(); // Isse aapke Panchang/Horoscope cards turant translate honge
});
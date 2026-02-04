// --- 🔱 MAHADEV ASTROLOGER: FINAL SIMPLE SYNC ---
let currentLang = localStorage.getItem('preferredLang') || 'en';

window.updateUI = function() {
    const t = window.translations;
    if (!t) return;

    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (t[currentLang] && t[currentLang][key]) {
            elem.innerHTML = t[currentLang][key];
        }
    });
};

window.toggleLanguage = function() {
    currentLang = (currentLang === 'en') ? 'hi' : 'en';
    localStorage.setItem('preferredLang', currentLang);
    window.updateUI();
};

async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            
            // Header aane ke baad bhasha set karo
            window.updateUI();

            // Mobile Menu Logic (Wahi purana wala)
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            if(menuBtn) {
                menuBtn.onclick = () => { drawer.style.right = '0'; overlay.style.display = 'block'; };
                const hide = () => { drawer.style.right = '-280px'; overlay.style.display = 'none'; };
                document.getElementById('close-menu').onclick = hide;
                overlay.onclick = hide;
            }
        }
    } catch (e) { console.log(e); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    window.updateUI();
});
// 1. Simple Language Toggle
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); // 🚩 Sabse safe: Page reload kar do, tension hi khatam!
};

// 2. Simple UI Update
window.updateUI = function() {
    let lang = localStorage.getItem('preferredLang') || 'en';
    let t = window.translations;
    if (t && t[lang]) {
        document.querySelectorAll('[data-key]').forEach(el => {
            let key = el.getAttribute('data-key');
            if (t[lang][key]) el.innerHTML = t[lang][key];
        });
    }
};

// 3. Main Layout Loader (Your Original Logic)
async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');
        if (!hResp.ok || !fResp.ok) return;

        document.getElementById('header-placeholder').innerHTML = await hResp.text();
        document.getElementById('footer-placeholder').innerHTML = await fResp.text();

        // Translation trigger
        window.updateUI();

        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu');
        const drawer = document.getElementById('nav-drawer');
        const overlay = document.getElementById('menu-overlay');
        if (menuBtn && drawer) {
            menuBtn.onclick = () => { drawer.style.right = '0'; overlay.style.display = 'block'; };
            const hide = () => { drawer.style.right = '-280px'; overlay.style.display = 'none'; };
            document.getElementById('close-menu').onclick = hide;
            overlay.onclick = hide;
        }
    } catch (e) { console.error("Layout Error:", e); }
}

document.addEventListener('DOMContentLoaded', loadLayout);
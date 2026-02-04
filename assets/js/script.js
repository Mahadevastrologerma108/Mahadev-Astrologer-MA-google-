window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const t = window.translations;
    if (!t || !t[lang]) return;

    // 1. Saare normal text badlo (h1, p, span, a)
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) {
            el.innerHTML = t[lang][key];
        }
    });

    // 2. Form ke Placeholders badlo (Jaise: Aapka Naam, City, etc.)
    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (t[lang][key]) {
            el.placeholder = t[lang][key];
        }
    });

    // 3. Language button ka text (Eng / हिंदी)
    const btnText = document.getElementById('lang-text');
    if (btnText) {
        btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    }
};

async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            // 🔱 Header aate hi translation trigger karo
            window.updateUI();

            // Mobile Menu Logic
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            if (menuBtn && drawer) {
                menuBtn.onclick = () => { drawer.style.right = '0'; overlay.style.display = 'block'; };
                const hide = () => { drawer.style.right = '-280px'; overlay.style.display = 'none'; };
                if (document.getElementById('close-menu')) document.getElementById('close-menu').onclick = hide;
                if (overlay) overlay.onclick = hide;
            }
        }
    } catch (e) { console.log("Layout error:", e); }
}

window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

document.addEventListener('DOMContentLoaded', loadLayout);
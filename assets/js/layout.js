// --- 1. SMART LAYOUT LOADING ---
async function loadLayout() {
    // Detect folder depth for GitHub Pages fix
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || 
                           path.includes('/latest-guide/') || 
                           path.includes('/pages/');
    
    const prefix = isInsideFolder ? '../' : '';

    try {
        const [hResp, fResp] = await Promise.all([
            fetch(prefix + 'header.html'),
            fetch(prefix + 'footer.html')
        ]);

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            
            initMenu(); // Re-bind menu events
            window.updateUI(); // Apply translations
            fixAllLinks(prefix); // Adjust links for subfolders
        }
    } catch (e) { console.error("Layout failed to load:", e); }
}

function fixAllLinks(prefix) {
    document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            link.href = prefix + href;
        }
    });
}

function initMenu() {
    const menuBtn = document.getElementById('mobile-menu');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    if (menuBtn && drawer) {
        menuBtn.onclick = () => { 
            drawer.style.right = '0'; 
            if(overlay) overlay.style.display = 'block'; 
        };
        const hideMenu = () => { 
            drawer.style.right = '-280px'; 
            if(overlay) overlay.style.display = 'none'; 
        };
        if (closeBtn) closeBtn.onclick = hideMenu;
        if (overlay) overlay.onclick = hideMenu;
    }
}

// --- 2. TRANSLATION & UI SYNC ---
window.updateUI = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = window.translations;
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];
        if (val) {
            if (el.tagName === 'A' && !key.includes('nav')) { el.href = val; } 
            else { el.innerHTML = val; }
        }
    });

    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
};

window.toggleLanguage = function() {
    let current = localStorage.getItem('selectedLang') || 'hi';
    localStorage.setItem('selectedLang', current === 'hi' ? 'en' : 'hi');
    location.reload(); 
};

document.addEventListener('DOMContentLoaded', loadLayout);

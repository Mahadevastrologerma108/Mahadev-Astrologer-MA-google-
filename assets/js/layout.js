/**
 * MAHADEV ASTROLOGER MA - Master Layout Engine
 * Handles: Header/Footer, Folder Depth, Translation, & Feedback UI
 */

async function loadLayout() {
    const path = window.location.pathname;

    // 🔱 Folder depth detection for GitHub Pages (Products folder added)
    const isInsideFolder = path.includes('/panchang/') || 
                           path.includes('/latest-guide/') || 
                           path.includes('/pages/') || 
                           path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') ||
                           path.includes('/tools/') ||
                           path.includes('/products/');                            
    const prefix = isInsideFolder ? '../' : '';
    try {
        const [hResp, fResp] = await Promise.all([
            fetch(prefix + 'header.html'),
            fetch(prefix + 'footer.html')
        ]);

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            initMenu(); 
            if (window.updateUI) window.updateUI(); 
            fixAllLinks(prefix); 
        } else {
             console.log("Files fetch nahi hui. Status:", hResp.status, fResp.status);
        }
    } catch (e) { console.error("Layout failed to load:", e); }
}

function fixAllLinks(prefix) {
    document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(link => {
        const href = link.getAttribute('href');
        // Ignore absolute links (http) and anchor links (#)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Remove leading slash if it exists to avoid double slashes
            let cleanHref = href.startsWith('/') ? href.substring(1) : href;
            link.href = prefix + cleanHref;
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

    // Translate Text & Links
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];
        if (val) {
            if (el.tagName === 'A' && !key.includes('nav')) { el.href = val; } 
            else { el.innerHTML = val; }
        }
    });

    // 🔱 Safe Addition: Translate Placeholders (For Feedback Box)
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-placeholder-key');
        const val = t[lang][key];
        if (val) el.placeholder = val;
    });

    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
};

window.toggleLanguage = function() {
    let current = localStorage.getItem('selectedLang') || 'hi';
    localStorage.setItem('selectedLang', current === 'hi' ? 'en' : 'hi');
    location.reload(); 
};

// --- 🔱 3. FEEDBACK STARS LOGIC (SAFE EVENT DELEGATION) ---
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const val = e.target.getAttribute('data-value');
        window.selectedRating = val; 

        document.querySelectorAll('.star').forEach(s => {
            const sVal = s.getAttribute('data-value');
            s.style.color = sVal <= val ? '#f5c542' : '#888';
            s.innerText = sVal <= val ? '★' : '☆';
        });
    }
});
document.addEventListener('DOMContentLoaded', loadLayout);

// 🔱 Global Favicon Injector
(function injectFavicon() {
    // Pehle check karo ki kahin Favicon pehle se toh nahi laga
    let link = document.querySelector("link[rel~='icon']");
    
    // Agar nahi laga, toh naya banao
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        document.head.appendChild(link);
    }
    
    // Icon ka sahi path set karo (Root se uthayega)
    link.href = '/assets/images/logo.png';
})();

// 🔱 Automatic Bot Injector (Sabhi 38 Pages ke liye ek sath)
(function() {
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js'; // Bot ki file ka path
    botScript.async = true;
    document.body.appendChild(botScript);
    
    console.log("🔱 Mahadev Bot Injected Globally!");
})();

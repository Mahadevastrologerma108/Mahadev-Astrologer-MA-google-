/**
 * MAHADEV ASTROLOGER MA - Master Layout & Sequence Engine
 * Handles: Blocking Load, Header/Footer, Translation, Stars, Favicon & Bot
 */

(function() {
    // 1. Flicker rokne ke liye Page hide karo
   

    // 2. Folder depth detection logic
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') ||
                           path.includes('/products/');
    const prefix = isInsideFolder ? '../' : '';

    // 🔱 MAIN INITIALIZER
    window.initMahadevApp = async function() {
        try {
            // Check: Kya translation files (Common aur Page) load ho chuki hain?
            if (window.commonTranslations && window.pageTranslations) {
                
                // A. MERGE DATA
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // B. LOAD LAYOUT (Header/Footer)
                const [hResp, fResp] = await Promise.all([
                    fetch(prefix + 'header.html'),
                    fetch(prefix + 'footer.html')
                ]);

                if (hResp.ok && fResp.ok) {
                    const headerHTML = await hResp.text();
                    const footerHTML = await fResp.text();

                    // C. Injections (Body ka wait karke)
                    const checkBody = setInterval(() => {
                        if (document.body) {
                            clearInterval(checkBody);
                            
                            // HTML Inject karo
                            const hPlace = document.getElementById('header-placeholder');
                            const fPlace = document.getElementById('footer-placeholder');
                            if(hPlace) hPlace.innerHTML = headerHTML;
                            if(fPlace) fPlace.innerHTML = footerHTML;

                            // UI Sync & Link Fixes
                            initMenu();
                            fixAllLinks(prefix);
                            window.updateUI();
                            
                            // FINAL STEP: Reveal Page
                            document.documentElement.style.visibility = 'visible';
                            console.log("🔱 MAHADEV ASTROLOGER MA: Sequence Complete.");
                        }
                    }, 10);
                }
            } else {
                // Retry fast (30ms) if data is missing
                setTimeout(initMahadevApp, 30);
            }
        } catch (e) {
            console.error("🔱 Boot Error:", e);
            document.documentElement.style.visibility = 'visible';
        }
    };

    // Trigger on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', initMahadevApp);
})();

// --- 🔱 1. HELPER FUNCTIONS ---

function fixAllLinks(prefix) {
    document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
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

// --- 🔱 2. TRANSLATION & UI SYNC ---
window.updateUI = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = window.translations;
    if (!t || !t[lang]) return;

    // Text & Link Translation
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];
        if (val) {
            if (el.tagName === 'A' && !key.includes('nav')) { el.href = val; } 
            else { el.innerHTML = val; }
        }
    });

    // Placeholders
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

// --- 🔱 3. FEEDBACK STARS ---
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

// --- 🔱 4. AUTO INJECTORS (Global) ---

(function injectFavicon() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon'; link.type = 'image/png';
        document.head.appendChild(link);
    }
    link.href = '/assets/images/logo.png';
})();

(function injectBot() {
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js';
    botScript.async = true;
    document.body.appendChild(botScript);
})();

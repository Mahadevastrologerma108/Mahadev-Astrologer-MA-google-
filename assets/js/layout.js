/**
 * MAHADEV ASTROLOGER MA - Bulletproof Layout Engine
 */

(function() {
    // 1. Path detection (GitHub Pages friendly)
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length;
    
    // Agar domain ke baad 1 se zyada slash hain (folder ke andar), toh ../ lagao
    // Example: /index.html (1 slash) vs /panchang/today.html (2 slashes)
    const prefix = (depth > 1) ? '../' : '';

    window.initMahadevApp = async function() {
        // Safety Fallback: Agar kuch load na ho, toh 3s baad site dikha do
        const safety = setTimeout(() => {
            if (document.documentElement.style.visibility === 'hidden') {
                document.documentElement.style.visibility = 'visible';
                console.warn("🔱 Safety Reveal Triggered");
            }
        }, 3000);

        try {
            // Check Data: window.commonTranslations (translations.js) & window.pageTranslations (HTML)
            if (window.commonTranslations && window.pageTranslations) {
                
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // Fetch Layout
                const [hResp, fResp] = await Promise.all([
                    fetch(prefix + 'header.html').catch(() => ({ ok: false })),
                    fetch(prefix + 'footer.html').catch(() => ({ ok: false }))
                ]);

                if (hResp.ok && fResp.ok) {
                    const headerHTML = await hResp.text();
                    const footerHTML = await fResp.text();

                    const checkBody = setInterval(() => {
                        if (document.body) {
                            clearInterval(checkBody);
                            clearTimeout(safety);

                            const hPlace = document.getElementById('header-placeholder');
                            const fPlace = document.getElementById('footer-placeholder');
                            
                            if(hPlace) hPlace.innerHTML = headerHTML;
                            if(fPlace) fPlace.innerHTML = footerHTML;

                            initMenu();
                            fixAllLinks(prefix);
                            window.updateUI();
                            
                            document.documentElement.style.visibility = 'visible';
                            console.log("🔱 MAHADEV Engine: Success");
                        }
                    }, 50);
                } else {
                    // Agar fetch fail ho jaye (404), toh kam se kam page dikha do
                    document.documentElement.style.visibility = 'visible';
                    console.error("🔱 Fetch failed - Header/Footer paths might be wrong");
                }
            } else {
                // Retry fast
                setTimeout(initMahadevApp, 50);
            }
        } catch (e) {
            console.error("🔱 Engine Error:", e);
            document.documentElement.style.visibility = 'visible';
        }
    };

    window.addEventListener('DOMContentLoaded', initMahadevApp);
})();

// --- Support Functions (Fix All Links & Menu) ---
function fixAllLinks(prefix) {
    document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Remove leading slash to make it relative
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
        menuBtn.onclick = () => { drawer.style.right = '0'; if(overlay) overlay.style.display = 'block'; };
        const hideMenu = () => { drawer.style.right = '-280px'; if(overlay) overlay.style.display = 'none'; };
        if (closeBtn) closeBtn.onclick = hideMenu;
        if (overlay) overlay.onclick = hideMenu;
    }
}

window.updateUI = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = window.translations;
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const val = t[lang][key];
        if (val) {
            if (el.tagName === 'A' && !key.includes('nav')) el.href = val;
            else el.innerHTML = val;
        }
    });
    
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

// --- Injectors ---
(function() {
    // Favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link'); link.rel = 'icon'; link.type = 'image/png';
        document.head.appendChild(link);
    }
    link.href = 'https://res.cloudinary.com/dya3yxgch/image/upload/v1769705192/logo_bdmvwv.png';

    // Bot
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js';
    botScript.async = true;
    window.addEventListener('load', () => { if(document.body) document.body.appendChild(botScript); });
})();

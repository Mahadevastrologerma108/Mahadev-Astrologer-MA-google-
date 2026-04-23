/**
 * MAHADEV ASTROLOGER MA - Master Layout & Sequence Engine
 * Handles: Auto-Merge, Header/Footer, Translation, Stars, Favicon (Cloudinary) & Bot
 */

(function() {
    // 🔱 1. Path aur Prefix Logic
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') ||
                           path.includes('/products/');
    const prefix = isInsideFolder ? '../' : '';

    // 🔱 2. MAIN INITIALIZER
    window.initMahadevApp = async function() {
        try {
            // Check: Kya translations load huye?
            if (window.commonTranslations && window.pageTranslations) {
                
                // 🔄 Smart Merge
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // 🏗️ LOAD LAYOUT
                const [hResp, fResp] = await Promise.all([
                    fetch(prefix + 'header.html'),
                    fetch(prefix + 'footer.html')
                ]);

                if (hResp.ok && fResp.ok) {
                    const headerHTML = await hResp.text();
                    const footerHTML = await fResp.text();

                    const checkBody = setInterval(() => {
                        if (document.body) {
                            clearInterval(checkBody);
                            
                            const hPlace = document.getElementById('header-placeholder');
                            const fPlace = document.getElementById('footer-placeholder');
                            if(hPlace) hPlace.innerHTML = headerHTML;
                            if(fPlace) fPlace.innerHTML = footerHTML;

                            initMenu();
                            fixAllLinks(prefix);
                            window.updateUI();
                            console.log("🔱 MAHADEV ASTROLOGER MA: Cloudinary Logo & Data Synced.");
                        }
                    }, 50);
                }
            } else {
                setTimeout(initMahadevApp, 50);
            }
        } catch (e) {
            console.error("🔱 Engine Error:", e);
        }
    };

    window.addEventListener('DOMContentLoaded', initMahadevApp);
})();

// --- 🔱 3. HELPER FUNCTIONS ---

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

// --- 🔱 4. TRANSLATION ENGINE ---
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

// --- 🔱 5. AUTO INJECTORS (Logo & Bot) ---
(function() {
    // 🚀 Cloudinary Favicon Injector
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon'; 
        link.type = 'image/png';
        document.head.appendChild(link);
    }
    link.href = 'https://res.cloudinary.com/dya3yxgch/image/upload/v1769705192/logo_bdmvwv.png';

    // 🚀 Bot Injection
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js';
    botScript.async = true;
    window.addEventListener('load', () => document.body.appendChild(botScript));

    // Stars Event Delegation
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
})();

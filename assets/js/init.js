/**
 * MAHADEV ASTROLOGER MA - Master Layout & Sequence Engine
 * Location: Head (Blocking Mode for Speed)
 */

(function() {
    // 1. Flicker rokne ke liye turant hide karo
    document.documentElement.style.visibility = 'hidden';

    // 2. Folder depth detection logic
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') ||
                           path.includes('/products/');
    const prefix = isInsideFolder ? '../' : '';

    // 🔱 MASTER LOAD FUNCTION
    window.initMahadevApp = async function() {
        // --- SAFETY FALLBACK ---
        // Agar 3 second tak page load nahi hua toh force-show kar do
        const safetyTimer = setTimeout(() => {
            if (document.documentElement.style.visibility === 'hidden') {
                document.documentElement.style.visibility = 'visible';
                console.warn("🔱 Safety Reveal: Data taking too long...");
            }
        }, 3000);

        try {
            // Check: Kya translations load huye?
            if (window.commonTranslations && window.pageTranslations) {
                
                // A. MERGE DATA
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // B. LOAD HEADER/FOOTER (Fetch)
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
                            clearTimeout(safetyTimer); // Clear safety fallback
                            
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
                    }, 50);
                }
            } else {
                // Retry fast (50ms) if data is missing
                setTimeout(initMahadevApp, 50);
            }
        } catch (e) {
            console.error("🔱 Layout Error:", e);
            document.documentElement.style.visibility = 'visible';
        }
    };

    // --- 🔱 HELPER FUNCTIONS ---

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

        const btnText = document.getElementById('lang-text');
        if (btnText) btnText.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    };

    window.toggleLanguage = function() {
        let current = localStorage.getItem('selectedLang') || 'hi';
        localStorage.setItem('selectedLang', current === 'hi' ? 'en' : 'hi');
        location.reload();
    };

    // DOM Ready Trigger
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initMahadevApp);
    } else {
        initMahadevApp();
    }

})();

// --- 🔱 AUTO INJECTORS ---
(function() {
    // Favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon'; link.type = 'image/png';
        document.head.appendChild(link);
    }
    link.href = '/assets/images/logo.png';

    // Bot
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js';
    botScript.async = true;
    document.body.appendChild(botScript);
})();/**
 * MAHADEV ASTROLOGER MA - Master Layout & Sequence Engine
 * Location: Head (Blocking Mode for Speed)
 */

(function() {
    // 1. Flicker rokne ke liye turant hide karo
    document.documentElement.style.visibility = 'hidden';

    // 2. Folder depth detection logic
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') ||
                           path.includes('/products/');
    const prefix = isInsideFolder ? '../' : '';

    // 🔱 MASTER LOAD FUNCTION
    window.initMahadevApp = async function() {
        // --- SAFETY FALLBACK ---
        // Agar 3 second tak page load nahi hua toh force-show kar do
        const safetyTimer = setTimeout(() => {
            if (document.documentElement.style.visibility === 'hidden') {
                document.documentElement.style.visibility = 'visible';
                console.warn("🔱 Safety Reveal: Data taking too long...");
            }
        }, 3000);

        try {
            // Check: Kya translations load huye?
            if (window.commonTranslations && window.pageTranslations) {
                
                // A. MERGE DATA
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // B. LOAD HEADER/FOOTER (Fetch)
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
                            clearTimeout(safetyTimer); // Clear safety fallback
                            
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
                    }, 50);
                }
            } else {
                // Retry fast (50ms) if data is missing
                setTimeout(initMahadevApp, 50);
            }
        } catch (e) {
            console.error("🔱 Layout Error:", e);
            document.documentElement.style.visibility = 'visible';
        }
    };

    // --- 🔱 HELPER FUNCTIONS ---

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

        const btnText = document.getElementById('lang-text');
        if (btnText) btnText.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    };

    window.toggleLanguage = function() {
        let current = localStorage.getItem('selectedLang') || 'hi';
        localStorage.setItem('selectedLang', current === 'hi' ? 'en' : 'hi');
        location.reload();
    };

    // DOM Ready Trigger
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initMahadevApp);
    } else {
        initMahadevApp();
    }

})();

// --- 🔱 AUTO INJECTORS ---
(function() {
    // Favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon'; link.type = 'image/png';
        document.head.appendChild(link);
    }
    link.href = '/assets/images/logo.png';

    // Bot
    const botScript = document.createElement('script');
    botScript.src = '/assets/js/bot.js';
    botScript.async = true;
    document.body.appendChild(botScript);
})();

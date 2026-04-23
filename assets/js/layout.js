/**
 * MAHADEV ASTROLOGER MA - Smart Master Engine
 * Logic: Index page ko direct common translations se load karta hai.
 */
(function() {
    document.documentElement.style.visibility = 'hidden';
    const path = window.location.pathname;
    const isIndexPage = path.endsWith('/') || path.endsWith('index.html') || path === '' || path.endsWith('.in');
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') ||
                           path.includes('/products/');
    const prefix = isInsideFolder ? '../' : '';

    window.initMahadevApp = async function() {
        try {
            const hasCommon = !!window.commonTranslations;
            const hasLocal = !!window.pageTranslations;

            if (hasCommon && (isIndexPage || hasLocal)) {
                const localEn = hasLocal ? window.pageTranslations.en : {};
                const localHi = hasLocal ? window.pageTranslations.hi : {};

                window.translations = {
                    en: { ...window.commonTranslations.en, ...localEn },
                    hi: { ...window.commonTranslations.hi, ...localHi }
                };

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
                            
                            document.documentElement.style.visibility = 'visible';
                        }
                    }, 30);
                }
            } else {
                setTimeout(initMahadevApp, 50);
            }
        } catch (e) {
            console.error("🔱 Engine Error:", e);
            document.documentElement.style.visibility = 'visible';
        }
    };

    function fixAllLinks(p) {
        document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                let clean = href.startsWith('/') ? href.substring(1) : href;
                link.href = p + clean;
            }
        });
    }

    function initMenu() {
        const btn = document.getElementById('mobile-menu');
        const drw = document.getElementById('nav-drawer');
        const ovr = document.getElementById('menu-overlay');
        if (btn && drw) {
            btn.onclick = () => { drw.style.right = '0'; if(ovr) ovr.style.display = 'block'; };
            const hide = () => { drw.style.right = '-280px'; if(ovr) ovr.style.display = 'none'; };
            document.querySelectorAll('#close-menu, #menu-overlay').forEach(el => el.onclick = hide);
        }
    }

    window.updateUI = function() {
        const lang = localStorage.getItem('selectedLang') || 'hi';
        const t = window.translations;
        if (!t || !t[lang]) return;

        document.querySelectorAll('[data-key]').forEach(el => {
            const val = t[lang][el.getAttribute('data-key')];
            if (val) {
                if (el.tagName === 'A' && !el.getAttribute('data-key').includes('nav')) el.href = val;
                else el.innerHTML = val;
            }
        });
        const btnTxt = document.getElementById('lang-text');
        if (btnTxt) btnTxt.innerText = (lang === 'hi') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    };

    window.toggleLanguage = function() {
        let curr = localStorage.getItem('selectedLang') || 'hi';
        localStorage.setItem('selectedLang', curr === 'hi' ? 'en' : 'hi');
        location.reload();
    };

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', initMahadevApp);
    else initMahadevApp();

    window.addEventListener('load', () => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.href = 'https://res.cloudinary.com/dya3yxgch/image/upload/v1769705192/logo_bdmvwv.png';
        const bot = document.createElement('script');
        bot.src = prefix + 'assets/js/bot.js';
        bot.async = true;
        if(document.body) document.body.appendChild(bot);
    });
})();
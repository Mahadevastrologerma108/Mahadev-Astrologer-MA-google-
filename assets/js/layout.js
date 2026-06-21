/**
 * MAHADEV ASTROLOGER MA - Fresh & Smart Master Engine
 * Logic: Supports all pages, No Black Screen, Auto-Bot Injection.
 */

(function() {
    // 1. Folder Depth Detection
    const path = window.location.pathname;
    const isInsideFolder = path.includes('/panchang/') || path.includes('/latest-guide/') || 
                           path.includes('/pages/') || path.includes('/horoscope/') ||
                           path.includes('/masterstroke-module/') || path.includes('/tools/') || 
                           path.includes('/products/') || path.includes('/vastu/') ||  
                           path.includes('/swapna-fal/') || path.includes('/mantra-shloka/');
    
    const prefix = isInsideFolder ? '../' : '';
    let retryCount = 0; // Infinite loop se bachne ke liye

    // 🔱 MASTER INITIALIZER
    window.initMahadevApp = async function() {
        try {
            const hasCommon = !!window.commonTranslations;
            const hasLocal = !!window.pageTranslations;

            // SMART LOGIC: Wait for translations (Max 2 seconds/40 retries)
            if (!hasCommon) {
                if (retryCount < 40) {
                    retryCount++;
                    setTimeout(initMahadevApp, 50);
                    return;
                } else {
                    console.warn("🔱 Translation load timeout. Proceeding with layout only.");
                }
            }

            // Merge Logic
            const localEn = hasLocal ? window.pageTranslations.en : {};
            const localHi = hasLocal ? window.pageTranslations.hi : {};

            if (hasCommon) {
                window.translations = {
                    en: { ...window.commonTranslations.en, ...localEn },
                    hi: { ...window.commonTranslations.hi, ...localHi }
                };
            }

            // Fetch Layout (Header/Footer)
            const [hResp, fResp] = await Promise.all([
                fetch(prefix + 'header.html').catch(() => ({ok: false})),
                fetch(prefix + 'footer.html').catch(() => ({ok: false}))
            ]);

            if (hResp.ok && fResp.ok) {
                const headerHTML = await hResp.text();
                const footerHTML = await fResp.text();

                const hPlace = document.getElementById('header-placeholder');
                const fPlace = document.getElementById('footer-placeholder');
                
                if (hPlace) hPlace.innerHTML = headerHTML;
                if (fPlace) fPlace.innerHTML = footerHTML;

                initMenu();
                fixAllLinks(prefix);
                window.updateUI(); // Header update
            }

            console.log("🔱 Engine: Layout & Translation Applied Successfully!");

        } catch (e) {
            console.error("🔱 Engine Error:", e);
        }
    };

    // --- 🔱 HELPER FUNCTIONS ---
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

        // Placeholder translation ke liye
        document.querySelectorAll('[data-placeholder-key]').forEach(el => {
            const val = t[lang][el.getAttribute('data-placeholder-key')];
            if (val) {
                el.placeholder = val;
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

    // --- 🔱 BOT INJECTOR & FAVICON (Runs after DOM is ready) ---
    function injectBotAndFavicon() {
        // Favicon
        let link = document.querySelector("link[rel~='icon']");
        if (!link) { 
            link = document.createElement('link'); 
            link.rel = 'icon'; 
            document.head.appendChild(link); 
        }
        link.href = 'https://res.cloudinary.com/dya3yxgch/image/upload/v1769705192/logo_bdmvwv.png';

        // Divine Bot HTML (with data-key for AdSense safety)
        if (!document.getElementById("divine-bot-container")) {
            const botHTML = `
            <div id="divine-bot-container">
                <div id="divine-chat-window" class="hidden">
                    <div class="chat-header">
                        <span class="chat-title">🔱 Mahadev Bot</span>
                        <span class="close-chat" onclick="toggleDivineBot()">✕</span>
                    </div>
                    <div class="chat-body" id="chat-body">
                        <div class="bot-msg" data-key="bot_welcome">Pranaam! I am Mahadev Astrologer MA's assistant. How can I help you with your Horoscope or queries?</div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Type your question..." data-placeholder-key="ph_bot_input" onkeypress="handleBotEnter(event)">
                        <button onclick="sendBotMessage()">➤</button>
                    </div>
                </div>
                <div id="floating-bot-btn" onclick="toggleDivineBot()">
                    <img src="https://res.cloudinary.com/dya3yxgch/image/upload/f_auto,q_auto,w_150/v1769705192/logo_bdmvwv.png" alt="Bot" class="bot-icon">
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', botHTML);
            
            // Bot JS Script load karna
            const botScript = document.createElement('script');
            botScript.src = prefix + 'assets/js/bot.js';
            botScript.async = true;
            document.body.appendChild(botScript);
            
            // Translate the newly injected bot
            window.updateUI();
            console.log("🔱 Divine Bot Injected Successfully!");
        }
    }

    // Execution
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            initMahadevApp().then(injectBotAndFavicon);
        });
    } else {
        initMahadevApp().then(injectBotAndFavicon);
    }

})();

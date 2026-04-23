/**
 * MAHADEV ASTROLOGER MA - Master Bootstrapper
 * Sabhi Common/Local CSS, JS aur Translations ko sequence mein load karta hai.
 */

(function() {
    // 1. Page ko turant hide karo (White/Dark screen flicker rokne ke liye)
    document.documentElement.style.visibility = 'hidden';

    window.initMahadevApp = async function() {
        try {
            // 2. CSS Load Check (Ensuring styles are ready)
            // Browser automatically handles CSS, but we wait for DOM.

            // 3. Translation Check (Ensuring both Common & Local data exists)
            if (window.commonTranslations && window.pageTranslations) {
                
                // --- MERGE LOGIC ---
                window.translations = {
                    en: { ...window.commonTranslations.en, ...window.pageTranslations.en },
                    hi: { ...window.commonTranslations.hi, ...window.pageTranslations.hi }
                };

                // 4. Language Selection Logic
                const currentLang = localStorage.getItem('selectedLang') || 'hi';
                
                // 5. Layout Engine Trigger (Header/Footer loading)
                if (window.loadLayout) {
                    await window.loadLayout(); 
                }

                // 6. UI Update (Applying translations to data-keys)
                if (window.updateUI) {
                    window.updateUI();
                }

                // 7. FINAL STEP: Page ko visible karo
                document.documentElement.style.visibility = 'visible';
                console.log("🔱 MAHADEV ASTROLOGER MA: Page Sequence Complete.");

            } else {
                // Data nahi mila toh retry (Max speed: 30ms)
                setTimeout(initMahadevApp, 30);
            }
        } catch (error) {
            console.error("🔱 Boot Error:", error);
            document.documentElement.style.visibility = 'visible'; // Safety fallback
        }
    };

    // DOM Ready hote hi process shuru karein
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initMahadevApp);
    } else {
        initMahadevApp();
    }
})();

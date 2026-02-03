/**
 * Mahadev Astrologer MA - Master Layout & Translation Engine
 * 1. Automatically loads translations.js
 * 2. Fetches Header/Footer
 * 3. Triggers Language Switch
 */

// --- STEP 1: AUTO-LOAD TRANSLATIONS ---
// Ye logic check karega ki translations.js page par hai ya nahi, agar nahi toh khud load kar lega.
if (!document.querySelector('script[src*="translations.js"]')) {
    const script = document.createElement('script');
    script.src = '/assets/js/translations.js';
    script.async = false; 
    document.head.appendChild(script);
}

async function loadLayout() {
    try {
        // --- STEP 2: FETCH HEADER & FOOTER ---
        const [hResp, fResp] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);

        if (!hResp.ok || !fResp.ok) throw new Error("Header/Footer missing");

        const headerHtml = await hResp.text();
        const footerHtml = await fResp.text();

        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // --- STEP 3: ACTIVATE TRANSLATION ---
        // Thoda delay dete hain taki HTML poori tarah render ho jaye
        setTimeout(() => {
            if (typeof updateUI === "function") {
                updateUI(); 
                console.log("Translation Engine Active 🔱");
            }
        }, 150);

        // --- STEP 4: MOBILE MENU LOGIC ---
        const menuBtn = document.getElementById('mobile-menu');
        const drawer = document.getElementById('nav-drawer');
        const overlay = document.getElementById('menu-overlay');
        const closeBtn = document.getElementById('close-menu');

        if(menuBtn && drawer) {
            menuBtn.onclick = () => { 
                drawer.style.right = '0'; 
                overlay.style.display = 'block'; 
            };
            const hide = () => { 
                drawer.style.right = '-280px'; 
                overlay.style.display = 'none'; 
            };
            if(closeBtn) closeBtn.onclick = hide;
            if(overlay) overlay.onclick = hide;
        }

    } catch (e) {
        console.error("Layout Engine Error 🔱:", e);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', loadLayout);
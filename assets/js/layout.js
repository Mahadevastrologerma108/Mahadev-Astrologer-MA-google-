async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();

            // --- 🔱 MOBILE MENU (Hamburger) LOGIC ---
            const menuBtn = document.getElementById('mobile-menu');
            const drawer = document.getElementById('nav-drawer');
            const overlay = document.getElementById('menu-overlay');
            const closeBtn = document.getElementById('close-menu');

            if (menuBtn && drawer) {
                // Menu kholna
                menuBtn.onclick = () => {
                    drawer.style.right = '0';
                    overlay.style.display = 'block';
                };

                // Menu band karna
                const hideMenu = () => {
                    drawer.style.right = '-280px';
                    overlay.style.display = 'none';
                };

                if (closeBtn) closeBtn.onclick = hideMenu;
                if (overlay) overlay.onclick = hideMenu;
            }
        }
    } catch (e) {
        console.log("Layout error:", e);
    }
}

// Bhasha badalne ka sabse simple logic (Sirf reload)
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

document.addEventListener('DOMContentLoaded', loadLayout);
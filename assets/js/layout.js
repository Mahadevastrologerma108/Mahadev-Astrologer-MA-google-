async function loadLayout() {
    try {
        const [hResp, fResp] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);

        if (!hResp.ok || !fResp.ok) throw new Error("Files missing");

        document.getElementById('header-placeholder').innerHTML = await hResp.text();
        document.getElementById('footer-placeholder').innerHTML = await fResp.text();

        // 🔱 Jab header load ho jaye, tab button activate karo
        if (typeof window.updateUI === "function") {
            window.updateUI();
        }

        // Mobile Menu Logic
        const menuBtn = document.getElementById('mobile-menu');
        const drawer = document.getElementById('nav-drawer');
        const overlay = document.getElementById('menu-overlay');
        const closeBtn = document.getElementById('close-menu');

        if(menuBtn && drawer) {
            menuBtn.onclick = () => { drawer.style.right = '0'; overlay.style.display = 'block'; };
            const hide = () => { drawer.style.right = '-280px'; overlay.style.display = 'none'; };
            if(closeBtn) closeBtn.onclick = hide;
            if(overlay) overlay.onclick = hide;
        }

    } catch (e) { console.error("Error:", e); }
}
document.addEventListener('DOMContentLoaded', loadLayout);
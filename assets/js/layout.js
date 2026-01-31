async function loadLayout() {
    try {
        // Fetch Header & Footer from root
        const [hResp, fResp] = await Promise.all([
            fetch('/header.html'),
            fetch('/footer.html')
        ]);

        const headerHtml = await hResp.text();
        const footerHtml = await fResp.text();

        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // Menu Logic setup
        const menuBtn = document.getElementById('mobile-menu');
        const drawer = document.getElementById('nav-drawer');
        const overlay = document.getElementById('menu-overlay');
        const closeBtn = document.getElementById('close-menu');

        if(menuBtn) {
            menuBtn.onclick = () => { drawer.style.right = '0'; overlay.style.display = 'block'; };
            const hide = () => { drawer.style.right = '-280px'; overlay.style.display = 'none'; };
            closeBtn.onclick = hide;
            overlay.onclick = hide;
        }
    } catch (e) {
        console.error("Layout Fetch Error 🔱:", e);
    }
}
document.addEventListener('DOMContentLoaded', loadLayout);
document.addEventListener("DOMContentLoaded", function() {
    const navUl = document.getElementById("main-nav-links");
    const footerLinksContainer = document.getElementById("footer-links-dynamic");
    
    // Path detection logic: Checks if we are in a subfolder
    const path = window.location.pathname;
    const isSub = path.includes('/panchang/') || path.includes('/latest-guide/') || path.includes('/pages/');
    const up = isSub ? "../" : "";

    // 1. Menu Links Configuration
    const menuLinks = [
        { name: "Home", url: "index.html" },
        { name: "Daily Horoscope", url: "horoscope.html" },
        { name: "Panchang 2026", url: "panchang/panchang.html" },
        { name: "Astrology Guides", url: "latest-guide/guides.html" }
    ];

    // 2. Footer Links Configuration
    const footerLinks = [
        { name: "About", url: "pages/about.html" },
        { name: "Privacy", url: "pages/privacy.html" },
        { name: "Disclaimer", url: "pages/disclaimer.html" },
        { name: "Terms", url: "pages/terms.html" }
    ];

    // Inject Hamburger Menu Links
    if(navUl) {
        navUl.innerHTML = menuLinks.map(link => 
            `<li style="margin-bottom:25px;"><a href="${up}${link.url}" style="color:white; text-decoration:none; font-family:'Poppins'; font-size:1.1rem;">${link.name}</a></li>`
        ).join('');
    }

    // Inject Footer Links
    if(footerLinksContainer) {
        footerLinksContainer.innerHTML = footerLinks.map(link => 
            `<a href="${up}${link.url}" style="color:var(--gold); text-decoration:none; margin:0 8px;">${link.name}</a>`
        ).join(' | ');
    }

    // --- Universal Hamburger Logic ---
    const mobileBtn = document.getElementById('mobile-menu');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    if(mobileBtn && drawer && overlay) {
        const toggle = (open) => {
            drawer.style.right = open ? "0" : "-100%";
            overlay.style.display = open ? "block" : "none";
        };
        mobileBtn.onclick = () => toggle(true);
        if(closeBtn) closeBtn.onclick = () => toggle(false);
        overlay.onclick = () => toggle(false);
    }
});

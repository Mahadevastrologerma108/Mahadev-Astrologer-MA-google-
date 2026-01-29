// layout.js - Header (Horoscope Style) + Footer (Index Style)
const headerHTML = `
<header class="main-header" style="position:fixed; top:0; width:100%; z-index:1000; background:rgba(10,10,20,0.98); border-bottom:1px solid rgba(245,197,66,0.2); height:70px;">
    <div style="display:flex; justify-content:space-between; align-items:center; padding:0 20px; height:100%; max-width:1200px; margin:0 auto;">
        <a href="HOME_URL" id="dynamic-logo-link" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
            <img src="LOGO_URL" style="height:45px;">
            <span class="gold-text title-font" style="font-size:1.1rem;">MAHADEV ASTROLOGER MA</span>
        </a>
        <div id="open-menu" style="cursor:pointer; color:var(--gold); font-size:1.8rem;">☰</div>
    </div>
</header>

<nav id="nav-drawer" style="position:fixed; right:-280px; top:0; height:100%; width:280px; background:#0f0f1f; transition:0.4s; z-index:1050; padding:20px; border-left:1px solid var(--gold);">
    <div id="close-menu" style="text-align:right; font-size:2.2rem; color:var(--gold); cursor:pointer;">&times;</div>
    <ul style="list-style:none; margin-top:40px; padding:0;">
        <li style="border-bottom:1px solid rgba(245,197,66,0.1);"><a href="HOME_URL" style="color:white; text-decoration:none; font-family:'Cinzel'; display:block; padding:15px 0;">Home</a></li>
        <li style="border-bottom:1px solid rgba(245,197,66,0.1);"><a href="HORO_URL" style="color:white; text-decoration:none; font-family:'Cinzel'; display:block; padding:15px 0;">Horoscope</a></li>
        <li><a href="PANCH_URL" style="color:white; text-decoration:none; font-family:'Cinzel'; display:block; padding:15px 0;">Panchang</a></li>
    </ul>
</nav>
<div id="menu-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1040;"></div>
`;

// Footer copied from your index.html
const footerHTML = `
<footer class="main-footer" style="text-align:center; padding:60px 20px; border-top:1px solid rgba(245,197,66,0.1); background:rgba(0,0,0,0.3); color:var(--gold); margin-top:50px;">
    <div style="max-width:1200px; margin:0 auto;">
        <h2 class="title-font" style="font-size:1.5rem; letter-spacing:2px; margin-bottom:15px;">MAHADEV ASTROLOGER MA</h2>
        <p style="font-family:'Poppins'; font-size:0.9rem; opacity:0.8; max-width:600px; margin:0 auto 30px;">
            Leading provider of Vedic Astrology, Vastu Consultancy, and Spiritual Guidance.
        </p>
        <p class="title-font" style="font-size:1.1rem; letter-spacing:3px;">JAI MAHAKAL 🙏</p>
        <div style="margin:25px 0; border-top:1px solid rgba(245,197,66,0.1); padding-top:20px;">
            <p style="font-size:0.75rem; opacity:0.5; font-family:'Poppins';">&copy; 2026 MAHADEV ASTROLOGER MA. All Rights Reserved.</p>
        </div>
    </div>
</footer>
`;

function injectLayout() {
    const isSub = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/panchang/');
    const prefix = isSub ? '../' : '';

    let finalHeader = headerHTML
        .replace(/HOME_URL/g, prefix + 'index.html')
        .replace(/HORO_URL/g, prefix + 'horoscope.html')
        .replace(/PANCH_URL/g, prefix + 'panchang/panchang.html')
        .replace(/LOGO_URL/g, prefix + 'assets/images/logo.png');

    document.body.insertAdjacentHTML('afterbegin', finalHeader);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Menu Logic
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');

    openBtn.onclick = () => { drawer.style.right = "0"; overlay.style.display = "block"; };
    const closeAll = () => { drawer.style.right = "-280px"; overlay.style.display = "none"; };
    closeBtn.onclick = closeAll; overlay.onclick = closeAll;
}

injectLayout();
// 🚩 1. Sabse pehle ye function define karo taaki error na aaye
window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); // 🚩 Sabse safe tarika: Page reload kar do bhasha ke liye
};

// 🚩 2. Header aur Footer load karne ka sabse simple function
async function loadLayout() {
    try {
        console.log("🔱 Layout loading started...");
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');

        if (hResp.ok && fResp.ok) {
            const hText = await hResp.text();
            const fText = await fResp.text();
            
            document.getElementById('header-placeholder').innerHTML = hText;
            document.getElementById('footer-placeholder').innerHTML = fText;
            
            console.log("🔱 Header/Footer injected!");

            // Mobile Menu Logic
            const menuBtn = document.getElementById('mobile-menu');
            if(menuBtn) {
                menuBtn.onclick = () => {
                    document.getElementById('nav-drawer').style.right = '0';
                    document.getElementById('menu-overlay').style.display = 'block';
                };
            }
        }
    } catch (err) {
        console.error("🔱 Layout Crash:", err);
    }
}

// 🚩 3. Execution
document.addEventListener('DOMContentLoaded', loadLayout);
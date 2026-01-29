// ==========================================
// 1. MOBILE MENU LOGIC
// ==========================================
const menuBtn = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu');
const navDrawer = document.getElementById('nav-drawer');
const overlay = document.getElementById('menu-overlay');

if(menuBtn) {
    menuBtn.onclick = () => {
        navDrawer.style.right = '0';
        overlay.style.display = 'block';
    };
}
const hideMenu = () => {
    if(navDrawer) navDrawer.style.right = '-100%';
    if(overlay) overlay.style.display = 'none';
};
if(closeBtn) closeBtn.onclick = hideMenu;
if(overlay) overlay.onclick = hideMenu;

// ==========================================
// 2. SMART FORM DISPLAY LOGIC
// ==========================================
const serviceSelect = document.getElementById('service-select');

if(serviceSelect) {
    serviceSelect.addEventListener('change', () => {
        const val = serviceSelect.value;
        const secSingle = document.getElementById('section-single');
        const secMatch = document.getElementById('section-matching');
        const secPalm = document.getElementById('section-palm');
        
        // Sections Toggle
        if(secSingle) secSingle.style.display = (val === 'kundli_matching') ? 'none' : 'block';
        if(secMatch) secMatch.style.display = (val === 'kundli_matching') ? 'block' : 'none';
        if(secPalm) secPalm.style.display = (val === 'palmistry' || val === 'combo_analysis') ? 'block' : 'none';
        
        // Numerology: Hide Time/Place
        const isNum = (val === 'numerology');
        const timeF = document.getElementById('single-time');
        const placeF = document.getElementById('single-place');
        if(timeF) timeF.style.display = isNum ? 'none' : 'block';
        if(placeF) placeF.style.display = isNum ? 'none' : 'block';
    });
}

// ==========================================
// 3. WHATSAPP MESSAGE GENERATOR (Helper Function)
// ==========================================
function sendWhatsApp(data) {
    const whatsappNum = "91XXXXXXXXXX"; // 🔥 APNA NUMBER DALEIN
    let msg = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n`;
    msg += `--------------------------\n`;
    msg += `✨ *Service:* ${data.service.replace('_', ' ').toUpperCase()}\n`;

    if (data.service === 'kundli_matching') {
        msg += `👦 *Male:* ${data.male.name} | ${data.male.dob}\n`;
        msg += `👧 *Female:* ${data.female.name} | ${data.female.dob}\n`;
    } else {
        msg += `👤 *Name:* ${data.client.name}\n`;
        msg += `📅 *DOB:* ${data.client.dob}\n`;
        if (data.service !== 'numerology') {
            msg += `📍 *Place:* ${data.client.place}\n`;
            msg += `⏰ *Time:* ${data.client.time}\n`;
        }
    }

    if (data.service === 'palmistry' || data.service === 'combo_analysis') {
        msg += `📸 *Photos:* Sending palm photos now...\n`;
    }

    msg += `--------------------------\n`;
    msg += `🙏 *Har Har Mahadev*`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsappNum}?text=${encodedMsg}`, '_blank');
}

// Note: Form Submission Firebase ke index.html wale script se control hoga.
// Bas usme end me sendWhatsApp(finalData) call kar dena.
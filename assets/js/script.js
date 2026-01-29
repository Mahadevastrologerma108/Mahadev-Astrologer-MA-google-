// ==========================================
// 1. MOBILE MENU LOGIC (Synced)
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
    navDrawer.style.right = '-100%';
    overlay.style.display = 'none';
};
if(closeBtn) closeBtn.onclick = hideMenu;
if(overlay) overlay.onclick = hideMenu;

// ==========================================
// 2. SMART FORM DISPLAY LOGIC (Matches your Type)
// ==========================================
function updateForm() {
    const service = document.getElementById('service-select').value;
    const secSingle = document.getElementById('section-single');
    const secMatching = document.getElementById('section-matching');
    const secPalm = document.getElementById('section-palm');
    const birthFields = document.getElementById('birth-fields');

    // Default: Sab hide karo aur Required hatao
    [secSingle, secMatching, secPalm].forEach(s => s.style.display = 'none');
    document.querySelectorAll('.input-field, #palm-pic').forEach(el => el.required = false);

    if (service === 'kundli_making') {
        secSingle.style.display = 'block';
        birthFields.style.display = 'block';
        ['user-name', 'single-dob', 'single-time', 'single-place'].forEach(id => document.getElementById(id).required = true);
    } 
    else if (service === 'kundli_matching') {
        secMatching.style.display = 'block';
        ['m-name', 'm-dob', 'm-time', 'm-place', 'f-name', 'f-dob', 'f-time', 'f-place'].forEach(id => document.getElementById(id).required = true);
    } 
    else if (service === 'palmistry') {
        secSingle.style.display = 'block';
        birthFields.style.display = 'none';
        secPalm.style.display = 'block';
        document.getElementById('user-name').required = true;
        document.getElementById('palm-pic').required = true;
    } 
    else if (service === 'numerology') {
        secSingle.style.display = 'block';
        birthFields.style.display = 'block';
        document.getElementById('user-name').required = true;
        document.getElementById('single-dob').required = true;
    } 
    else if (service === 'combo_analysis') {
        secSingle.style.display = 'block';
        secPalm.style.display = 'block';
        ['user-name', 'single-dob', 'single-time', 'single-place', 'palm-pic'].forEach(id => document.getElementById(id).required = true);
    }
}

// ==========================================
// 3. SUBMISSION LOGIC (WhatsApp/Telegram)
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const service = document.getElementById('service-select').value;
    const name = document.getElementById('user-name').value;
    // Note: Is logic me hum WhatsApp default maan rahe hain, aap radio button check bhi add kar sakte hain
    const method = 'whatsapp'; 
    
    let message = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n`;
    message += `--------------------------\n`;
    message += `✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n`;

    if (service === 'kundli_matching') {
        message += `👦 *Male:* ${document.getElementById('m-name').value} | ${document.getElementById('m-dob').value}\n`;
        message += `👧 *Female:* ${document.getElementById('f-name').value} | ${document.getElementById('f-dob').value}\n`;
    } else {
        message += `👤 *Name:* ${name}\n`;
        if (service !== 'palmistry') {
            message += `📅 *DOB:* ${document.getElementById('single-dob').value}\n`;
            message += `📍 *Place:* ${document.getElementById('single-place').value}\n`;
            message += `⏰ *Time:* ${document.getElementById('single-time').value}\n`;
        }
    }

    if (service === 'palmistry' || service === 'combo_analysis') {
        message += `📸 *Photos:* Sending palm photos now...\n`;
    }

    message += `--------------------------\n`;
    message += `🙏 *Har Har Mahadev*`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappNum = "91XXXXXXXXXX"; // Apna number yahan dalein

    window.open(`https://wa.me/${whatsappNum}?text=${encodedMsg}`, '_blank');
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', updateForm);
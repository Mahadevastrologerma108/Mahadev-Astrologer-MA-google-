// ==========================================
// 1. MOBILE MENU LOGIC
// ==========================================
const menuBtn = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu');
const navDrawer = document.getElementById('nav-drawer');
const overlay = document.getElementById('menu-overlay');

if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        navDrawer.classList.add('active');
        overlay.style.display = 'block';
    });
}
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        overlay.style.display = 'none';
    });
}
if(overlay) {
    overlay.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        overlay.style.display = 'none';
    });
}

// ==========================================
// 2. APPOINTMENT FORM DISPLAY LOGIC
// ==========================================
function updateForm() {
    const service = document.getElementById('service-select').value;
    const singleSection = document.getElementById('single-person-details');
    const makingExtra = document.getElementById('making-extra-fields');
    const matchingSection = document.getElementById('matching-details');
    const palmistrySection = document.getElementById('palmistry-details');

    singleSection.style.display = 'none';
    makingExtra.style.display = 'none';
    matchingSection.style.display = 'none';
    palmistrySection.style.display = 'none';

    if (service === 'kundli_making') {
        singleSection.style.display = 'block';
        makingExtra.style.display = 'block';
    } 
    else if (service === 'kundli_matching') {
        matchingSection.style.display = 'block';
    } 
    else if (service === 'palmistry') {
        palmistrySection.style.display = 'block';
    } 
    else if (service === 'numerology') {
        singleSection.style.display = 'block';
        makingExtra.style.display = 'none';
    }
    else if (service === 'combo_analysis') {
        singleSection.style.display = 'block';
        makingExtra.style.display = 'block';
        palmistrySection.style.display = 'block';
    }
}

// ==========================================
// 3. MULTI-CHANNEL SUBMISSION LOGIC
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const service = document.getElementById('service-select').value;
    const name = document.getElementById('user-name').value;
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    
    let message = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n`;
    message += `--------------------------\n`;
    message += `✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n`;
    message += `👤 *Client Name:* ${name}\n`;

    // LOGIC: Making, Numerology & COMBO (Birth Details)
    if (service === 'kundli_making' || service === 'numerology' || service === 'combo_analysis') {
        message += `📅 *DOB:* ${document.getElementById('single-dob').value}\n`;
        if (service === 'kundli_making' || service === 'combo_analysis') {
            message += `📍 *Place:* ${document.getElementById('single-place').value}\n`;
            message += `⏰ *Time:* ${document.getElementById('single-time').value}\n`;
        }
    }

    // LOGIC: Matching
    if (service === 'kundli_matching') {
        message += `\n👦 *MALE:* ${document.getElementById('male-dob').value} | ${document.getElementById('male-place').value}\n`;
        message += `👧 *FEMALE:* ${document.getElementById('female-dob').value} | ${document.getElementById('female-place').value}\n`;
    }

    // LOGIC: Palmistry & COMBO (Photo Instruction)
    if (service === 'palmistry' || service === 'combo_analysis') {
        message += `📸 *Photos:* Ready to send via ${method.toUpperCase()}\n`;
    }

    message += `--------------------------\n`;
    message += `🙏 *Har Har Mahadev*`;

    const encodedMsg = encodeURIComponent(message);

    if (method === 'whatsapp') {
        window.open(`https://wa.me/919999999999?text=${encodedMsg}`, '_blank');
    } 
    else if (method === 'telegram') {
        window.open(`https://t.me/YourUsername?text=${encodedMsg}`, '_blank');
    } 
    else if (method === 'email') {
        window.location.href = `mailto:contact@mahadevastro.com?subject=Consultation: ${name}&body=${encodedMsg}`;
    }
});
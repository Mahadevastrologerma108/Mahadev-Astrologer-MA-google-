// ==========================================
// 1. MOBILE MENU LOGIC (Open, Close & Overlay)
// ==========================================
const menuBtn = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu');
const navDrawer = document.getElementById('nav-drawer');
const overlay = document.getElementById('menu-overlay');

// Open Menu
if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        navDrawer.classList.add('active');
        overlay.style.display = 'block';
    });
}

// Close Menu (using X button)
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        overlay.style.display = 'none';
    });
}

// Close Menu (clicking outside on overlay)
if(overlay) {
    overlay.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        overlay.style.display = 'none';
    });
}

// ==========================================
// 2. APPOINTMENT FORM LOGIC (The Exact Rules)
// ==========================================
function updateForm() {
    const service = document.getElementById('service-select').value;
    
    const singleSection = document.getElementById('single-person-details');
    const makingExtra = document.getElementById('making-extra-fields');
    const matchingSection = document.getElementById('matching-details');
    const palmistrySection = document.getElementById('palmistry-details');

    // Default: Sab chupao (Reset)
    singleSection.style.display = 'none';
    makingExtra.style.display = 'none';
    matchingSection.style.display = 'none';
    palmistrySection.style.display = 'none';

    if (service === 'kundli_making') {
        singleSection.style.display = 'block'; // Name & DOB
        makingExtra.style.display = 'block';   // Place & Time (Mandatory)
    } 
    else if (service === 'kundli_matching') {
        matchingSection.style.display = 'block'; // Male & Female ki sab details
    } 
    else if (service === 'palmistry') {
        palmistrySection.style.display = 'block'; // Sirf Name aur Pic Instruction
    } 
    else if (service === 'numerology') {
        singleSection.style.display = 'block'; // Sirf Name aur DOB
        makingExtra.style.display = 'none';    // Time/Place gayab
    }
}

// ==========================================
// 3. MULTI-CHANNEL SUBMISSION LOGIC
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // --- 3.1 Basic Details ---
    const service = document.getElementById('service-select').value;
    const name = document.getElementById('user-name').value;
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    
    // --- 3.2 Dynamic Message Building ---
    let message = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n`;
    message += `--------------------------\n`;
    message += `✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n`;
    message += `👤 *Client Name:* ${name}\n`;

    // LOGIC: Kundali Making & Numerology
    if (service === 'kundli_making' || service === 'numerology') {
        message += `📅 *DOB:* ${document.getElementById('single-dob').value}\n`;
        if (service === 'kundli_making') {
            message += `📍 *Place:* ${document.getElementById('single-place').value}\n`;
            message += `⏰ *Time:* ${document.getElementById('single-time').value}\n`;
        }
    }

    // LOGIC: Kundali Matching
    else if (service === 'kundli_matching') {
        message += `\n👦 *MALE DETAILS:*\n`;
        message += `- DOB: ${document.getElementById('male-dob').value}\n`;
        message += `- Place: ${document.getElementById('male-place').value}\n`;
        message += `- Time: ${document.getElementById('male-time').value}\n`;
        
        message += `\n👧 *FEMALE DETAILS:*\n`;
        message += `- DOB: ${document.getElementById('female-dob').value}\n`;
        message += `- Place: ${document.getElementById('female-place').value}\n`;
        message += `- Time: ${document.getElementById('female-time').value}\n`;
    }

    // LOGIC: Palmistry
    else if (service === 'palmistry') {
        message += `📸 *Palmistry Request:* Photos are attached/ready to send.\n`;
    }

    message += `--------------------------\n`;
    message += `🙏 *Har Har Mahadev*`;

    // --- 3.3 Redirection Logic ---
    const encodedMsg = encodeURIComponent(message);

    if (method === 'whatsapp') {
        // Apna WhatsApp Number yahan daalein (Country code ke saath)
        window.open(`https://wa.me/919999999999?text=${encodedMsg}`, '_blank');
    } 
    else if (method === 'telegram') {
        // Apna Telegram Username yahan daalein
        window.open(`https://t.me/YourUsername?text=${encodedMsg}`, '_blank');
    } 
    else if (method === 'email') {
        // Apna Email yahan daalein
        window.location.href = `mailto:contact@mahadevastro.com?subject=Astrology Consultation: ${name}&body=${encodedMsg}`;
    }
});
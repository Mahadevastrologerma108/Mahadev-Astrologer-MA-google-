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
// 3. WHATSAPP SUBMISSION LOGIC
// ==========================================
document.getElementById('consultation-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mahadev! Aapki details submit ho gayi hain. WhatsApp par connect ho rahe hain...');
    // Yahan hum aage chalke WhatsApp API link add karenge
});
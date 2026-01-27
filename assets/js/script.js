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
// 2. APPOINTMENT FORM LOGIC (Dynamic Fields)
// ==========================================
function updateForm() {
    const service = document.getElementById('service-select').value;
    const commonFields = document.getElementById('common-dob');
    const kundliFields = document.getElementById('kundli-pair-fields');
    const palmistryFields = document.getElementById('palmistry-fields');

    // Reset: Sabse pehle sab kuch chupa do
    if (commonFields) commonFields.style.display = 'none';
    if (kundliFields) kundliFields.style.display = 'none';
    if (palmistryFields) palmistryFields.style.display = 'none';

    // Service ke hisab se sahi fields dikhao
    if (service === 'kundli_making' || service === 'numerology') {
        // Kundli Making aur Numerology dono mein single DOB/Time chahiye
        commonFields.style.display = 'block';
    } 
    else if (service === 'kundli_matching') {
        // Matching mein Male aur Female dono ki details dikhao
        kundliFields.style.display = 'block';
    } 
    else if (service === 'palmistry') {
        // Palmistry mein sirf photo upload aur instructions dikhao
        palmistryFields.style.display = 'block';
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
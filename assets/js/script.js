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
    const extraFields = document.getElementById('extra-fields');
    const palmistryFields = document.getElementById('palmistry-fields');

    // Default: Sab chupao
    extraFields.style.display = 'none';
    palmistryFields.style.display = 'none';

    // Service ke hisab se dikhao
    if (service === 'kundli') {
        extraFields.style.display = 'block';
    } else if (service === 'palmistry') {
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
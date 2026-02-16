// --- YOUR ORIGINAL FORM LOGIC (Safely Protected) ---

// 1. Placeholder Sync (WhatsApp/Email toggle)
window.syncContactMethod = function(type) {
    const input = document.getElementById('contact-detail');
    const warning = document.getElementById('email-warning');
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations[lang];

    if (!input) return;

    if (type === 'WA') {
        input.placeholder = t.ph_contact || "WhatsApp Number";
        if(warning) warning.style.display = "none";
    } else if (type === 'TG') {
        input.placeholder = "Telegram Username / Link";
        if(warning) warning.style.display = "none";
    } else if (type === 'EM') {
        input.placeholder = "Your Email Address";
        if(warning) warning.style.display = "block";
    }
};

// 2. Sections Toggle Logic (Kundli/Palmistry/Numerology)
window.applyFormLogic = function() {
    const svc = document.getElementById('service-select')?.value;
    const singleSec = document.getElementById('section-single');
    const matchingSec = document.getElementById('section-matching');
    const palmInst = document.getElementById('palm-instruction');
    const timePlaceGroup = document.getElementById('time-place-group');

    if (!svc) return;

    // Reset Defaults
    if(singleSec) singleSec.style.display = 'block';
    if(matchingSec) matchingSec.style.display = 'none';
    if(palmInst) palmInst.style.display = 'none';
    if(timePlaceGroup) timePlaceGroup.style.display = 'grid';

    // Custom Rules
    if (svc === 'kundli_matching') {
        if(singleSec) singleSec.style.display = 'none';
        if(matchingSec) matchingSec.style.display = 'block';
    } else if (svc === 'palmistry') {
        if(palmInst) palmInst.style.display = 'block';
    } else if (svc === 'numerology') {
        if(timePlaceGroup) timePlaceGroup.style.display = 'none';
    } else if (svc === 'combo_analysis') {
        if(palmInst) palmInst.style.display = 'block';
    }
};

// 3. Master Sync (Called by layout.js when language changes)
window.syncWithTranslation = function() {
    window.applyFormLogic();
    // Re-check contact method for placeholder translation
    const contactType = document.querySelector('input[name="contact_type"]:checked')?.value || 'WA';
    window.syncContactMethod(contactType);
};

// 4. Form Submission
document.getElementById('consultation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("🔱 Pranaam! Mahadev Astrologer MA will contact you soon.");
});

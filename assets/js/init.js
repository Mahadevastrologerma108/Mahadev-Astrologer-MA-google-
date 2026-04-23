/**
 * MAHADEV ASTROLOGER MA - Core Application Logic
 * Handles: Form Actions, Feedback System, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Form Setup
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        applyFormLogic(); 
    }

    // 2. Form Submit Listener
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', handleBookingSubmit);
    }

    // 3. Clean URL
    if (window.location.search.indexOf('m=1') > -1) {
        const clean_url = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, clean_url);
    }
});

// --- 🔱 1. FORM UI CONTROLLER ---
window.applyFormLogic = function() {
    const val = document.getElementById('service-select').value;
    const singleSec = document.getElementById('section-single');
    const matchSec = document.getElementById('section-matching');
    const palmNote = document.getElementById('palm-instruction');

    if(singleSec) singleSec.style.display = 'none';
    if(matchSec) matchSec.style.display = 'none';
    if(palmNote) palmNote.style.display = 'none';

    if (val === 'kundli_matching') {
        if(matchSec) matchSec.style.display = 'block';
    } else if (val === 'palmistry') {
        if(singleSec) singleSec.style.display = 'block';
        if(palmNote) palmNote.style.display = 'block';
    } else {
        if(singleSec) singleSec.style.display = 'block';
    }
};

window.syncContactMethod = function(method) {
    const contactInput = document.getElementById('contact-detail');
    const emailWarn = document.getElementById('email-warning');
    if (!contactInput) return;

    if (method === 'WA') {
        contactInput.placeholder = "WhatsApp Number";
        contactInput.type = "tel";
        if(emailWarn) emailWarn.style.display = 'none';
    } else if (method === 'TG') {
        contactInput.placeholder = "Telegram ID / Number";
        contactInput.type = "text";
        if(emailWarn) emailWarn.style.display = 'none';
    } else if (method === 'EM') {
        contactInput.placeholder = "Email Address";
        contactInput.type = "email";
        if(emailWarn) emailWarn.style.display = 'block';
    }
};

// --- 🔱 2. SUBMISSION HANDLERS ---
function handleBookingSubmit(e) {
    e.preventDefault();
    console.log("🔱 Form Validated. Processing...");
    if (window.processFirebaseBooking) {
        window.processFirebaseBooking();
    } else {
        const lang = localStorage.getItem('selectedLang') || 'hi';
        alert(lang === 'hi' ? "बुकिंग प्रोसेस हो रही है..." : "Processing booking...");
    }
}

// --- 🔱 3. FEEDBACK SYSTEM ---
window.selectedRating = 0;

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const val = e.target.getAttribute('data-value');
        window.selectedRating = parseInt(val); 
        document.querySelectorAll('.star').forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            s.style.color = sVal <= val ? '#f5c542' : '#888';
            s.innerText = sVal <= val ? '★' : '☆';
        });
    }
});

window.submitFeedback = function() {
    const feedbackBox = document.getElementById('user-feedback');
    const feedbackText = feedbackBox ? feedbackBox.value.trim() : "";
    const rating = window.selectedRating || 0;

    if (rating === 0) {
        const lang = localStorage.getItem('selectedLang') || 'hi';
        alert(lang === 'hi' ? "कृपया स्टार रेटिंग चुनें!" : "Please select a star rating!");
        return;
    }

    console.log("🔱 Feedback Ready:", { rating, feedbackText });
    if (window.saveFeedbackToFirebase) {
        window.saveFeedbackToFirebase(rating, feedbackText);
    } else {
        alert("Feedback Submitted! Thank you.");
        if(feedbackBox) feedbackBox.value = '';
        window.selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => {
            s.style.color = '#888';
            s.innerText = '☆';
        });
    }
};
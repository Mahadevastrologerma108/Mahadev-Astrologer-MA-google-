/**
 * MAHADEV ASTROLOGER MA - Core Application Logic
 * Handles: Form Actions, Feedback System, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Form Setup
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        applyFormLogic(); // Set default view on load
    }

    // 2. Form Submit Listener
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', handleBookingSubmit);
    }

    // 3. Clean URL (Blogger ka ?m=1 hatane ke liye)
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

    // Reset sab kuch hide karo pehle
    if(singleSec) singleSec.style.display = 'none';
    if(matchSec) matchSec.style.display = 'none';
    if(palmNote) palmNote.style.display = 'none';

    // Jo select hua hai, bas use dikhao
    if (val === 'kundli_matching') {
        if(matchSec) matchSec.style.display = 'block';
    } else if (val === 'palmistry') {
        if(singleSec) singleSec.style.display = 'block';
        if(palmNote) palmNote.style.display = 'block';
    } else {
        // Kundli, Numerology, Combo ke liye default
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
    
    // Agar Firebase handler connected hai, toh data wahan bhejo
    if (window.processFirebaseBooking) {
        window.processFirebaseBooking();
    } else {
        // Fallback alert (Testing ke liye)
        const lang = localStorage.getItem('selectedLang') || 'hi';
        const msg = lang === 'hi' ? "बुकिंग प्रोसेस हो रही है..." : "Processing booking...";
        alert(msg);
    }
}

// --- 🔱 3. FEEDBACK SYSTEM ---

window.selectedRating = 0;

// Star Rating Click Event
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

    // Firebase ko data bhejna
    if (window.saveFeedbackToFirebase) {
        window.saveFeedbackToFirebase(rating, feedbackText);
    } else {
        // Fallback UI Reset
        alert("Feedback Submitted! Thank you.");
        if(feedbackBox) feedbackBox.value = '';
        window.selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => {
            s.style.color = '#888';
            s.innerText = '☆';
        });
    }
};
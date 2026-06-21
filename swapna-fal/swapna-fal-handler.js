// ==========================================
// MAHADEV ASTROLOGER MA - SWAPNA FAL HANDLER
// ==========================================

const getLang = () => localStorage.getItem('selectedLang') || 'hi';

const updateSwapnaText = () => {
    const lang = getLang();
    
    // Check global V-MAX translations or local swapnaTranslations
    const translations = window.pageTranslations?.[lang] || window.swapnaTranslations?.[lang];
    
    if (!translations) return;

    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key]) {
            el.innerHTML = translations[key]; 
        }
    });
};

// Execute when page loads
window.addEventListener('load', () => {
    setTimeout(updateSwapnaText, 200);
});

// Execute when language toggle is clicked (V-MAX trigger)
document.addEventListener('click', (e) => {
    if (e.target.closest('#langToggle') || e.target.closest('.lang-switch')) {
        setTimeout(updateSwapnaText, 100);
    }
});

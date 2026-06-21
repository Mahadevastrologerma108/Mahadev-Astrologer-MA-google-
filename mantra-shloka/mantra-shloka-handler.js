// ==========================================
// MAHADEV ASTROLOGER MA - MANTRA HANDLER
// ==========================================

const getLang = () => localStorage.getItem('selectedLang') || 'hi';

const updateMantraText = () => {
    const lang = getLang();
    const translations = window.pageTranslations?.[lang] || window.mantraTranslations?.[lang];
    
    if (!translations) return;

    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key]) {
            el.innerHTML = translations[key]; 
        }
    });
};

window.addEventListener('load', () => {
    setTimeout(updateMantraText, 200);
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#langToggle') || e.target.closest('.lang-switch')) {
        setTimeout(updateMantraText, 100);
    }
});

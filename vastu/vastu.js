function applyVastuLanguage(lang) {
    const data = vastuTranslations[lang];
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (data[key]) {
            element.innerText = data[key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage se language uthayega ya default 'hi' rakhega
    const savedLang = localStorage.getItem('selectedLanguage') || 'hi';
    applyVastuLanguage(savedLang);
});

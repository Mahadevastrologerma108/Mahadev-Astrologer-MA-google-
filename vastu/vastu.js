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
document.getElementById('vastuConsultForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const type = document.getElementById('propertyType').value;
    const facing = document.getElementById('facing').value;
    const issue = document.getElementById('issue').value;

    // Aap ise WhatsApp par bhi bhej sakte hain:
    const message = `Vastu Audit Request:\nName: ${name}\nProperty: ${type}\nFacing: ${facing}\nIssue: ${issue}`;
    const whatsappUrl = `https://wa.me/91YOURNUMBER?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    alert("Details shared! Opening WhatsApp...");
});

/**
 * Mahadev Astrologer MA - Language Engine
 * Bridge between: calendar-events.js (HI) & events-lang.js (EN)
 */

const MasterLangBridge = {
    // Ye connect kar raha hai aapki dono files ko
    calendar: {
        hi: typeof hindiEventsData !== 'undefined' ? hindiEventsData : {},
        en: typeof englishEventsData !== 'undefined' ? englishEventsData : {}
    }
};

// 1. Function jo Events list ko render karega
function renderBilingualEvents(lang) {
    const eventListContainer = document.getElementById('event-list');
    
    // Agar page par event-list nahi hai (jaise about page), toh wapas jao
    if (!eventListContainer) return;

    const events = MasterLangBridge.calendar[lang];
    let html = "";

    // Aaj ki date nikalne ke liye (taaki aaj ke mahine ke events dikhein)
    // Note: panchang.js ke currentMonth aur currentYear variables ka use kar sakte hain
    const currentMonth = typeof currentYear !== 'undefined' ? 
                         new Date(currentYear, currentMonthIndex).getMonth() + 1 : 
                         new Date().getMonth() + 1;

    // Bridge logic: Date check karo aur data dikhao
    for (const [date, text] of Object.entries(events)) {
        html += `
            <li class="event-item">
                <span class="event-date-badge">${date}</span>
                <span class="event-text-detail">${text}</span>
            </li>
        `;
    }

    eventListContainer.innerHTML = html || "<li>No events found for this language.</li>";
}

// 2. Global Function jo Language badlega (Button click par call hoga)
function changeLanguage(lang) {
    localStorage.setItem('selectedLang', lang); // Memory mein save
    document.documentElement.lang = lang; // HTML lang attribute update

    // Saare static labels badlo (Translations.js ki madad se)
    if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }

    // Calendar ke events badlo
    renderBilingualEvents(lang);

    // Agar page refresh ki zaroorat ho toh (optional)
    // location.reload(); 
}

// 3. Page Load hote hi sabse pehle ye chalega
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'hi';
    
    // Initial load
    renderBilingualEvents(savedLang);
    
    // Agar koi specific initialization panchang.js mein chahiye toh yahan add karein
});
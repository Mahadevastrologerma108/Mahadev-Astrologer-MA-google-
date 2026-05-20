/**
 * MAHADEV ASTROLOGER MA - Products Handler (Master Logic)
 * 1. Auto-Translation Engine
 * 2. Admin Authority Unlocker (Firebase Integrated)
 */

// 1. ट्रांसलेशन रेंडरर
function runTranslation() {
    if (typeof window.updateAllTranslations === 'function') {
        window.updateAllTranslations();
    }
}

// 2. एडमिन UI को अनब्लॉक करने वाला फंक्शन
function unlockAdminFeatures() {
    console.log("🔱 Admin Privileges Detected. Unlocking Shop Controls...");
    
    // उन सभी एलिमेंट्स को दिखाएं जिन्हें सिर्फ एडमिन देख सकता है
    const adminElements = document.querySelectorAll('.admin-controls, .admin-badge');
    adminElements.forEach(el => {
        el.style.display = 'block';
    });
}

// 3. पेज लोड होते ही ये ऑपरेशन्स चलाएं
document.addEventListener("DOMContentLoaded", () => {
    // ट्रांसलेशन चलाएं
    runTranslation();

    // अगर पहले से ही एडमिन लॉग-इन है (LocalStorage के जरिए)
    if (localStorage.getItem('isAdmin') === 'true') {
        unlockAdminFeatures();
    }
});

// 4. लाइव मॉनिटरिंग (MutationObserver) - पंचांग और Firebase से आए डेटा के लिए अचूक
const observer = new MutationObserver(() => {
    runTranslation();
});
observer.observe(document.body, { childList: true, subtree: true });

// 5. Firebase-Handler से सिग्नल मिलने पर एडमिन UI खोलें
window.addEventListener('adminLoggedIn', unlockAdminFeatures);

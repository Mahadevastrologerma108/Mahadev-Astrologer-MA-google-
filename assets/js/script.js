// ======================================================
// 🔱 MAHADEV ASTROLOGER MA - FRONTEND & PWA UI LOGIC
// ======================================================

// 1. Form UI Sync (WhatsApp/Telegram/Email toggle)
window.syncContactMethod = function(type) {
    const input = document.getElementById('contact-detail');
    const warning = document.getElementById('email-warning');
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const t = window.translations ? window.translations[lang] : null;

    if (!input) return;

    if (type === 'WA') {
        input.placeholder = (t && t.ph_contact) ? t.ph_contact : (lang === 'hi' ? "व्हाट्सएप नंबर" : "WhatsApp Number");
        if(warning) warning.style.display = "none";
    } else if (type === 'TG') {
        input.placeholder = "Telegram Username / Link";
        if(warning) warning.style.display = "none";
    } else if (type === 'EM') {
        input.placeholder = lang === 'hi' ? "आपका ईमेल पता" : "Your Email Address";
        if(warning) warning.style.display = "block";
    }
};

// 2. Astrology Sections Toggle Logic
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
    } else if (svc === 'palmistry' || svc === 'combo_analysis') {
        if(palmInst) palmInst.style.display = 'block';
        if(svc === 'palmistry' && timePlaceGroup) timePlaceGroup.style.display = 'none';
    } else if (svc === 'numerology' && timePlaceGroup) {
        timePlaceGroup.style.display = 'none';
    }
};

// 3. PWA Install Button Logic
let deferredPrompt;
const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installContainer) installContainer.style.display = 'block';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (installContainer) installContainer.style.display = 'none';
    });
}

// 4. Notification Subscription Logic
async function subscribeForPanchang() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const messaging = firebase.messaging(); 
            const token = await messaging.getToken({ 
                vapidKey: 'BP4DF0BmcxCRMUu779YG5DlJdMQBwTC-w1JFOLTVyGwFp2RqY16uhIVkmuYm2V0RKI0BTKT-QTsjkialJZIWHBA' 
            });

            if (token && window.saveTokenToDatabase) {
                // Ye Handler.js ke function ko call karega
                window.saveTokenToDatabase(token);
            }
        }
    } catch (error) {
        console.error('🔱 Push Error:', error);
    }
}

window.addEventListener('appinstalled', () => {
    setTimeout(subscribeForPanchang, 3000);
});

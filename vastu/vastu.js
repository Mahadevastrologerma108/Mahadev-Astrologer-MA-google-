// =========================================================
// 🔱 Firebase Imports
// =========================================================
import {
    db,
    remoteConfig,
    fetchAndActivate,
    getString
} from '../assets/js/firebase-config.js';

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================================================
   🔱 1. LANGUAGE ENGINE (100% Bug-Free)
========================================================= */
function applyVastuLanguage(lang = 'hi') {
    // ES6 Modules के टकराव से बचने के लिए window ऑब्जेक्ट का उपयोग
    if (!window.vastuTranslations) {
        console.warn('Vastu translations missing! Make sure vastu-trans.js is loaded before vastu.js');
        return;
    }

    const langData = window.vastuTranslations[lang];
    if (!langData) return;

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (!langData[key]) return;

        if (element.tagName === 'OPTION') {
            element.text = langData[key];
        } else {
            element.textContent = langData[key];
        }
    });
}


/* =========================================================
   🔱 2. GLOBAL TRANSLATION CONNECTOR
========================================================= */
window.updateVastuLanguage = applyVastuLanguage;

// Layout.js compatibility: Ensure global toggle button works
const previousUpdateContent = window.updateContent;
window.updateContent = function(lang) {
    if (typeof previousUpdateContent === 'function') {
        previousUpdateContent(lang);
    }
    applyVastuLanguage(lang);
};


/* =========================================================
   🔱 3. INPUT SANITIZER
========================================================= */
function sanitizeInput(value) {
    if (!value) return '';
    return value
        .replace(/<[^>]*>?/gm, '')
        .replace(/[{}]/g, '')
        .trim();
}


/* =========================================================
   🔱 4. TELEGRAM ENGINE
========================================================= */
async function notifyViaTelegram(formData) {
    try {
        await fetchAndActivate(remoteConfig);

        const token = getString(remoteConfig, 'TELEGRAM_BOT_TOKEN');
        const chatId = getString(remoteConfig, 'TELEGRAM_CHAT_ID');

        if (!token || !chatId) {
            console.warn('Telegram credentials missing in Remote Config!');
            return;
        }

        const message = 
`🔱 New Vastu Inquiry 🔱

👤 Name: ${formData.name}
🏠 Property: ${formData.propertyType}
🧭 Facing: ${formData.facing}

❗ Issue:
${formData.issue}

📅 ${new Date().toLocaleString('en-IN')}`;

        const telegramURL = `https://api.telegram.org/bot${token}/sendMessage`;

        await fetch(telegramURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });

    } catch (error) {
        console.error('Telegram Error:', error);
    }
}


/* =========================================================
   🔱 5. FORM SUBMISSION ENGINE
========================================================= */
function initializeVastuForm() {
    const form = document.getElementById('vastuConsultForm');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('formStatus');

        /* --- BUTTON LOADING STATE --- */
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting... 🔱';
        submitBtn.style.opacity = '0.7';

        statusDiv.innerHTML = 
            `<span style="color: var(--gold)">
                Connecting to Mahadev Server...
            </span>`;

        /* --- SANITIZED FORM DATA --- */
        const formData = {
            name: sanitizeInput(document.getElementById('userName').value),
            propertyType: sanitizeInput(document.getElementById('propertyType').value),
            facing: sanitizeInput(document.getElementById('facing').value),
            issue: sanitizeInput(document.getElementById('issue').value)
        };

        /* --- VALIDATION --- */
        if (!formData.name || !formData.propertyType || !formData.facing || !formData.issue) {
            statusDiv.innerHTML = 
                `<span style="color:#ff4444">
                    Please fill all fields properly.
                </span>`;
            resetButton(submitBtn);
            return;
        }

        try {
            /* --- FIRESTORE SAVE --- */
            await addDoc(collection(db, 'vastu_consultations'), {
                ...formData,
                source: 'Vastu_Page_Form',
                timestamp: serverTimestamp()
            });

            /* --- TELEGRAM NOTIFICATION --- */
            await notifyViaTelegram(formData);

            /* --- WHATSAPP REDIRECT --- */
            const whatsappMessage = encodeURIComponent(
`🔱 Vastu Audit Request 🔱

Name: ${formData.name}
Property: ${formData.propertyType}
Facing: ${formData.facing}

Issue:
${formData.issue}`
            );

            // ⚠️ ATTENTION: यहाँ अपना वास्तविक WhatsApp नंबर (Country Code के साथ) डालें 
            const whatsappURL = `https://wa.me/message/VCK5OVBDCN7YK1?text=${whatsappMessage}`;

            /* --- SUCCESS UI --- */
            statusDiv.innerHTML = 
                `<span style="color:#28a745">
                    Pranaam! Details submitted successfully 🔱
                </span>`;

            form.reset();

            // Timeout के साथ Status और Button Reset ताकि Double Submit न हो
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                statusDiv.innerHTML = "";
                resetButton(submitBtn);
            }, 1200);

        } catch (error) {
            console.error('Form Submission Error:', error);
            statusDiv.innerHTML = 
                `<span style="color:#ff4444">
                    Submission failed. Please try again.
                </span>`;
            resetButton(submitBtn);
        }
    });
}


/* =========================================================
   🔱 6. BUTTON RESET UTILITY
========================================================= */
function resetButton(button) {
    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = 'SUBMIT DETAILS 🔱';
}


/* =========================================================
   🔱 7. PAGE INITIALIZER
========================================================= */
function initializeVastuPage() {
    // Apply saved language from local storage (default to Hindi)
    const savedLang = localStorage.getItem('selectedLanguage') || 'hi';
    applyVastuLanguage(savedLang);

    // Initialize the form event listeners
    initializeVastuForm();
}


/* =========================================================
   🔱 8. SAFE STARTUP
========================================================= */
window.addEventListener('load', initializeVastuPage);

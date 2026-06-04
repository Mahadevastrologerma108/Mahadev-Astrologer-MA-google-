// ==========================================
// MAHADEV ASTROLOGER MA - VASTU ENGINE
// ==========================================

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
   🔱 1. INPUT SANITIZER
========================================================= */
function sanitizeInput(value) {
    if (!value) return '';
    return value
        .replace(/<[^>]*>?/gm, '')
        .replace(/[{}]/g, '')
        .trim();
}

/* =========================================================
   🔱 2. TELEGRAM ENGINE
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });

    } catch (error) {
        console.error('Telegram Error:', error);
    }
}

/* =========================================================
   🔱 3. FORM SUBMISSION ENGINE
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
            const whatsappURL = `https://wa.me/91YOUR_NUMBER?text=${whatsappMessage}`;

            /* --- SUCCESS UI --- */
            statusDiv.innerHTML = 
                `<span style="color:#28a745">
                    Pranaam! Details submitted successfully 🔱
                </span>`;

            form.reset();

            // Timeout के साथ Status और Button Reset
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
   🔱 4. BUTTON RESET UTILITY
========================================================= */
function resetButton(button) {
    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = 'SUBMIT DETAILS 🔱';
}

/* =========================================================
   🔱 5. SAFE STARTUP
========================================================= */
window.addEventListener('load', initializeVastuForm);

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

let isSubmitting = false;
let cachedTelegramKeys = null;

function sanitizeInput(value) {
    if (!value) return '';

    return value
        .replace(/<[^>]*>?/gm, '')
        .replace(/[{}]/g, '')
        .trim();
}

// Telegram HTML Special Character Protection
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


/* =========================================================
   🔱 2. TELEGRAM CREDENTIAL ENGINE
   Firebase Remote Config Integration
========================================================= */

async function getVastuTelegramKeys() {

    if (cachedTelegramKeys) return cachedTelegramKeys;

    await fetchAndActivate(remoteConfig);

    const tg = getString(remoteConfig, 'TG_BOT_TOKEN');
    const cid = getString(remoteConfig, 'TG_CHAT_ID');

    if (!tg || !cid) {
        throw new Error('Telegram configuration missing.');
    }

    cachedTelegramKeys = { tg, cid };

    return cachedTelegramKeys;
}


/* =========================================================
   🔱 3. TELEGRAM NOTIFICATION ENGINE
========================================================= */

async function notifyViaTelegram(formData) {

    const keys = await getVastuTelegramKeys();

    const messageText = `
🔱 <b>NEW VASTU INQUIRY</b> 🔱

👤 <b>Name:</b> ${escapeHTML(formData.name)}
🏠 <b>Property:</b> ${escapeHTML(formData.propertyType)}
🧭 <b>Facing:</b> ${escapeHTML(formData.facing)}

❗ <b>Issue:</b>
${escapeHTML(formData.issue)}

📅 ${new Date().toLocaleString('en-IN')}
`;

    const response = await fetch(
        `https://api.telegram.org/bot${keys.tg}/sendMessage`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                chat_id: keys.cid,
                text: messageText,
                parse_mode: 'HTML'
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Telegram HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.ok) {
        throw new Error(
            result.description || 'Telegram notification failed.'
        );
    }

    return true;
}


/* =========================================================
   🔱 4. BUTTON RESET UTILITY
========================================================= */

function resetButton(button) {

    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = 'SUBMIT DETAILS 🔱';

    isSubmitting = false;
}


/* =========================================================
   🔱 5. FORM SUBMISSION ENGINE
========================================================= */

function initializeVastuForm() {

    const form = document.getElementById('vastuConsultForm');

    if (!form) return;

    form.addEventListener('submit', async function(event) {

        event.preventDefault();

        // Duplicate Submission Protection
        if (isSubmitting) return;

        isSubmitting = true;

        const submitBtn = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('formStatus');

        /* --- BUTTON LOADING STATE --- */

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'SUBMITTING... 🔱';
        submitBtn.style.opacity = '0.7';

        statusDiv.textContent = 'Connecting to Mahadev Server...';


        /* --- SANITIZED FORM DATA --- */

        const formData = {

            name: sanitizeInput(
                document.getElementById('userName').value
            ),

            propertyType: sanitizeInput(
                document.getElementById('propertyType').value
            ),

            facing: sanitizeInput(
                document.getElementById('facing').value
            ),

            issue: sanitizeInput(
                document.getElementById('issue').value
            )
        };


        /* --- FORM VALIDATION --- */

        if (
            !formData.name ||
            !formData.propertyType ||
            !formData.facing ||
            !formData.issue
        ) {

            statusDiv.textContent =
                'Please fill all fields properly.';

            resetButton(submitBtn);

            return;
        }


        try {

            /* -----------------------------------------
               STEP 1: FIRESTORE SAVE
            ----------------------------------------- */

            await addDoc(
                collection(db, 'vastu_consultations'),
                {
                    ...formData,
                    source: 'Vastu_Page_Form',
                    timestamp: serverTimestamp()
                }
            );


            /* -----------------------------------------
               STEP 2: TELEGRAM NOTIFICATION
            ----------------------------------------- */

            let telegramStatus = true;

            try {

                await notifyViaTelegram(formData);

                console.log(
                    '🔱 Vastu Telegram Notification Sent Successfully.'
                );

            } catch (telegramError) {

                telegramStatus = false;

                console.error(
                    '🔱 Telegram Notification Error:',
                    telegramError
                );
            }


            /* -----------------------------------------
               STEP 3: WHATSAPP MESSAGE PREPARATION
            ----------------------------------------- */

            const whatsappMessage = encodeURIComponent(

`🔱 Vastu Audit Request 🔱

Name: ${formData.name}
Property: ${formData.propertyType}
Facing: ${formData.facing}

Issue:
${formData.issue}`

            );

            const whatsappURL =
                `https://wa.me/message/VCK5OVBDCN7YK1?text=${whatsappMessage}`;


            /* -----------------------------------------
               STEP 4: SUCCESS STATUS
            ----------------------------------------- */

            if (telegramStatus) {

                statusDiv.textContent =
                    'Pranaam! Details submitted successfully 🔱';

            } else {

                statusDiv.textContent =
                    'Your enquiry is saved. Notification is pending. 🔱';

            }

            form.reset();


            /* -----------------------------------------
               STEP 5: WHATSAPP REDIRECT
            ----------------------------------------- */

            setTimeout(() => {

                window.location.href = whatsappURL;

            }, 1200);


        } catch (error) {

            console.error(
                '🔱 Vastu Form Submission Error:',
                error
            );

            statusDiv.textContent =
                'Submission failed. Please try again.';

            resetButton(submitBtn);

        }

    });

}


/* =========================================================
   🔱 6. SAFE STARTUP
========================================================= */

window.addEventListener('load', initializeVastuForm);
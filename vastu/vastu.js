// 🔱 Firebase & Config Imports
import { db, remoteConfig, fetchAndActivate, getString } from '../assets/js/firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * 1. Language Translation Logic
 */
function applyVastuLanguage(lang) {
    if (typeof vastuTranslations === 'undefined') return;

    const data = vastuTranslations[lang];
    if (!data) return;

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (data[key]) {
            if (element.tagName === 'OPTION') {
                element.text = data[key];
            } else {
                element.innerText = data[key];
            }
        }
    });
}

// 🔱 ISKO GLOBAL BANAYA: Taaki main translations.js isko call kar sake
window.updateVastuLanguage = function(lang) {
    applyVastuLanguage(lang);
};

// Agar aapki site ka main switcher 'updateContent' khojta hai, toh uske sath bhi attach kiya
if (!window.updateContent) {
    window.updateContent = function(lang) {
        applyVastuLanguage(lang);
    };
}

/**
 * 2. Telegram Notification Engine
 */
async function notifyViaTelegram(formData) {
    try {
        await fetchAndActivate(remoteConfig);
        const token = getString(remoteConfig, 'TELEGRAM_BOT_TOKEN');
        const chatId = getString(remoteConfig, 'TELEGRAM_CHAT_ID');

        const text = `🔱 *New Vastu Inquiry* 🔱\n\n` +
                     `👤 *Name:* ${formData.name}\n` +
                     `🏠 *Property:* ${formData.propertyType}\n` +
                     `🧭 *Facing:* ${formData.facing}\n` +
                     `❗ *Issue:* ${formData.issue}\n\n` +
                     `📅 *Timestamp:* ${new Date().toLocaleString('en-IN')}`;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error("Telegram Automation Failed:", err);
    }
}

/**
 * 3. Main Form Submission Logic
 */
const vastuForm = document.getElementById('vastuConsultForm');
if (vastuForm) {
    vastuForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const statusDiv = document.getElementById('formStatus');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        statusDiv.innerHTML = `<span style="color: var(--gold)">Connecting to Mahadev's Server... 🔱</span>`;

        const formData = {
            name: document.getElementById('userName').value,
            propertyType: document.getElementById('propertyType').value,
            facing: document.getElementById('facing').value,
            issue: document.getElementById('issue').value,
        };

        try {
            await addDoc(collection(db, "vastu_consultations"), {
                ...formData,
                timestamp: serverTimestamp(),
                source: "Vastu_Page_Form"
            });

            await notifyViaTelegram(formData);

            // 🔱 YAHA APNA NUMBER DALNA MAT BHOOLNA BHAI
            const waMessage = `🔱 *Vastu Audit Request* 🔱%0A*Name:* ${formData.name}%0A*Issue:* ${formData.issue}`;
            const waUrl = `https://wa.me/91YOUR_NUMBER?text=${waMessage}`; 

            statusDiv.innerHTML = `<span style="color: #28a745">Pranaam! Details Saved & Notified Successfully. 🔱</span>`;
            
            this.reset();
            setTimeout(() => {
                window.open(waUrl, '_blank');
                statusDiv.innerHTML = "";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }, 1500);

        } catch (error) {
            console.error("Form Submission Error:", error);
            statusDiv.innerHTML = `<span style="color: #ff4444">Submission Failed. Please check internet connection.</span>`;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    });
}

/**
 * 4. Initialization Logic (Module safe execution)
 */
function init() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'hi';
    applyVastuLanguage(savedLang);
}

// Module script hamesha DOM ready hone ke baad chalti hai, isliye seedha call safe hai
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

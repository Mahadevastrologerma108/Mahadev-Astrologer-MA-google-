// 🔱 Firebase & Config Imports
import { db, remoteConfig, fetchAndActivate, getString } from '../assets/js/firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * 1. Language Translation Logic
 * LocalStorage se language uthakar page content update karta hai
 */
function applyVastuLanguage(lang) {
    // Check karna ki translation file load hui hai ya nahi
    if (typeof vastuTranslations === 'undefined') return;

    const data = vastuTranslations[lang];
    if (!data) return;

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (data[key]) {
            // Dropdown options ke liye .text, baaki sab (H1, P, Label, Button) ke liye .innerText
            if (element.tagName === 'OPTION') {
                element.text = data[key];
            } else {
                element.innerText = data[key];
            }
        }
    });
}

/**
 * 2. Telegram Notification Engine
 * Remote Config se secure keys uthakar message bhejta hai
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
document.getElementById('vastuConsultForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const statusDiv = document.getElementById('formStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // UI Feedback: Button disable karein aur loading dikhayein
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
        // Step A: Firebase Firestore mein save karein
        await addDoc(collection(db, "vastu_consultations"), {
            ...formData,
            timestamp: serverTimestamp(),
            source: "Vastu_Page_Form"
        });

        // Step B: Telegram par instant alert bhejein
        await notifyViaTelegram(formData);

        // Step C: WhatsApp API Trigger 
        // DHYAN DEIN: Apna asli number yahan update karein (bina + ke)
        const waMessage = `🔱 *Vastu Audit Request* 🔱%0A*Name:* ${formData.name}%0A*Issue:* ${formData.issue}`;
        const waUrl = `https://wa.me/91YOUR_NUMBER?text=${waMessage}`; 

        // Success UI
        statusDiv.innerHTML = `<span style="color: #28a745">Pranaam! Details Saved & Notified Successfully. 🔱</span>`;
        
        // Final Action: Form reset aur 1.5 sec baad WhatsApp redirect
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

// Initialization: Page load hote hi language set karna
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'hi';
    applyVastuLanguage(savedLang);
});

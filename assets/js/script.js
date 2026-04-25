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

// Bot Window Open/Close
window.toggleDivineBot = function() {
    const chatWindow = document.getElementById('divine-chat-window');
    chatWindow.classList.toggle('hidden');
};

// Enter dabane par message send karna
window.handleBotEnter = function(e) {
    if (e.key === 'Enter') {
        sendBotMessage();
    }
};

// Main Logic Function
window.sendBotMessage = async function() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();
    if (!message) return;

    // 1. User ka message screen par dikhao
    addChatMessage(message, 'user-msg');
    inputField.value = '';

    const lowerMsg = message.toLowerCase();
    const chatBody = document.getElementById('chat-body');

    // --- 🔱 LOGIC 1: SMART ROUTING (Website Pages) ---
    if (lowerMsg.includes('horoscope') || lowerMsg.includes('rashifal')) {
        addChatMessage("Bilkul! Main aapko Horoscope page par le jaa raha hoon...", 'bot-msg');
        setTimeout(() => {
            window.location.href = '/horoscope/horoscope.html';
        }, 1500);
        return;
    } 
    else if (lowerMsg.includes('panchang')) {
        addChatMessage("Pratiksha karein, Panchang page khul raha hai...", 'bot-msg');
        setTimeout(() => {
            window.location.href = '/panchang/panchang.html';
        }, 1500);
        return;
    }
    else if (lowerMsg.includes('book') || lowerMsg.includes('appointment')) {
        addChatMessage("Aap hamare Home page se Appointment book kar sakte hain. Wahan le jaa raha hoon...", 'bot-msg');
        setTimeout(() => {
            window.location.href = '/index.html#book';
        }, 1500);
        return;
    }

    // --- 🔱 LOGIC 2: HUGGING FACE API (Aapka Feed Kiya Hua Data) ---
    // Agar simple navigation nahi hai, to Hugging Face se pucho
    addChatMessage("Gyan kosh se jankari nikal raha hoon...", 'bot-msg');

    try {
        // 🔥 YAHAN APNA HUGGING FACE MODEL URL AUR TOKEN DALEIN
        const HF_API_URL = "https://api-inference.huggingface.co/models/AAPKA_MODEL_NAME";
        const HF_TOKEN = "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": HF_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: message })
        });

        const result = await response.json();

        // Hugging Face ke result ko chat mein dikhana
        // Note: Aapke model ke hisaab se result ka format alag ho sakta hai (e.g., result[0].generated_text)
        if (result && result[0] && result[0].generated_text) {
            let aiText = result[0].generated_text.replace(message, '').trim(); // User ka prashna dobara na aaye
            addChatMessage(aiText, 'bot-msg');
        } else {
            addChatMessage("Kshama karein, is samay main iska uttar nahi de paa raha hoon. Kripya Guruji se sampark karein.", 'bot-msg');
        }

    } catch (error) {
        console.error("Hugging Face Error:", error);
        addChatMessage("Network mein kuch kathinai hai. Kripya thodi der baad prayas karein.", 'bot-msg');
    }
};

// Message add karne ka helper function
function addChatMessage(text, className) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

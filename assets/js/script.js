import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Config (Keep this secure)
const firebaseConfig = {
    apiKey: "AIzaSyAgcfrzQm6wezgtU5Q5BP8wxXatmoWqYrw",
    authDomain: "mahadev-astrologer.firebaseapp.com",
    projectId: "mahadev-astrologer",
    storageBucket: "mahadev-astrologer.firebasestorage.app",
    messagingSenderId: "559664802739",
    appId: "1:559664802739:web:4285f4dc461f570cc2b9c6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 1. MENU & UI INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    if(menuBtn) {
        menuBtn.onclick = () => { navDrawer.style.right = '0'; overlay.style.display = 'block'; };
        const hideMenu = () => { navDrawer.style.right = '-100%'; overlay.style.display = 'none'; };
        if(closeBtn) closeBtn.onclick = hideMenu;
        if(overlay) overlay.onclick = hideMenu;
    }
    window.updateFormDisplay();
});

// ==========================================
// 1.5 PWA INSTALL LOGIC (Yahan add karein)
// ==========================================
let deferredPrompt;
const installContainer = document.getElementById('install-container');
const btnInstall = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(installContainer) installContainer.style.display = 'block';
});

if(btnInstall) {
    btnInstall.addEventListener('click', () => {
        installContainer.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User ne App install kar li 🔱');
            }
            deferredPrompt = null;
        });
    });
}


// ==========================================
// 2. TRIPLE-PRIVACY DYNAMIC INPUT (Baaki code niche...)
// ==========================================

// ==========================================
// 2. TRIPLE-PRIVACY DYNAMIC INPUT
// ==========================================
window.handleContactUI = function(type) {
    const container = document.getElementById('dynamic-input-container');
    if(type === 'WA') {
        container.innerHTML = `<input type="tel" id="contact-detail" placeholder="Aapka WhatsApp Number" class="input-field" required pattern="[0-9]{10,12}">`;
    } else if(type === 'TG') {
        container.innerHTML = `<input type="text" id="contact-detail" placeholder="@Telegram_Username" class="input-field" required>`;
    } else if(type === 'EM') {
        container.innerHTML = `<input type="email" id="contact-detail" placeholder="Aapka Email Address" class="input-field" required>`;
    }
}

// ==========================================
// 3. SMART FORM DISPLAY LOGIC
// ==========================================
window.updateFormDisplay = function() {
    const service = document.getElementById('service-select').value;
    const secSingle = document.getElementById('section-single');
    const secMatch = document.getElementById('section-matching');
    const birthFields = document.getElementById('birth-fields');
    const palmInst = document.getElementById('palm-instruction');

    secSingle.style.display = (service === 'kundli_matching') ? 'none' : 'block';
    secMatch.style.display = (service === 'kundli_matching') ? 'block' : 'none';

    if (service === 'palmistry') {
        birthFields.style.display = 'none';
        palmInst.style.display = 'block';
    } else {
        birthFields.style.display = 'block';
        palmInst.style.display = (service === 'combo_analysis') ? 'block' : 'none';
    }
}

// ==========================================
// 4. DATA SUBMISSION (FIREBASE + SMART REDIRECT)
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const service = document.getElementById('service-select').value;
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    const contact = document.getElementById('contact-detail').value;

    btn.innerText = "🔱 CONNECTING...";
    btn.disabled = true;

    try {
        let finalData = { 
            service: service, 
            contact_method: method, 
            contact_info: contact,
            timestamp: serverTimestamp() 
        };

        let msg = `🔱 *MAHADEV ASTROLOGER* 🔱\n✨ *Service:* ${service.toUpperCase()}\n`;
        msg += `📞 *${method}:* ${contact}\n`;

        if (service === 'kundli_matching') {
            finalData.male = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value, place: document.getElementById('m-place').value };
            finalData.female = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value, place: document.getElementById('f-place').value };
            msg += `👦 Male: ${finalData.male.name}\n👧 Female: ${finalData.female.name}`;
        } else {
            const userName = document.getElementById('user-name').value;
            finalData.user_name = userName;
            msg += `👤 User: ${userName}\n`;
            if (service !== 'palmistry') msg += `📅 DOB: ${document.getElementById('single-dob').value}\n`;
            if (service === 'kundli_making' || service === 'combo_analysis') {
                msg += `⏰ Time: ${document.getElementById('single-time').value}\n📍 Place: ${document.getElementById('single-place').value}`;
            }
        }

        // Save to Firebase
        await addDoc(collection(db, "appointments"), finalData);

        // Smart Redirect
        if (method === 'Telegram') {
            window.open(`https://t.me/@Mahadev_Astrologer_MA?text=${encodeURIComponent(msg)}`, '_blank');
        } else if (method === 'Email') {
            window.location.href = `mailto: mahadevastrologerma108@zohomail.in?subject=Astro Consultation&body=${encodeURIComponent(msg)}`;
        } else {
            window.open(`https://wa.me/918271107068?text=${encodeURIComponent(msg)}`, '_blank');
        }

        alert("🔱 Success! Your data is recorded.");
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Invoke Divine Guidance";
        btn.disabled = false;
    }
});

// ==========================================
// 5. LANGUAGE SYNC FOR DAILY INSIGHTS (Adding now)
// ==========================================
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    
    // Agar translations global window par hai toh hi kaam karega
    const t = window.translations;
    if (!t) return;

    // Daily Insights Section ke cards ko pakadna
    document.querySelectorAll('#daily-insights [data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang] && t[lang][key]) {
            el.innerText = t[lang][key];
        }
    });
};

// Page load hote hi chalne do
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.updateUI, 200); 
});
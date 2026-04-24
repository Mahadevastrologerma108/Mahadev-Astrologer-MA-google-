/*1. AUTO-LOADER SYSTEM * Iska kaam hai script.js ko har page par apne aap link karna.*/
(function() {
    const scriptPath = '/assets/js/script.js'; 
    if (!document.querySelector(`script[src="${scriptPath}"]`)) {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.defer = true;
        document.head.appendChild(script);
        console.log("🔱 Mahadev Auto-Loader: script.js linked successfully.");
    }
})();

/*2. CORE FIREBASE IMPORT*/
import { db, auth, provider } from './firebase-config.js'; 
import { 
    collection, addDoc, doc, setDoc, serverTimestamp, getDocs, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Telegram Configuration
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

console.log("🔱 Mahadev Handler: Fully Modular & Active.");

/*3. NOTIFICATION TOKEN SYNC (FOR PWA/APK)*/
window.saveTokenToDatabase = async (token) => {
    try {
        const userEmail = localStorage.getItem("userEmail") || "guest";
        await setDoc(doc(db, "fcm_tokens", token), {
            token: token,
            email: userEmail,
            platform: 'web/pwa',
            status: "active",
            subscribedAt: serverTimestamp()
        });
        console.log("🔱 Token Synced with Firestore.");
    } catch (err) {
        console.error("🔱 Token Sync Error:", err);
    }
};

/*4. APPOINTMENT SYSTEM (WITH TELEGRAM ALERT)*/
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        try {
            const service = document.getElementById('service-select').value;
            const name = document.getElementById('user-name').value;
            const contactDetail = document.getElementById('contact-detail').value;
            const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
            const wantsUID = document.getElementById('generate-uid').checked;

            const subData = {
                service, name, contact_method: contactMethod, contact_detail: contactDetail,
                generate_uid: wantsUID,
                timestamp: serverTimestamp()
            };

            // Capture Date/Time Details based on service
            if (service === 'kundli_matching') {
                subData.male_details = { 
                    name: document.getElementById('m-name').value, 
                    dob: document.getElementById('m-dob').value, 
                    time: document.getElementById('m-time').value, 
                    place: document.getElementById('m-place').value 
                };
                subData.female_details = { 
                    name: document.getElementById('f-name').value, 
                    dob: document.getElementById('f-dob').value, 
                    time: document.getElementById('f-time').value, 
                    place: document.getElementById('f-place').value 
                };
            } else {
                subData.dob = document.getElementById('single-dob')?.value || "";
                subData.time = document.getElementById('single-time')?.value || "";
                subData.place = document.getElementById('single-place')?.value || "";
            }

            // Save to Firestore
            await addDoc(collection(db, "appointments"), subData);

            // Send Telegram Notification
            const tgMsg = `🔱 *New Appointment!*\n👤 *Name:* ${name}\n✨ *Service:* ${service.toUpperCase()}\n📞 *Contact:* ${contactDetail} (${contactMethod})\n🔑 *UID:* ${wantsUID ? "Yes" : "No"}`;
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: tgMsg, parse_mode: 'Markdown' })
            });

            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset();
            if(window.applyFormLogic) window.applyFormLogic();
        } catch (err) {
            console.error("🔱 Form Error:", err);
            alert("Kshama karein, network error aaya.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

/**
 * 5. FEEDBACK & RATING SYSTEM
 */
window.submitFeedback = async function() {
    const text = document.getElementById('user-feedback')?.value.trim();
    const rating = window.selectedRating || 0;
    const user = auth.currentUser;

    if (!text || rating === 0) return alert("🔱 Rating aur Experience dono zaruri hain!");

    try {
        await addDoc(collection(db, "feedbacks"), {
            text, rating: parseInt(rating), 
            timestamp: serverTimestamp(), 
            status: "pending",
            userName: user ? user.displayName : "Mahadev Bhakt",
            userPhoto: user ? user.photoURL : "assets/images/default-avatar.png",
            userId: user ? user.uid : "guest"
        });
        alert("🔱 Dhanyawad! Review ke baad aapka feedback dikhega.");
        document.getElementById('user-feedback').value = "";
    } catch (e) { console.error("🔱 Feedback Error:", e); }
};

/*6. AUTHENTICATION (LOGIN/LOGOUT) UI & ENGINE*/
// 1. Asali Login/Logout Functions
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.logoutUser = () => signOut(auth).then(() => window.location.reload());
// 2. Language Switcher (Global Function) - FIXED for Desktop & Mobile
window.changeLang = (lang) => {
    console.log("🔱 Language badli gayi:", lang);    
    // Browser memory mein language save karo
    localStorage.setItem("userLang", lang);
    // Desktop aur Mobile dono jagah ke buttons ek sath update karo
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`).forEach(btn => btn.classList.add('active'));
    // Agar tumhara pehle se koi translation function hai toh use trigger karo
    if (typeof window.toggleLanguage === "function") {
        window.toggleLanguage(); 
    }
};
// 3. UI Update Logic (Alag function mein taaki system fast rahe)
function updateAuthUI(user) {
    const desktopContainer = document.getElementById('user-display-desktop');
    const mobileContainer = document.getElementById('user-display-mobile');

    console.log("🔱 UI Update Chal Raha Hai... User Box Mila?", !!desktopContainer);
    // Agar containers HTML mein nahi mile, toh ruk jao aur error dikhao
    if (!desktopContainer && !mobileContainer) {
        console.error("🔱 ERROR: 'user-display-desktop' ID wala div HTML mein nahi hai!");
        return;
    }
    // Naya HTML (id hata kar data-lang lagaya hai taaki clash na ho)
    const langSwitcherHTML = `
        <div class="lang-switcher">
            <button onclick="window.changeLang('hi')" class="lang-btn" data-lang="hi">HI</button>
            <button onclick="window.changeLang('en')" class="lang-btn active" data-lang="en">EN</button>
        </div>
    `;

    if (user) {
        // --- LOGGED IN ---
        localStorage.setItem("userEmail", user.email);
        const firstName = user.displayName ? user.displayName.split(' ')[0].toUpperCase() : 'DEVOTEE';       
        // Profile photo with Sunehri (Gold) Border
        const photo = user.photoURL ? `<img src="${user.photoURL}" style="width:28px; height:28px; border-radius:50%; border: 1px solid var(--gold-main); object-fit:cover;">` : '';

        const loggedInHTML = `
            ${langSwitcherHTML}
            <div style="display:flex; align-items:center; gap:6px; margin-right:10px;">
                ${photo}
                <span class="user-welcome">PRANAM, ${firstName}</span>
            </div>
            <button onclick="window.logoutUser()" class="logout-btn-minimal">LOGOUT</button>
        `;
        
        if(desktopContainer) desktopContainer.innerHTML = loggedInHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedInHTML;
    } else {
        // --- LOGGED OUT ---
        localStorage.removeItem("userEmail");
        const loggedOutHTML = `
            ${langSwitcherHTML}
            <button onclick="window.loginWithGoogle()" class="auth-btn-divine">🔱 LOGIN</button>
        `;
        
        if(desktopContainer) desktopContainer.innerHTML = loggedOutHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedOutHTML;
    }
}
// 4. Safest Way to start Observer (HTML pura load hone ke baad hi start hoga)
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔱 HTML 100% Load ho gaya. Firebase Engine Start..."); 
    // Auth Engine chalu
    onAuthStateChanged(auth, (user) => {
        console.log("🔱 Firebase Status:", user ? "User is Here" : "No User");
        updateAuthUI(user);
    });
});

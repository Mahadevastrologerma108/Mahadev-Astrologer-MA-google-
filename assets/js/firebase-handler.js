/*1. AUTO-LOADER SYSTEM */
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

/*3. NOTIFICATION TOKEN SYNC*/
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
    } catch (err) { console.error("🔱 Token Sync Error:", err); }
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

            await addDoc(collection(db, "appointments"), subData);

            // ✅ Naya Telegram Message Formatting
            const tgMsg = `
🔱 *NEW APPOINTMENT RECEIVED* 🔱
--------------------------------
👤 *Name:* ${name}
✨ *Service:* ${service.toUpperCase()}
📞 *Contact:* ${contactDetail}
📡 *Method:* ${contactMethod}
🔑 *UID Requested:* ${wantsUID ? "YES" : "NO"}
📅 *Time:* ${new Date().toLocaleString('en-IN')}
--------------------------------
Check Firebase Console for full details.`;

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: tgMsg, parse_mode: 'Markdown' })
            });

            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset(); // ✅ Fixed here
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

/*6. AUTHENTICATION UI & ENGINE*/
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.logoutUser = () => signOut(auth).then(() => window.location.reload());

window.changeLang = (lang) => {
    localStorage.setItem("userLang", lang);
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`).forEach(btn => btn.classList.add('active'));
    if (typeof window.toggleLanguage === "function") window.toggleLanguage(); 
};
function updateAuthUI(user) {
    const desktopContainer = document.getElementById('user-display-desktop');
    const mobileContainer = document.getElementById('user-display-mobile');
   if (!desktopContainer && !mobileContainer) {
        setTimeout(() => updateAuthUI(user), 300); // Jab tak dabba na mile, pratiksha karega
        return;
    }
    const langSwitcherHTML = `
        <div class="lang-switcher">
            <button onclick="window.changeLang('hi')" class="lang-btn" data-lang="hi">HI</button>
            <button onclick="window.changeLang('en')" class="lang-btn active" data-lang="en">EN</button>
        </div>`;

    if (user) {
        localStorage.setItem("userEmail", user.email);
        const firstName = user.displayName ? user.displayName.split(' ')[0].toUpperCase() : 'DEVOTEE';       
        const photo = user.photoURL ? `<img src="${user.photoURL}" style="width:28px; height:28px; border-radius:50%; border: 1px solid var(--gold-main); object-fit:cover;">` : '';
        const loggedInHTML = `
            ${langSwitcherHTML}
            <div style="display:flex; align-items:center; gap:6px; margin-right:10px;">
                ${photo}
                <span class="user-welcome">PRANAM, ${firstName}</span>
            </div>
            <button onclick="window.logoutUser()" class="logout-btn-minimal">LOGOUT</button>`;
        if(desktopContainer) desktopContainer.innerHTML = loggedInHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedInHTML;
    } else {
        localStorage.removeItem("userEmail");
        const loggedOutHTML = `${langSwitcherHTML}<button onclick="window.loginWithGoogle()" class="auth-btn-divine">🔱 LOGIN</button>`;
        if(desktopContainer) desktopContainer.innerHTML = loggedOutHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedOutHTML;
    }
}

function startAuthObserver() {
    onAuthStateChanged(auth, (user) => {
        const dBox = document.getElementById('user-display-desktop');
        if (!dBox) {
            setTimeout(() => updateAuthUI(user), 500);
        } else {
            updateAuthUI(user);
        }
    });
}
document.addEventListener('DOMContentLoaded', startAuthObserver);

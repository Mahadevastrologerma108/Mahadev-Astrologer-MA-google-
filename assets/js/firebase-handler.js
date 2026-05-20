/* 🔱 MAHADEV HANDLER - MASTER VERSION (SECURE, MODULAR & ADMIN READY) */

/* ==========================================
   1. AUTO-LOADER SYSTEM
   ========================================== */
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

/* ==========================================
   2. CORE FIREBASE IMPORT & SECURITY KEYS
   ========================================== */
import { 
    db, auth, provider, remoteConfig, fetchAndActivate, getString 
} from './firebase-config.js'; 

// 🚩 Yahan maine 'updateDoc' jod diya hai jo reply save karne ke kaam aayega
import { 
    collection, addDoc, doc, setDoc, updateDoc, serverTimestamp, getDocs, query, orderBy, limit, where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
    signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Cache variables for keys
let cachedKeys = { hf: null, tg: null, cid: null };

/**
 * 🔐 SECURE KEY FETCH ENGINE
 */
async function getSecureKeys() {
    if (cachedKeys.hf && cachedKeys.tg) return cachedKeys;
    try {
        await fetchAndActivate(remoteConfig);
        cachedKeys.hf = getString(remoteConfig, 'HF_API_KEY');
        cachedKeys.tg = getString(remoteConfig, 'TG_BOT_TOKEN');
        cachedKeys.cid = getString(remoteConfig, 'TG_CHAT_ID');
        return cachedKeys;
    } catch (err) {
        console.error("🔱 Security Error: Key fetch failed", err);
        return null;
    }
}

console.log("🔱 Mahadev Handler: Fully Modular & Active.");

/* ==========================================
   3. NOTIFICATION TOKEN SYNC
   ========================================== */
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

/* ==========================================
   4. APPOINTMENT SYSTEM (TELEGRAM ALERT)
   ========================================== */
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        try {
            const keys = await getSecureKeys();

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

            if (keys && keys.tg && keys.cid) {
                const tgMsg = `🔱 <b>NEW APPOINTMENT</b> 🔱\n👤 <b>Name:</b> ${name}\n✨ <b>Service:</b> ${service.toUpperCase()}\n📞 <b>Contact:</b> ${contactDetail}\n📡 <b>Method:</b> ${contactMethod}\n🔑 <b>UID:</b> ${wantsUID ? "YES" : "NO"}\n📅 <b>Time:</b> ${new Date().toLocaleString()}`.trim();
                
                await fetch(`https://api.telegram.org/bot${keys.tg}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: keys.cid, text: tgMsg, parse_mode: 'HTML' })
                });
            }

            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset(); 
            if(window.applyFormLogic) window.applyFormLogic();
        
        } catch (err) {
            console.error("🔱 Form Error:", err);
            alert("Network error aaya hai, kripya puna prayas karein.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

/* ==========================================
   5. FEEDBACK, RATING & ADMIN REPLY SYSTEM
   ========================================== */

// A. Feedback Bhejne ka Engine
window.submitFeedback = async function() {
    const text = document.getElementById('user-feedback')?.value.trim();
    const rating = window.selectedRating || 0;
    const user = auth.currentUser;

    if (rating === 0) {
        alert("🔱 Pranaam! Kripya submit karne se pehle Star (⭐) dekar rating chunein.");
        return;
    }
    if (!text) {
        alert("🔱 Kripya apna anubhav (feedback) box mein likhein.");
        return;
    }

    try {
        await addDoc(collection(db, "feedbacks"), {
            text, 
            rating: parseInt(rating), 
            timestamp: serverTimestamp(), 
            status: "pending",
            userName: (user && user.email === "mannumani108@gmail.com") ? "MAHADEV ASTROLOGER MA" : (user ? user.displayName : "Mahadev Bhakt"),
            userPhoto: user ? user.photoURL : "assets/images/default-avatar.png",
            userId: user ? user.uid : "guest"
        });

        alert("🔱 Dhanyawad! Aapka feedback safaltapurvak bhej diya gaya hai. Approve hone ke baad yeh site par dikhega.");
        
        document.getElementById('user-feedback').value = "";
        window.selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => { 
            s.style.color = '#888'; 
            s.innerText = '☆'; 
        });

    } catch (e) { 
        console.error("🔱 Feedback Error:", e);
        alert("Network error aaya hai.");
    }
};

// B. Feedback Load aur Admin Reply Dikhane ka Engine
window.loadTestimonials = async function() {
    const testimonialContainer = document.getElementById('display-feedbacks'); 
    if (!testimonialContainer) return;

    // 🚩 CHECK: Kya aap login hain?
    const user = auth.currentUser;
    const isAdmin = user && user.email === "mannumani108@gmail.com";

    try {
        const q = query(
            collection(db, "feedbacks"),
            where("status", "==", "approved"),
            orderBy("timestamp", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        let html = "";

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const feedbackId = docSnap.id; // Is ID se hum reply link karenge
            const stars = "⭐".repeat(data.rating || 5); 

            // 1. Agar Admin ne reply diya hai toh ye dikhega (Sabko dikhega)
            const officialReplyHTML = data.adminReply ? `
                <div style="margin-top: 15px; padding: 12px; border-left: 3px solid var(--gold); background: rgba(245, 197, 66, 0.05); border-radius: 5px;">
                    <strong style="color: var(--gold); font-size: 0.85rem; font-family: 'Cinzel', serif;">🔱 MAHADEV ASTROLOGER MA:</strong>
                    <p style="margin: 5px 0 0; color: #ddd; font-size: 0.9rem; font-style: normal;">${data.adminReply}</p>
                </div>
            ` : "";

            // 2. Reply Likhne ka Dabba (Kewal Admin ko dikhega)
            const adminReplyTools = isAdmin ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #444;">
                    <textarea id="reply-input-${feedbackId}" placeholder="Bhakt ko uttar dein..." style="width: 100%; background: #000; color: #fff; border: 1px solid var(--gold); border-radius: 5px; padding: 8px; font-size: 0.85rem; font-family: inherit;">${data.adminReply || ''}</textarea>
                    <button onclick="window.submitAdminReply('${feedbackId}')" style="background: var(--gold); color: #000; border: none; padding: 6px 12px; font-size: 0.75rem; font-weight: bold; border-radius: 5px; cursor: pointer; margin-top: 8px;">
                        ${data.adminReply ? 'UPDATE REPLY' : 'SEND REPLY'}
                    </button>
                </div>
            ` : "";

            html += `
            <div class="testimonial-card" style="background: var(--card-bg, rgba(255,255,255,0.03)); padding: 20px; border-radius: 15px; border: 1px solid var(--gold); margin-bottom: 20px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
                    <img src="${data.userPhoto}" style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--gold); object-fit: cover;">
                    <div>
                        <h4 style="color: var(--gold); margin: 0; font-family: 'Cinzel', serif;">${data.userName}</h4>
                        <div style="font-size: 0.85rem;">${stars}</div>
                    </div>
                </div>
                <p style="color: #fff; font-size: 0.95rem; font-style: italic;">"${data.text}"</p>
                ${officialReplyHTML}
                ${adminReplyTools}
            </div>`;
        });

        testimonialContainer.innerHTML = html || "<p style='color:#888; text-align:center;'>Pehle anubhav likhne wale bhakt banein!</p>";
    } catch (error) {
        console.error("🔱 Testimonial Fetch Error:", error);
    }
};

// C. Admin Reply Firebase Bhejne ka Engine
window.submitAdminReply = async function(feedbackId) {
    const replyText = document.getElementById(`reply-input-${feedbackId}`).value.trim();
    
    if (!replyText) {
        alert("🔱 Kripya uttar (reply) box mein kuch likhein.");
        return;
    }

    try {
        const docRef = doc(db, "feedbacks", feedbackId);
        await updateDoc(docRef, {
            adminReply: replyText,
            repliedAt: serverTimestamp()
        });

        alert("🔱 Aapka uttar safaltapurvak site par jod diya gaya hai!");
        window.loadTestimonials(); // Page bina reload kiye naya data dikhayega
    } catch (e) {
        console.error("🔱 Admin Reply Error:", e);
        alert("Network error aaya hai.");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadTestimonials === 'function') loadTestimonials();
});

/* ==========================================
   6. AUTHENTICATION UI & ENGINE (WITH GLOBAL ADMIN BROADCAST)
   ========================================== */
window.loginWithGoogle = () => signInWithPopup(auth, provider);
window.logoutUser = () => signOut(auth).then(() => {
    localStorage.removeItem('isAdmin'); // Ensure admin state is wiped on logout
    window.location.reload();
});

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
        setTimeout(() => updateAuthUI(user), 300);
        return;
    }
    
    const currentLang = localStorage.getItem('selectedLang') || 'en';
    const langSwitcherHTML = `<div class="lang-switcher">
        <button onclick="window.changeLang('hi')" class="lang-btn ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi">HI</button>
        <button onclick="window.changeLang('en')" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
    </div>`;

    if (user) {
        localStorage.setItem("userEmail", user.email);
        
        // 🚩 ADMIN CHECK LOGIC FOR UI & GLOBAL AUTHORITY
        const isAdmin = user.email === "mannumani108@gmail.com";
        
        if (isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            // Broadcast the signal to the entire site (caught by products-handler.js)
            window.dispatchEvent(new CustomEvent('adminLoggedIn'));
            console.log("🔱 Admin Privileges Activated and Broadcasted.");
        } else {
            localStorage.removeItem('isAdmin');
        }

        const displayDisplayName = isAdmin 
            ? "MAHADEV ASTROLOGER MA" 
            : (user.displayName ? user.displayName.split(' ')[0].toUpperCase() : 'DEVOTEE');
            
        const photo = user.photoURL ? `<img src="${user.photoURL}" style="width:28px; height:28px; border-radius:50%; border: 1px solid var(--gold-main); object-fit:cover;">` : '';
        
        const loggedInHTML = `
            ${langSwitcherHTML}
            <div style="display:flex; align-items:center; gap:6px; margin-right:10px;">
                ${photo}
                <span class="user-welcome">PRANAM, ${displayDisplayName}</span>
            </div>
            <button onclick="window.logoutUser()" class="logout-btn-minimal">LOGOUT</button>
        `;
        
        if(desktopContainer) desktopContainer.innerHTML = loggedInHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedInHTML;
        
        // 🚩 Admin hone par reviews dobara load karo taaki reply dabba dikh jaye
        if (isAdmin && typeof window.loadTestimonials === 'function') {
             window.loadTestimonials();
        }
    } else {
        localStorage.removeItem("userEmail");
        localStorage.removeItem('isAdmin');
        const loggedOutHTML = `${langSwitcherHTML}<button onclick="window.loginWithGoogle()" class="auth-btn-divine">🔱 LOGIN</button>`;
        if(desktopContainer) desktopContainer.innerHTML = loggedOutHTML;
        if(mobileContainer) mobileContainer.innerHTML = loggedOutHTML;
    }
}

function startAuthObserver() {
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
    });
}
document.addEventListener('DOMContentLoaded', startAuthObserver);

/* 🔐 MAHADEV BOT BRIDGE (v2.1) */
window.getDivineKey = async function() {
    console.log("🔱 DivineKey Engine: Fetching secure token...");
    try {
        // Hum getSecureKeys function ko call kar rahe hain jo handler mein pehle se hai
        const keys = await getSecureKeys(); 
        
        if (keys && keys.hf) {
            console.log("🔱 DivineKey Engine: Token retrieved successfully.");
            return keys.hf; 
        } else {
            throw new Error("Token missing in Remote Config");
        }
    } catch (err) {
        console.error("🔱 DivineKey Engine Error:", err.message);
        return null;
    }
};

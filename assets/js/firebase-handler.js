// 1. Firebase Config se zaruri instances mangwayein
import { db, dbStudio, auth, provider } from './firebase-config.js'; 

// 2. Firestore ke liye zaruri tools (Appointments ke liye)
import { 
    collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 3. 🆕 Auth (Login) ke liye zaruri tools
import { 
    signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("🔱 Mahadev Handler: Login & Appointment System Active.");

// ==========================================
// 1. CONFIGURATION (TELEGRAM BOT)
// ==========================================
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// ==========================================
// 2. APPOINTMENT FORM LOGIC & TELEGRAM
// ==========================================
const appointmentForm = document.getElementById('consultation-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        try {
            const service = document.getElementById('service-select').value;
            const name = document.getElementById('user-name').value;
            const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
            const contactDetail = document.getElementById('contact-detail').value;
            
            // 🔱 नया: UID चेकबॉक्स का पता लगाना
            const wantsUID = document.getElementById('generate-uid').checked; 
            const uidText = wantsUID ? "Haan (Yes) ✅" : "Nahi (No) ❌";

            const subData = {
                service, name, contact_method: contactMethod, contact_detail: contactDetail,
                generate_uid: wantsUID,
                timestamp: serverTimestamp()
            };

            // 🔱 CORRECTED: सारा डेटा (Date, Time, Place) सही से कैप्चर करें
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
                subData.dob = document.getElementById('single-dob').value;
                subData.time = document.getElementById('single-time')?.value || "";
                subData.place = document.getElementById('single-place')?.value || "";
            }

            // 1. Save to Firestore
            await addDoc(collection(db, "appointments"), subData);

            // 2. Send Telegram Notification (UID के साथ)
            const tgMessage = `🔱 *New Appointment Request!*\n\n👤 *Name:* ${name}\n✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n📞 *Contact:* ${contactDetail} (${contactMethod})\n🔑 *UID Chahiye?:* ${uidText}`;
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
            });

            alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
            e.target.reset();
            window.applyFormLogic(); 

        } catch (err) { 
            console.error("🔱 Form Error:", err); 
            alert("Kshama karein, network error aaya. Kripya dobara prayas karein."); 
        } finally { 
            btn.innerText = "SEND REQUEST"; 
            btn.disabled = false; 
        }
    });
}

// ==========================================
// 3. SOUND HEALING SPECIAL LOGIC
// ==========================================
window.handleSoundHealingSubmit = async function(event, method, dosha) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button');
    const originalBtnText = btn.innerText;

    btn.innerText = "🔱 MAPPING VIBRATIONS...";
    btn.disabled = true;

    try {
        const name = form.querySelector('input[placeholder="Full Name"]').value;
        const contact = form.querySelector('input[type="tel"]').value;
        const extraInfo = form.querySelector('textarea')?.value || "None";
        
        let specificDetails = {};
        if (method === 'Kundali' || method === 'Numerology') {
            specificDetails.dob = form.querySelector('input[type="date"]').value;
            if(method === 'Kundali') {
                specificDetails.birth_time = form.querySelector('input[type="time"]').value;
                specificDetails.birth_place = form.querySelector('input[placeholder*="Place"]').value;
            }
        } else if (method === 'Palmistry') {
            specificDetails.current_location = form.querySelector('input[placeholder*="Location"]').value;
        }

        const subData = {
            service: "Sound Healing",
            method: method,
            detected_dosha: dosha,
            name: name,
            contact_detail: contact,
            details: specificDetails,
            notes: extraInfo,
            timestamp: serverTimestamp()
        };

        await addDoc(collection(db, "appointments"), subData);

        const tgMessage = `🔱 *New SOUND HEALING Request!*\n\n👤 *Name:* ${name}\n🌀 *Dosha:* ${dosha}\n🛠️ *Method:* ${method}\n📞 *Contact:* ${contact}\n📝 *Note:* ${extraInfo}`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
        });

        const container = document.getElementById('dosha-quiz-container');
        container.innerHTML = `
            <div class="divine-success" style="padding: 40px; text-align: center; animation: fadeIn 1s;">
                <div class="divine-symbol" style="font-size: 4rem; margin-bottom:20px;">🕉️</div>
                <h2 class="gold-text">VIBRATIONAL DATA CAPTURED!</h2>
                <p style="color: #fff; margin-top: 15px;">Mahadev ki kripa se aapki <b>Frequency Mapping</b> shuru ho gayi hai.</p>
                <div style="background: rgba(245,197,66,0.1); padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px dashed var(--gold);">
                    <p style="font-size: 0.95rem; line-height:1.6;">Hamare experts aapke <b>${dosha}</b> dosha aur planets ke hisaab se <b>Personalized Sound Frequency</b> calculate kar rahe hain.</p>
                </div>
                <p style="font-size: 0.8rem; color: #888;">Aapko WhatsApp par jald hi report aur 'Healing Key' mil jayegi.</p>
            </div>
        `;
        container.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error("🔱 Sound Form Error:", err);
        alert("Kshama karein, vibrations connect nahi ho payi. Dobara koshish karein.");
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
};

// ==========================================
// 4. FEEDBACK & RATING SYSTEM
// ==========================================
window.submitFeedback = async function() {
    const feedbackText = document.getElementById('user-feedback').value.trim();
    const rating = window.selectedRating || 0;
    const user = auth.currentUser;

    if (!feedbackText || rating === 0) {
        alert("Kripya rating aur anubhav dono bharein! 🚩");
        return;
    }

    try {
        const feedbackData = {
            text: feedbackText,
            rating: parseInt(rating),
            timestamp: serverTimestamp(),
            status: "pending", 
            userName: user ? user.displayName : "Anonymous Bhakt",
            userPhoto: user ? user.photoURL : "assets/images/default-avatar.png",
            userId: user ? user.uid : "guest"
        };

        await addDoc(collection(db, "feedbacks"), feedbackData);

        const tgMessage = `🔱 *MAHADEV ASTROLOGER MA*\n\n📝 *Naya Feedback Aaya!* (Pending)\n⭐ *Rating:* ${feedbackData.rating}/5\n👤 *User:* ${feedbackData.userName}\n💬 *Message:* ${feedbackData.text}\n\n🚩 _Ise approve karne ke liye .system-data logs kholiye._`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
        });

        alert("🔱 Dhanyawad! Aapka anubhav Mahadev tak pahunch gaya hai. Review ke baad ye site par dikhega.");
        
        document.getElementById('user-feedback').value = "";
        document.querySelectorAll('.star').forEach(s => s.style.color = '#555');
        window.selectedRating = 0;

    } catch (error) {
        console.error("🔱 Feedback Error:", error);
        alert("Kshama karein, saving error: " + error.message);
    }
};

window.fetchFeedbacks = async function() {
    const container = document.getElementById('display-feedbacks');
    if (!container) return;

    try {
        const feedbackRef = collection(db, "feedbacks");
        const q = query(feedbackRef, orderBy("timestamp", "desc"), limit(20));
        
        const snapshot = await getDocs(q);
        let html = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === "approved") {
                const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
                html += `
                    <div class="feedback-item" style="margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                            <img src="${data.userPhoto}" style="width:30px; height:30px; border-radius:50%; border:1px solid var(--gold);">
                            <span style="color:var(--gold); font-weight:600; font-size:0.9rem;">${data.userName}</span>
                        </div>
                        <div style="color: #f5c542; font-size: 1rem; letter-spacing:2px;">${stars}</div>
                        <p style="font-size: 0.95rem; color:#eee; margin: 8px 0; font-style: italic;">"${data.text}"</p>
                    </div>
                `;
            }
        });

        container.innerHTML = html || `<p style="color:#666;">Be the first to share your experience!</p>`;
    } catch (err) {
        console.error("🔱 Fetch Feedback Error:", err);
    }
};

// ==========================================
// 5. LOGIN & AUTH UI LOGIC
// ==========================================
window.loginWithGoogle = async () => {
    try { 
        await signInWithPopup(auth, provider); 
    } catch (err) { 
        console.error("Login Error:", err); 
        alert("Login failed. Please try again.");
    }
};

window.logoutUser = async () => {
    try { 
        await signOut(auth); 
        window.location.reload(); 
    } catch (err) { 
        console.error("Logout Error:", err); 
    }
};

const updateAuthUI = (user) => {
    const dBox = document.getElementById('user-display-desktop');
    const mBox = document.getElementById('user-display-mobile');

    const uiHtml = user ? `
        <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.05); padding:8px 15px; border-radius:50px; border:1px solid rgba(245,197,66,0.3);">
            <img src="${user.photoURL}" style="width:32px; height:32px; border-radius:50%; border:1.5px solid var(--gold-main); object-fit:cover;">
            <div style="text-align:left;">
                <p style="color:var(--gold-light); font-size:0.85rem; margin:0; font-weight:600; font-family:'Poppins';">Hi, ${user.displayName.split(' ')[0]}</p>
                <span onclick="window.logoutUser()" style="color:#ff4d4d; cursor:pointer; font-size:0.7rem; text-decoration:underline; font-weight:500;">Logout</span>
            </div>
        </div>` 
    : `<button onclick="window.loginWithGoogle()" class="gold-btn" style="cursor:pointer; padding:7px 15px; background:transparent; border:1px solid var(--gold); color:var(--gold); border-radius:4px; font-family:'Poppins'; font-size:0.8rem; transition:0.3s; font-weight:600;">LOGIN</button>`;

    if (dBox) dBox.innerHTML = uiHtml;
    
    if (mBox) {
        mBox.innerHTML = uiHtml;
        mBox.style.display = "flex";
        mBox.style.justifyContent = "center";
        mBox.style.marginTop = "15px"; 
    }
};

// ==========================================
// 6. INITIALIZATION (Smart Sync with Layout.js)
// ==========================================
const initGlobalAuth = () => {
    const checkHeader = setInterval(() => {
        const desktopTarget = document.getElementById('user-display-desktop');
        
        if (desktopTarget) {
            clearInterval(checkHeader); 
            console.log("🔱 Header Sync: Success. Activating Auth UI...");

            // 👑 NAYA CODE: एडमिन सिस्टम पहचान
            onAuthStateChanged(auth, (user) => { 
                if (user) {
                    localStorage.setItem("userEmail", user.email);
                } else {
                    localStorage.removeItem("userEmail");
                }
                updateAuthUI(user); 
            });

            if (typeof window.fetchFeedbacks === 'function') {
                window.fetchFeedbacks(); 
            }
        }
    }, 100); 

    setTimeout(() => clearInterval(checkHeader), 5000);
};

document.addEventListener('DOMContentLoaded', () => {
    initGlobalAuth();

    if (typeof window.applyFormLogic === 'function') {
        window.applyFormLogic(); 
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const val = e.target.getAttribute('data-value');
            window.selectedRating = val;
            document.querySelectorAll('.star').forEach(s => {
                s.style.color = s.getAttribute('data-value') <= val ? '#f5c542' : '#555';
            });
        }
    });

    console.log("🔱 MAHADEV ASTROLOGER MA: Global Handler Ready.");
});

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 🔱 TELEGRAM CONFIGURATION
// ==========================================
// Bhai yahan apna Token aur Chat ID daal dena
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

async function notifyTelegram(data) {
    let message = `🔱 *New Divine Request!* 🔱\n\n`;
    message += `👤 *Name:* ${data.name}\n`;
    message += `✨ *Service:* ${data.service.replace('_', ' ').toUpperCase()}\n`;
    message += `📱 *Method:* ${data.contact_method}\n`;
    message += `📍 *Detail:* \`${data.contact_detail}\` \n\n`;

    if (data.service === 'kundli_matching') {
        message += `♂️ *Male:* ${data.male_details.name} | ${data.male_details.dob}\n`;
        message += `♀️ *Female:* ${data.female_details.name} | ${data.female_details.dob}\n`;
    } else {
        message += `📅 *DOB:* ${data.dob}\n`;
        message += `⏰ *Time:* ${data.time}\n`;
        message += `🌍 *Place:* ${data.place}\n`;
    }
    
    message += `\n🆔 *UID Requested:* ${data.wants_uid ? '✅ Yes' : '❌ No'}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error("Telegram Notification Error:", err);
    }
}

// ==========================================
// 🔱 LOGIC 1: APPOINTMENT FORM (Smart & Integrated)
// ==========================================
const appointmentForm = document.getElementById('consultation-form');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "🔱 SENDING...";
        btn.disabled = true;

        const service = document.getElementById('service-select').value;
        const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
        const generateUID = document.getElementById('generate-uid').checked;

        let submissionData = {
            service: service,
            name: document.getElementById('user-name').value,
            contact_method: contactMethod,
            contact_detail: document.getElementById('contact-detail').value,
            wants_uid: generateUID,
            timestamp: serverTimestamp()
        };

        if (service === 'kundli_matching') {
            submissionData.male_details = {
                name: document.getElementById('m-name').value,
                dob: document.getElementById('m-dob').value,
                time: document.getElementById('m-time').value,
                place: document.getElementById('m-place').value
            };
            submissionData.female_details = {
                name: document.getElementById('f-name').value,
                dob: document.getElementById('f-dob').value,
                time: document.getElementById('f-time').value,
                place: document.getElementById('f-place').value
            };
        } else {
            submissionData.dob = document.getElementById('single-dob').value;
            submissionData.time = document.getElementById('single-time').value || "N/A";
            submissionData.place = document.getElementById('single-place').value || "N/A";
        }

        try {
            // 1. Firebase mein save
            await addDoc(collection(db, "appointments"), submissionData);
            
            // 2. Telegram par notify (Naya Logic 🔥)
            await notifyTelegram(submissionData);
            
            alert("🔱 Pranaam! Aapka sandesh Mahadev tak pahunch gaya hai. Hum jald hi sampark karenge.");
            e.target.reset();
            
            if(window.applyFormLogic) window.applyFormLogic();

        } catch (error) {
            console.error("Firebase Error: ", error);
            alert("Kshama karein, data save nahi ho paya. Humai direct WhatsApp karein.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// ==========================================
// 🔱 LOGIC 2: HEALING MUSIC (New Logic)
// ==========================================
// 1. Music List Fetch karne ka function
export async function fetchHealingMusic() {
    try {
        const musicCol = collection(db, 'healing_music');
        const q = query(musicCol, orderBy('order', 'asc')); // Order ke hisab se setup
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Music fetch error:", error);
        return [];
    }
}

// 2. Lyrics Sync karne ka logic
export function getCurrentLyric(currentTime, lyricsArray) {
    if (!lyricsArray || !Array.isArray(lyricsArray)) return "";
    const current = lyricsArray.find(l => currentTime >= l.start && currentTime <= l.end);
    return current ? current.text : "";
}

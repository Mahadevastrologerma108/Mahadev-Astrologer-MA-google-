// 🔱 Step 1: Imports
import { db, dbStudio } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("🔱 Handler Loaded Successfully!");

// 🔱 Step 2: Telegram Configuration
const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// 🔱 Step 3: Telegram Notification Function
async function notifyTelegram(data) {
    console.log("1. Preparing Telegram Message..."); 
    
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
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        const result = await response.json();
        console.log("2. Telegram Response:", result);
    } catch (err) {
        console.error("3. Telegram Notification Error:", err);
    }
}

// 🔱 Step 4: Appointment Form Logic
const appointmentForm = document.getElementById('consultation-form');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("4. Form Submit Clicked!");
        
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
            console.log("5. Sending to Firebase...");
            await addDoc(collection(db, "appointments"), submissionData);
            console.log("6. Firebase Success! Now calling Telegram...");
            
            await notifyTelegram(submissionData);
            
            alert("🔱 Pranaam! Aapka sandesh Mahadev tak pahunch gaya hai.");
            e.target.reset();

        } catch (error) {
            console.error("7. Final Error: ", error);
            alert("Kshama karein, data save nahi ho paya.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// 🔱 Step 5: Helper Functions (Window scope fix)
window.applyFormLogic = function() {
    const service = document.getElementById('service-select').value;
    const matchingSection = document.getElementById('section-matching');
    const singleSection = document.getElementById('section-single');
    const palmInstruction = document.getElementById('palm-instruction');

    if (service === 'kundli_matching') {
        matchingSection.style.display = 'block';
        singleSection.style.display = 'none';
        palmInstruction.style.display = 'none';
    } else if (service === 'palmistry') {
        matchingSection.style.display = 'none';
        singleSection.style.display = 'block';
        palmInstruction.style.display = 'block';
    } else {
        matchingSection.style.display = 'none';
        singleSection.style.display = 'block';
        palmInstruction.style.display = 'none';
    }
};

window.syncContactMethod = function(method) {
    const contactInput = document.getElementById('contact-detail');
    const warning = document.getElementById('email-warning');
    if (method === 'WA') {
        contactInput.placeholder = "WhatsApp Number";
        warning.style.display = 'none';
    } else if (method === 'TG') {
        contactInput.placeholder = "Telegram Username/@id";
        warning.style.display = 'none';
    } else {
        contactInput.placeholder = "Email Address";
        warning.style.display = 'block';
    }
};

// 🔱 Step 6: Healing Music Logic
export async function fetchHealingMusic() {
    try {
        const musicCol = collection(dbStudio, 'healing_music');
        const q = query(musicCol, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Music fetch error:", error);
        return [];
    }
}

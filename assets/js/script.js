import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// 1. UI Toggle Logic (PRO Version)
window.updateFormDisplay = function() {
    const service = document.getElementById('service-select').value;
    const secSingle = document.getElementById('section-single');
    const secMatch = document.getElementById('section-matching');
    const secPalm = document.getElementById('section-palm');
    const birthFields = document.getElementById('birth-fields');

    secSingle.style.display = (service === 'kundli_matching') ? 'none' : 'block';
    secMatch.style.display = (service === 'kundli_matching') ? 'block' : 'none';
    secPalm.style.display = (service === 'palmistry' || service === 'combo_analysis') ? 'block' : 'none';
    
    // Numerology Logic: DOB required, Time/Place hidden
    if(service === 'numerology') {
        birthFields.style.display = 'block';
        document.getElementById('single-time').style.display = 'none';
        document.getElementById('single-place').style.display = 'none';
    } else {
        document.getElementById('single-time').style.display = 'block';
        document.getElementById('single-place').style.display = 'block';
    }
}

// 2. Submission & Messaging Logic
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const service = document.getElementById('service-select').value;
    btn.innerText = "TRANSMITTING...";
    btn.disabled = true;

    try {
        let finalData = { service: service, timestamp: serverTimestamp() };
        let waMessage = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n✨ *Service:* ${service.toUpperCase()}\n`;

        if (service === 'kundli_matching') {
            finalData.male = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value, time: document.getElementById('m-time').value, place: document.getElementById('m-place').value };
            finalData.female = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value, time: document.getElementById('f-time').value, place: document.getElementById('f-place').value };
            waMessage += `👦 Male: ${finalData.male.name} | ${finalData.male.dob}\n👧 Female: ${finalData.female.name} | ${finalData.female.dob}`;
        } else {
            finalData.client = { name: document.getElementById('user-name').value, dob: document.getElementById('single-dob').value };
            waMessage += `👤 Name: ${finalData.client.name}\n📅 DOB: ${finalData.client.dob}\n`;
            if (service !== 'numerology') {
                finalData.client.time = document.getElementById('single-time').value;
                finalData.client.place = document.getElementById('single-place').value;
                waMessage += `⏰ Time: ${finalData.client.time}\n📍 Place: ${finalData.client.place}`;
            }
        }

        // A. Save to Firebase
        await addDoc(collection(db, "appointments"), finalData);

        // B. Redirect to WhatsApp
        const waNum = "91XXXXXXXXXX"; // Apna number yahan dalo
        window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`, '_blank');

        alert("🔱 Data Saved & WhatsApp Opened!");
        e.target.reset();
        updateFormDisplay();
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Invoke Guidance";
        btn.disabled = false;
    }
});
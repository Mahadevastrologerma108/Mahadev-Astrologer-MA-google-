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

// ==========================================
// 🔱 PATCH 1: HAMBURGER MENU LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu');
    const navDrawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('close-menu');

    if(menuBtn && navDrawer && overlay) {
        menuBtn.onclick = () => {
            navDrawer.style.right = '0';
            overlay.style.display = 'block';
        };

        const hideMenu = () => {
            navDrawer.style.right = '-100%';
            overlay.style.display = 'none';
        };

        if(closeBtn) closeBtn.onclick = hideMenu;
        overlay.onclick = hideMenu;
    }
});

// ==========================================
// 🔱 PATCH 2: SMART UI LOGIC (Updated for Palmistry)
// ==========================================
window.updateFormDisplay = function() {
    const service = document.getElementById('service-select').value;
    const secSingle = document.getElementById('section-single');
    const secMatch = document.getElementById('section-matching');
    const birthFields = document.getElementById('birth-fields');
    
    // Naye elements jo humne index.html mein group kiye hain
    const timePlaceGroup = document.getElementById('time-place-group');
    const palmInst = document.getElementById('palm-instruction');

    // Section Visibility
    secSingle.style.display = (service === 'kundli_matching') ? 'none' : 'block';
    if(secMatch) secMatch.style.display = (service === 'kundli_matching') ? 'block' : 'none';

    if (service === 'palmistry') {
        // ✋ Palmistry: No Birth Details, Only Instructions
        if(birthFields) birthFields.style.display = 'none';
        if(palmInst) palmInst.style.display = 'block';
    } 
    else if (service === 'numerology') {
        // 🔢 Numerology: Only DOB
        if(birthFields) birthFields.style.display = 'block';
        if(timePlaceGroup) timePlaceGroup.style.display = 'none';
        if(palmInst) palmInst.style.display = 'none';
    } 
    else {
        // 📜 Kundali/Combo: Everything
        if(birthFields) birthFields.style.display = 'block';
        if(timePlaceGroup) timePlaceGroup.style.display = 'grid';
        if(palmInst) palmInst.style.display = (service === 'combo_analysis') ? 'block' : 'none';
    }
}

// Form initial load par bhi display sahi rakhe
document.addEventListener('DOMContentLoaded', updateFormDisplay);

// ==========================================
// 3. Submission & Messaging Logic
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const service = document.getElementById('service-select').value;
    btn.innerText = "🔱 CONNECTING...";
    btn.disabled = true;

    try {
        let finalData = { service: service, timestamp: serverTimestamp() };
        let waMessage = `🔱 *MAHADEV ASTROLOGER MA* 🔱\n✨ *Service:* ${service.toUpperCase()}\n`;

        if (service === 'kundli_matching') {
            finalData.male = { 
                name: document.getElementById('m-name').value, 
                dob: document.getElementById('m-dob').value, 
                time: document.getElementById('m-time').value, 
                place: document.getElementById('m-place').value 
            };
            finalData.female = { 
                name: document.getElementById('f-name').value, 
                dob: document.getElementById('f-dob').value, 
                time: document.getElementById('f-time').value, 
                place: document.getElementById('f-place').value 
            };
            waMessage += `👦 Male: ${finalData.male.name}\n👧 Female: ${finalData.female.name}`;
        } else {
            finalData.client = { name: document.getElementById('user-name').value };
            waMessage += `👤 Name: ${finalData.client.name}\n`;
            
            if (service !== 'palmistry') {
                finalData.client.dob = document.getElementById('single-dob').value;
                waMessage += `📅 DOB: ${finalData.client.dob}\n`;
            }

            if (service !== 'numerology' && service !== 'palmistry') {
                finalData.client.time = document.getElementById('single-time').value;
                finalData.client.place = document.getElementById('single-place').value;
                waMessage += `⏰ Time: ${finalData.client.time}\n📍 Place: ${finalData.client.place}`;
            }

            if (service === 'palmistry' || service === 'combo_analysis') {
                waMessage += `\n📸 *Note:* Sending hand photos now...`;
            }
        }

        await addDoc(collection(db, "appointments"), finalData);

        const waNum = "91XXXXXXXXXX"; // 🔥 Apna No. dalo
        window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`, '_blank');

        alert("🔱 Success!");
        e.target.reset();
        updateFormDisplay();
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Invoke Guidance";
        btn.disabled = false;
    }
});
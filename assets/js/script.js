// ==========================================
// 1. HAMBURGER & UI INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Menu Logic
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
    updateFormDisplay();
});

// ==========================================
// 2. CONTACT METHOD TOGGLE
// ==========================================
window.toggleContactInput = function(type) {
    const input = document.getElementById('contact-info');
    input.placeholder = (type === 'TG') ? "@Telegram_Username" : "Aapka WhatsApp Number";
    input.type = (type === 'TG') ? "text" : "tel";
}

// ==========================================
// 3. SMART FORM DISPLAY LOGIC
// ==========================================
window.updateFormDisplay = function() {
    const service = document.getElementById('service-select').value;
    const secSingle = document.getElementById('section-single');
    const secMatch = document.getElementById('section-matching');
    const birthFields = document.getElementById('birth-fields');
    const timePlace = document.getElementById('time-place-group');
    const palmInst = document.getElementById('palm-instruction');

    // Reset visibility
    secSingle.style.display = (service === 'kundli_matching') ? 'none' : 'block';
    secMatch.style.display = (service === 'kundli_matching') ? 'block' : 'none';

    if (service === 'palmistry') {
        birthFields.style.display = 'none';
        palmInst.style.display = 'block';
    } else if (service === 'numerology') {
        birthFields.style.display = 'block';
        timePlace.style.display = 'none';
        palmInst.style.display = 'none';
    } else {
        birthFields.style.display = 'block';
        timePlace.style.display = 'grid';
        palmInst.style.display = (service === 'combo_analysis') ? 'block' : 'none';
    }
}

// ==========================================
// 4. DATA SUBMISSION (FIREBASE + REDIRECT)
// ==========================================
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const service = document.getElementById('service-select').value;
    const method = document.querySelector('input[name="contact-method"]:checked').value;
    const contact = document.getElementById('contact-info').value;
    
    btn.innerText = "🔱 CONNECTING...";
    btn.disabled = true;

    try {
        let finalData = { 
            service: service, 
            contact_method: method, 
            contact_info: contact,
            timestamp: new Date() 
        };

        let msg = `🔱 *MAHADEV ASTROLOGER* 🔱\n✨ *Service:* ${service.toUpperCase()}\n`;
        msg += `👤 *User:* ${document.getElementById('user-name').value || 'Matching Request'}\n`;
        msg += `📞 *${method}:* ${contact}\n`;

        if (service === 'kundli_matching') {
            finalData.male = { name: document.getElementById('m-name').value, dob: document.getElementById('m-dob').value };
            finalData.female = { name: document.getElementById('f-name').value, dob: document.getElementById('f-dob').value };
            msg += `👦 Male: ${finalData.male.name}\n👧 Female: ${finalData.female.name}`;
        } else {
            if (service !== 'palmistry') msg += `📅 DOB: ${document.getElementById('single-dob').value}\n`;
            if (service === 'kundli_making' || service === 'combo_analysis') {
                msg += `⏰ Time: ${document.getElementById('single-time').value}\n📍 Place: ${document.getElementById('single-place').value}`;
            }
            if (service === 'palmistry' || service === 'combo_analysis') msg += `\n📸 Sending Palm Photos...`;
        }

        // 1. Save to Firebase (Change to your actual db call if needed)
        // await addDoc(collection(db, "appointments"), finalData);

        // 2. Redirect based on method
        if (method === 'Telegram') {
            window.open(`https://t.me/YOUR_TG_USERNAME?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
        }

        alert("🔱 Success! Redirecting...");
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Invoke Divine Guidance";
        btn.disabled = false;
    }
});
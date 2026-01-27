/* ==========================================
   MASTER JS: MAHADEV ASTROLOGER MA
   ========================================== */

// 1. SIDEBAR NAVIGATION LOGIC
const menuBtn = document.getElementById('mobile-menu');
const drawer = document.getElementById('nav-drawer');

if(menuBtn) {
    menuBtn.onclick = () => {
        drawer.classList.toggle('active');
    }
}

// 2. FORM DYNAMIC FIELDS & WHATSAPP SUBMISSION
function updateForm() {
    const service = document.getElementById('service-select')?.value;
    const extra = document.getElementById('extra-fields');
    const palm = document.getElementById('palmistry-fields');
    
    if(extra) extra.style.display = (service === 'kundli') ? 'block' : 'none';
    if(palm) palm.style.display = (service === 'palmistry') ? 'block' : 'none';
}

// WhatsApp Submission Logic
const astroForm = document.getElementById('consultation-form');
if(astroForm) {
    astroForm.onsubmit = function(e) {
        e.preventDefault();
        const name = astroForm.querySelector('input[type="text"]').value;
        const service = document.getElementById('service-select').value;
        const consent = document.getElementById('save-data')?.checked ? "YES (User Permitted)" : "NO (Don't Save)";
        
        // WhatsApp link setup (Replace YOUR_NUMBER with your actual WhatsApp number)
        const wpNumber = "91XXXXXXXXXX"; 
        const message = `*New Consultation Request*%0A%0A*Name:* ${name}%0A*Service:* ${service}%0A*Permission to Save Data:* ${consent}`;
        
        window.open(`https://wa.me/${wpNumber}?text=${message}`, '_blank');
    };
}

// 3. PANCHANG ENGINE (Full Year 2026)
const panchangData = {
    0: { name: "January", purnima: [2, 3], amavasya: [18], ekadashi: [14, 29], festivals: ["1: नयवर्ष", "14: मकर संक्रांति", "23: वसंत पंचमी"] },
    1: { name: "February", purnima: [1], amavasya: [17], ekadashi: [13, 27], festivals: ["15: महाशिवरात्रि"] },
    2: { name: "March", purnima: [2, 3], amavasya: [18, 19], ekadashi: [15, 29], festivals: ["2: होलिका दहन", "3: होली"] },
    3: { name: "April", purnima: [1, 2], amavasya: [17], ekadashi: [13, 27], festivals: ["2: हनुमान जयंती", "20: अक्षय तृतीya"] },
    4: { name: "May", purnima: [1, 30, 31], amavasya: [16], ekadashi: [13, 27], festivals: ["1: बुद्ध जयंती"] },
    5: { name: "June", purnima: [29], amavasya: [14, 15], ekadashi: [11, 25], festivals: ["25: निर्जला एकादशी"] },
    6: { name: "July", purnima: [29], amavasya: [14], ekadashi: [10, 25], festivals: ["29: गुरु पूर्णिमा"] },
    7: { name: "August", purnima: [27, 28], amavasya: [12], ekadashi: [9, 23], festivals: ["15: स्वतंत्रता दिवस", "28: रक्षाबंधन"] },
    8: { name: "September", purnima: [26], amavasya: [10, 11], ekadashi: [7, 21], festivals: ["4: जन्माष्टमी", "14: गणेश चतुर्थी"] },
    9: { name: "October", purnima: [25, 26], amavasya: [10], ekadashi: [6, 22], festivals: ["11: नवरात्र आरम्भ", "20: विजयादशमी"] },
    10: { name: "November", purnima: [24], amavasya: [8, 9], ekadashi: [5, 20], festivals: ["8: दीपावली", "24: देव दीपावली"] },
    11: { name: "December", purnima: [23, 24], amavasya: [8], ekadashi: [4, 20], festivals: ["14: श्रीराम विवाहोत्सव"] }
};

function renderPanchang() {
    const m = document.getElementById('month-select')?.value;
    const grid = document.getElementById('calendar-grid');
    const list = document.getElementById('festival-list');
    if(!grid || m === undefined) return;

    grid.innerHTML = ''; list.innerHTML = '';
    const data = panchangData[m];

    for (let i = 1; i <= 31; i++) {
        let day = document.createElement('div');
        day.className = 'calendar-day';
        day.innerHTML = `<span>${i}</span>`;
        if (data.purnima.includes(i)) day.classList.add('day-purnima');
        if (data.amavasya.includes(i)) day.classList.add('day-amavasya');
        if (data.ekadashi.includes(i)) day.classList.add('day-ekadashi');
        grid.appendChild(day);
    }
    data.festivals.forEach(f => {
        let li = document.createElement('li'); li.style.padding="5px 0"; li.innerText = f; list.appendChild(li);
    });
}

// 4. INITIALIZE EVERYTHING
window.onload = () => {
    const mSelect = document.getElementById('month-select');
    if(mSelect) {
        Object.keys(panchangData).forEach(k => {
            let opt = document.createElement('option'); opt.value = k;
            opt.innerText = panchangData[k].name; mSelect.appendChild(opt);
        });
        renderPanchang();
    }
    updateForm(); // Initial form state
};
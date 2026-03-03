/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Folder: masterstroke-module/
 */

let currentStep = 1;
let scores = [];

// 1. Navgrah Database
const soundDatabase = {
    planets: [
        { name: "Sun (Surya)", raag: "Bilawal", time: "Sunrise", status: "🔐 Locked", effect: "Soul Power" },
        { name: "Moon (Chandra)", raag: "Bhairavi", time: "Anytime", status: "🔐 Locked", effect: "Mental Peace" },
        { name: "Mars (Mangal)", raag: "Bhairav", time: "Dawn", status: "🔐 Locked", effect: "Willpower" },
        { name: "Mercury (Budh)", raag: "Kafi", time: "Daytime", status: "🔐 Locked", effect: "Intellect" },
        { name: "Jupiter (Guru)", raag: "Yaman", time: "Evening", status: "🔐 Locked", effect: "Luck & Growth" },
        { name: "Venus (Shukra)", raag: "Khamaj", time: "Night", status: "🔐 Locked", effect: "Prosperity" },
        { name: "Saturn (Shani)", raag: "Todi", time: "Morning", status: "🔐 Locked", effect: "Discipline" },
        { name: "Rahu (North Node)", raag: "Asavari", time: "Twilight", status: "🔐 Locked", effect: "Shadow Clearing" },
        { name: "Ketu (South Node)", raag: "Shree", time: "Midnight", status: "🔐 Locked", effect: "Intuition" }
    ]
};

// 2. Load Table
function loadTable() {
    const tableBody = document.getElementById('resonance-data-body');
    if(tableBody) {
        let rows = "";
        soundDatabase.planets.forEach(p => {
            rows += `<tr>
                <td><b>${p.name}</b><br><small style="color:#666;">${p.effect}</small></td>
                <td>${p.raag}</td>
                <td class="gold-text">${p.status}</td>
            </tr>`;
        });
        tableBody.innerHTML = rows;
    }
}

// 3. Quiz Navigation
window.checkDoshaOptionB = function() {
    document.getElementById('start-quiz-btn').style.display = 'none';
    const container = document.getElementById('dosha-quiz-container');
    container.style.display = 'block';
}

window.nextStep = function(val) {
    scores.push(val);
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const quizUI = document.getElementById('quiz-ui');
    
    quizUI.style.display = 'block';

    if(currentStep === 1) {
        questionPara.innerText = "2. Aapka swabhava (nature) kaisa hai?";
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">Chanchal (Restless)</button>
            <button class="quiz-opt" onclick="nextStep('B')">Tez/Gusse wala (Fiery)</button>
            <button class="quiz-opt" onclick="nextStep('C')">Shant (Calm/Stable)</button>
        `;
        currentStep++;
    } else if(currentStep === 2) {
        questionPara.innerText = "3. Mausam ka asar aap par kaisa hota hai?";
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">Thand zyada lagti hai</button>
            <button class="quiz-opt" onclick="nextStep('B')">Garmi bardasht nahi hoti</button>
            <button class="quiz-opt" onclick="nextStep('C')">Moisture se pareshani</button>
        `;
        currentStep++;
    } else {
        showFinalResult();
    }
}

// 4. Final Result & Method Selection
function showFinalResult() {
    let finalDosha = (scores[0] === 'A') ? "VATA" : (scores[0] === 'B' ? "PITTA" : "KAPHA");
    const container = document.getElementById('dosha-quiz-container');
    
    container.innerHTML = `
        <div class="result-box divine-success">
            <h2 class="gold-text">Result: ${finalDosha} Dominant</h2>
            <p>Select a method to unlock your Frequency Chart:</p>
            <div style="margin-top:20px;">
                <button class="method-btn" onclick="loadDivineForm('Kundali', '${finalDosha}')">🔱 Via Kundali</button>
                <button class="method-btn" onclick="loadDivineForm('Palmistry', '${finalDosha}')">✋ Via Palmistry</button>
                <button class="method-btn" onclick="loadDivineForm('Numerology', '${finalDosha}')">🔢 Via Numerology</button>
            </div>
        </div>
    `;
    document.getElementById('dosha-warning').style.display = 'block';
}

// 5. Dynamic Form with Firebase Trigger
window.loadDivineForm = function(method, dosha) {
    const container = document.getElementById('dosha-quiz-container');
    let formHTML = `
        <div class="magical-form-box">
            <h3 class="gold-text">🔱 ${method} Analysis</h3>
            <p style="font-size:0.8rem; margin-bottom:20px; color:#aaa;">Frequency Mapping for: <b>${dosha}</b></p>
            <form id="healing-contact-form" onsubmit="handleFinalSubmit(event, '${method}', '${dosha}')">
                <input type="text" id="cust_name" placeholder="Full Name" required class="form-input">
    `;

    if (method === 'Kundali') {
        formHTML += `<input type="date" id="cust_dob" required class="form-input">
                     <input type="time" id="cust_time" required class="form-input">
                     <input type="text" id="cust_place" placeholder="Birth Place" required class="form-input">`;
    } else if (method === 'Palmistry') {
        formHTML += `<input type="text" id="cust_loc" placeholder="Current Location" required class="form-input">
                     <div class="palm-instruction">📸 Keep hand photos ready for WhatsApp.</div>`;
    } else {
        formHTML += `<input type="date" id="cust_dob" required class="form-input">
                     <input type="text" id="cust_name_spell" placeholder="Name Spelling" required class="form-input">`;
    }

    formHTML += `
                <input type="tel" id="cust_whatsapp" placeholder="WhatsApp Number" required class="form-input">
                <textarea id="cust_issue" placeholder="Any specific issue?" class="form-input" style="height:80px;"></textarea>
                <button type="submit" class="method-btn" style="background:var(--gold); color:#000;">INVOKE FREQUENCY MAPPING ➔</button>
            </form>
        </div>
    `;
    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

// 6. The Bridge to Firebase
function handleFinalSubmit(event, method, dosha) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('cust_name').value,
        whatsapp: document.getElementById('cust_whatsapp').value,
        issue: document.getElementById('cust_issue').value || "NA",
        method: method,
        dosha: dosha,
        type: "Sound Healing Request",
        timestamp: new Date().toISOString()
    };

    // Linking to your main firebase-handler
    if (window.handleSoundHealingSubmit) {
        window.handleSoundHealingSubmit(formData);
        document.getElementById('dosha-quiz-container').innerHTML = `
            <div class="divine-success">
                <h3 class="gold-text">Pranam, ${formData.name}!</h3>
                <p>Aapka data Mahadev Astrologer MA ke pas surakshit pahunch gaya hai. Hamari team jald hi aapse sampark karegi.</p>
                <div style="font-size:3rem; margin-top:20px;">🐚</div>
            </div>
        `;
    } else {
        alert("System connecting... Please try again in a moment.");
    }
}

document.addEventListener('DOMContentLoaded', loadTable);
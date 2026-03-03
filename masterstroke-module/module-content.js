/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Folder: masterstroke-module/
 */

let currentStep = 1;
let scores = [];

// 1. Navgrah Database (Perfect as it is)
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
                <td style="padding:15px; border:1px solid rgba(245,197,66,0.1);"><b>${p.name}</b><br><small style="color:#666;">${p.effect}</small></td>
                <td style="padding:15px; border:1px solid rgba(245,197,66,0.1);">${p.raag}</td>
                <td class="gold-text" style="padding:15px; border:1px solid rgba(245,197,66,0.1);">${p.status}</td>
            </tr>`;
        });
        tableBody.innerHTML = rows;
    }
}

// 3. Quiz Navigation (Fixed Flow)
window.checkDoshaOptionB = function() {
    document.getElementById('start-quiz-btn').style.display = 'none';
    const quizUI = document.getElementById('quiz-ui');
    quizUI.style.display = 'block';
    
    // Load Question 1 Immediately
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    
    questionPara.innerText = "1. Aapki skin aur body ka prakriti kaisa hai?";
    optionsDiv.innerHTML = `
        <button class="quiz-opt" onclick="nextStep('A')">Rukhi/Dry (Vata)</button>
        <button class="quiz-opt" onclick="nextStep('B')">Sensitive/Garm (Pitta)</button>
        <button class="quiz-opt" onclick="nextStep('C')">Soft/Oily (Kapha)</button>
    `;
}

window.nextStep = function(val) {
    scores.push(val);
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

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
            <button class="quiz-opt" onclick="nextStep('C')">Moisture/Humidity se pareshani</button>
        `;
        currentStep++;
    } else {
        showFinalResult();
    }
}

// 4. Final Result (Added UI styling for better Vibe)
function showFinalResult() {
    let finalDosha = (scores[0] === 'A') ? "VATA" : (scores[0] === 'B' ? "PITTA" : "KAPHA");
    const container = document.getElementById('dosha-quiz-container');

    container.innerHTML = `
        <div class="result-box divine-success" style="padding:20px; text-align:center;">
            <h2 class="gold-text" style="font-family:'Cinzel';">Dosha: ${finalDosha} Dominant</h2>
            <p style="color:#ccc;">Select your preferred method to unlock your Frequency Chart:</p>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                <button class="quiz-opt" onclick="loadDivineForm('Kundali', '${finalDosha}')">🔱 Via Kundali (Most Accurate)</button>
                <button class="quiz-opt" onclick="loadDivineForm('Palmistry', '${finalDosha}')">✋ Via Palmistry</button>
                <button class="quiz-opt" onclick="loadDivineForm('Numerology', '${finalDosha}')">🔢 Via Numerology</button>
            </div>
        </div>
    `;
    document.getElementById('dosha-warning').style.display = 'block';
}

// 5. Dynamic Form (Added form-input styles in JS for safety)
window.loadDivineForm = function(method, dosha) {
    const container = document.getElementById('dosha-quiz-container');
    let formHTML = `
        <div class="magical-form-box" style="padding:20px;">
            <h3 class="gold-text" style="font-family:'Cinzel';">🔱 ${method} Analysis</h3>
            <p style="font-size:0.8rem; margin-bottom:20px; color:#aaa;">Mapping frequencies for your <b>${dosha}</b> profile.</p>
            <form id="healing-contact-form" onsubmit="handleFinalSubmit(event, '${method}', '${dosha}')">
                <input type="text" id="cust_name" placeholder="Purn Naam (Full Name)" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">
                <input type="tel" id="cust_whatsapp" placeholder="WhatsApp Number" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">
    `;

    if (method === 'Kundali') {
        formHTML += `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <input type="date" id="cust_dob" required class="quiz-opt" style="font-size:0.8rem;">
                <input type="time" id="cust_time" required class="quiz-opt" style="font-size:0.8rem;">
            </div>
            <input type="text" id="cust_place" placeholder="Birth Place (City/State)" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">`;
    } else if (method === 'Palmistry') {
        formHTML += `<p style="color:var(--gold); font-size:0.8rem;">📸 Note: Please send clear photos of both palms on WhatsApp after submitting.</p>`;
    }

    formHTML += `
                <textarea id="cust_issue" placeholder="Aapki mukhya samasya? (Optional)" class="quiz-opt" style="height:80px; text-align:left; background:rgba(255,255,255,0.05);"></textarea>
                <button type="submit" class="quiz-opt" style="background:var(--gold); color:#000; font-weight:bold; margin-top:20px;">INVOKE FREQUENCY MAPPING ➔</button>
            </form>
        </div>
    `;
    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

// 6. Submit Logic
function handleFinalSubmit(event, method, dosha) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('cust_name').value,
        whatsapp: document.getElementById('cust_whatsapp').value,
        issue: document.getElementById('cust_issue').value || "NA",
        method: method,
        dosha: dosha,
        type: "Sound Healing Request",
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime()
    };

    // Global bridge to firebase-handler.js
    if (window.handleSoundHealingSubmit) {
        window.handleSoundHealingSubmit(formData);
        document.getElementById('dosha-quiz-container').innerHTML = `
            <div style="padding:40px; text-align:center;">
                <div style="font-size:3rem; margin-bottom:20px;">🐚</div>
                <h3 class="gold-text" style="font-family:'Cinzel';">Pranam, ${formData.name}!</h3>
                <p>Aapka anurodh (request) Mahadev Astrologer MA tak pahunch gaya hai. Jald hi aapse WhatsApp par sampark kiya jayega.</p>
            </div>
        `;
    } else {
        console.error("Firebase Bridge Missing!");
        alert("System busy. Please try again or contact via WhatsApp directly.");
    }
}

document.addEventListener('DOMContentLoaded', loadTable);
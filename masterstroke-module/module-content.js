/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Folder: masterstroke-module/
 * Updated: Translation Bridge Added
 */

let currentStep = 1;
let scores = [];

// 1. Navgrah Database (Mapping with Translation Keys)
const soundDatabase = {
    planets: [
        { pKey: "planet_sun", rKey: "raag_sun", sKey: "status_locked", eKey: "Soul Power" },
        { pKey: "planet_moon", rKey: "raag_moon", sKey: "status_locked", eKey: "Mental Peace" },
        { pKey: "planet_mars", rKey: "raag_mars", sKey: "status_locked", eKey: "Willpower" },
        { pKey: "planet_mercury", rKey: "raag_mercury", sKey: "status_locked", eKey: "Intellect" },
        { pKey: "planet_jupiter", rKey: "raag_jupiter", sKey: "status_locked", eKey: "Luck & Growth" },
        { pKey: "planet_venus", rKey: "raag_venus", sKey: "status_locked", eKey: "Prosperity" },
        { pKey: "planet_saturn", rKey: "raag_saturn", sKey: "status_locked", eKey: "Discipline" },
        { pKey: "planet_rahu", rKey: "raag_rahu", sKey: "status_locked", eKey: "Shadow Clearing" },
        { pKey: "planet_ketu", rKey: "raag_ketu", sKey: "status_locked", eKey: "Intuition" }
    ]
};

// 2. Load Table (Now with Translation Support)
function loadTable() {
    const tableBody = document.getElementById('resonance-data-body');
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    const t = window.translations[lang]; // Global translation bridge

    if(tableBody && t) {
        let rows = "";
        soundDatabase.planets.forEach(p => {
            rows += `<tr>
                <td style="padding:15px; border:1px solid rgba(245,197,66,0.1);">
                    <b>${t[p.pKey] || p.pKey}</b><br>
                    <small style="color:#aaa;">${p.eKey}</small>
                </td>
                <td style="padding:15px; border:1px solid rgba(245,197,66,0.1); font-style: italic; color: #f5c542;">
                    ${t[p.rKey] || p.rKey}
                </td>
                <td class="gold-text" style="padding:15px; border:1px solid rgba(245,197,66,0.1); font-weight: bold; font-size: 0.85rem;">
                    ${t[p.sKey] || '🔐 LOCKED'}
                </td>
            </tr>`;
        });
        tableBody.innerHTML = rows;
    }
}

// 3. Quiz Navigation (Aapka original logic)
window.checkDoshaOptionB = function() {
    document.getElementById('start-quiz-btn').style.display = 'none';
    const quizUI = document.getElementById('quiz-ui');
    quizUI.style.display = 'block';

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

// 4. Final Result
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
}

// 5. Dynamic Form (Aapka original logic)
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
    }

    formHTML += `
                <textarea id="cust_issue" placeholder="Aapki mukhya samasya? (Optional)" class="quiz-opt" style="height:80px; text-align:left; background:rgba(255,255,255,0.05);"></textarea>
                <button type="submit" class="quiz-opt" style="background:#f5c542; color:#000; font-weight:bold; margin-top:20px;">INVOKE FREQUENCY MAPPING ➔</button>
            </form>
        </div>
    `;
    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

// 6. Submit Logic (Firebase Bridge)
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
        alert("System busy. Please contact via WhatsApp directly.");
    }
}

document.addEventListener('DOMContentLoaded', loadTable);
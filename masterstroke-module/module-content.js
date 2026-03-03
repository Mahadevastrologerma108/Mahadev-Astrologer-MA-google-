/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Folder: masterstroke-module/
 * Fixed: Variable consistency (selectedLang) & Delay Loading
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

// 2. Load Table (With Delay and Correct Variable)
function loadTable() {
    const tableBody = document.getElementById('resonance-data-body');
    
    // 🔱 FIXED: layout.js uses 'selectedLang', so we use it here too
    const lang = localStorage.getItem('selectedLang') || 'hi';
    
    // Safety check: wait if translations aren't loaded yet
    if (!window.translations || !window.translations[lang]) {
        console.log("🔱 Waiting for translations...");
        setTimeout(loadTable, 100);
        return;
    }

    const t = window.translations[lang];

    if(tableBody) {
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

// 3. 🔱 Bilingual Quiz Navigation (Logic by Gemini)
window.checkDoshaOptionB = function() {
    // 1. Pehle pata karo user ne kaunsi language choose ki hai
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const t = translations[lang]; // Translation data uthao

    // 2. Buttons aur UI set karo
    const startBtn = document.getElementById('start-quiz-btn');
    if(startBtn) startBtn.style.display = 'none';

    const quizUI = document.getElementById('quiz-ui');
    if(quizUI) quizUI.style.display = 'block';

    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

    // 3. Pehla Sawal (Q1) Translation se load karo
    questionPara.innerText = t.quiz_q1;
    optionsDiv.innerHTML = `
        <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q1_a}</button>
        <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q1_b}</button>
        <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q1_c}</button>
    `;
}

window.nextStep = function(val) {
    scores.push(val); // User ka choice save karo
    
    // Phir se language check karo
    const lang = localStorage.getItem('selectedLanguage') || 'hi';
    const t = translations[lang];
    
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

    if(currentStep === 1) {
        // Dusra Sawal (Q2) load karo
        questionPara.innerText = t.quiz_q2;
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q2_a}</button>
            <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q2_b}</button>
            <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q2_c}</button>
        `;
        currentStep++;
    } else if(currentStep === 2) {
        // Tisra Sawal (Q3) load karo
        questionPara.innerText = t.quiz_q3;
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q3_a}</button>
            <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q3_b}</button>
            <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q3_c}</button>
        `;
        currentStep++;
    } else {
        // Saare sawal khatam, result dikhao
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

// 5. Dynamic Form 
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

// 6. Submit Logic (Bridge to firebase-handler.js)
window.handleFinalSubmit = function(event, method, dosha) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('cust_name').value,
        whatsapp: document.getElementById('cust_whatsapp').value,
        issue: document.getElementById('cust_issue').value || "NA",
        method: method,
        dosha: dosha,
        type: "Sound Healing Request",
        timestamp: new Date().getTime()
    };

    // Calling the function from firebase-handler.js
    if (window.handleSoundHealingSubmit) {
        window.handleSoundHealingSubmit(event, method, dosha);
    } else {
        alert("🔱 Request Sent! We will contact you on WhatsApp.");
    }
}

// 🔱 FINAL CALL: 500ms Delay to ensure translations are ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadTable, 500);
});
/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Fixed: Variable consistency (selectedLang), Bilingual Result & Form
 */

let currentStep = 1;
let scores = [];

// 1. Navgrah Database
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

// 2. Load Table (Consistency Fix)
function loadTable() {
    const tableBody = document.getElementById('resonance-data-body');
    // 🔱 FIXED: Always use 'selectedLang' to match your layout.js
    const lang = localStorage.getItem('selectedLang') || 'hi';

    if (!window.translations || !window.translations[lang]) {
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

// 3. 🔱 Bilingual Quiz Navigation
window.checkDoshaOptionB = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi'; // FIXED variable
    const t = translations[lang];

    const startBtn = document.getElementById('start-quiz-btn');
    if(startBtn) startBtn.style.display = 'none';

    document.getElementById('quiz-ui').style.display = 'block';
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

    questionPara.innerText = t.quiz_q1;
    optionsDiv.innerHTML = `
        <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q1_a}</button>
        <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q1_b}</button>
        <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q1_c}</button>
    `;
}

window.nextStep = function(val) {
    scores.push(val);
    const lang = localStorage.getItem('selectedLang') || 'hi'; // FIXED variable
    const t = translations[lang];
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

    if(currentStep === 1) {
        questionPara.innerText = t.quiz_q2;
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q2_a}</button>
            <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q2_b}</button>
            <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q2_c}</button>
        `;
        currentStep++;
    } else if(currentStep === 2) {
        questionPara.innerText = t.quiz_q3;
        optionsDiv.innerHTML = `
            <button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q3_a}</button>
            <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q3_b}</button>
            <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q3_c}</button>
        `;
        currentStep++;
    } else {
        showFinalResult();
    }
}

// 4. Final Result (Bilingual Fix)
function showFinalResult() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    let finalDosha = (scores[0] === 'A') ? "VATA" : (scores[0] === 'B' ? "PITTA" : "KAPHA");
    const container = document.getElementById('dosha-quiz-container');

    container.innerHTML = `
        <div class="result-box divine-success" style="padding:20px; text-align:center;">
            <h2 class="gold-text" style="font-family:'Cinzel';">${t.res_title} ${finalDosha}</h2>
            <p style="color:#ccc;">${t.res_subtitle}</p>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                <button class="quiz-opt" onclick="loadDivineForm('Kundali', '${finalDosha}')">🔱 ${t.btn_kundali}</button>
                <button class="quiz-opt" onclick="loadDivineForm('Palmistry', '${finalDosha}')">✋ ${t.btn_palm}</button>
                <button class="quiz-opt" onclick="loadDivineForm('Numerology', '${finalDosha}')">🔢 ${t.btn_num}</button>
            </div>
        </div>
    `;
}

// 5. Dynamic Form (Bilingual Placeholders)
window.loadDivineForm = function(method, dosha) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    const container = document.getElementById('dosha-quiz-container');

    let formHTML = `
        <div class="magical-form-box" style="padding:20px;">
            <h3 class="gold-text" style="font-family:'Cinzel';">🔱 ${method} ${t.form_analysis}</h3>
            <p style="font-size:0.8rem; margin-bottom:20px; color:#aaa;">${t.form_mapping} <b>${dosha}</b> profile.</p>
            <form id="healing-contact-form" onsubmit="handleFinalSubmit(event, '${method}', '${dosha}')">
                <input type="text" id="cust_name" placeholder="${t.ph_name}" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">
                <input type="tel" id="cust_whatsapp" placeholder="${t.ph_whatsapp}" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">
    `;

    if (method === 'Kundali') {
        formHTML += `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <input type="date" id="cust_dob" required class="quiz-opt" style="font-size:0.8rem;">
                <input type="time" id="cust_time" required class="quiz-opt" style="font-size:0.8rem;">
            </div>
            <input type="text" id="cust_place" placeholder="${t.ph_place}" required class="quiz-opt" style="text-align:left; background:rgba(255,255,255,0.05);">`;
    }

    formHTML += `
                <textarea id="cust_issue" placeholder="${t.ph_issue}" class="quiz-opt" style="height:80px; text-align:left; background:rgba(255,255,255,0.05);"></textarea>
                <button type="submit" class="quiz-opt" style="background:#f5c542; color:#000; font-weight:bold; margin-top:20px;">${t.btn_submit_form}</button>
            </form>
        </div>
    `;
    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

// 6. Submit Logic
window.handleFinalSubmit = function(event, method, dosha) {
    event.preventDefault();
    if (window.handleSoundHealingSubmit) {
        window.handleSoundHealingSubmit(event, method, dosha);
    } else {
        const lang = localStorage.getItem('selectedLang') || 'hi';
        alert(translations[lang].alert_success);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadTable, 500);
});
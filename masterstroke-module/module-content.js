/**
 * MAHADEV ASTROLOGER MA - Sound Module Logic
 * Upgraded: Energy Alignment Guidance & Safety Disclaimers
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

// 2. Load Table
function loadTable() {
    const tableBody = document.getElementById('resonance-data-body');
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

// 3. 🔱 Result Guidance Data (Bilingual)
const doshaGuidance = {
    VATA: {
        status: { hi: "आपकी ऊर्जा में 'वात' (Vata) तत्व को संतुलित करने की आवश्यकता है।", en: "There is a need to balance the 'Vata' element in your energy." },
        path: { hi: "आपको ऐसी तरंगों की आवश्यकता है जो मन को स्थिरता प्रदान करें।", en: "You require resonances that provide stability to the mind." },
        caution: { hi: "अति-तीव्र ध्वनि से बचें, यह वात को विचलित कर सकती है।", en: "Avoid high-pitched sounds, as they may agitate Vata." }
    },
    PITTA: {
        status: { hi: "आपकी ऊर्जा में 'पित्त' (Pitta) तत्व को संतुलित करने की आवश्यकता है।", en: "There is a need to balance the 'Pitta' element in your energy." },
        path: { hi: "शीतल और शांत तरंगें आपकी आंतरिक अग्नि को संतुलित करेंगी।", en: "Cool and calm resonances will balance your internal fire." },
        caution: { hi: "उत्तेजक और तेज़ संगीत से इस समय दूरी बनाए रखें।", en: "Maintain distance from stimulating or loud music at this time." }
    },
    KAPHA: {
        status: { hi: "आपकी ऊर्जा में 'कफ' (Kapha) तत्व को संतुलित करने की आवश्यकता है।", en: "There is a need to balance the 'Kapha' element in your energy." },
        path: { hi: "आपको चैतन्य तरंगों की आवश्यकता है जो स्फूर्ति का संचार करें।", en: "You require awakening resonances that promote vitality." },
        caution: { hi: "अत्यधिक धीमी और भारी ध्वनियों से अलाइनमेंट में बाधा आ सकती है।", en: "Extremely slow and heavy sounds may hinder alignment." }
    }
};

// 4. Bilingual Quiz
window.checkDoshaOptionB = function() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    const startBtn = document.getElementById('start-quiz-btn');
    if(startBtn) startBtn.style.display = 'none';
    document.getElementById('quiz-ui').style.display = 'block';
    nextStep(null); 
}

window.nextStep = function(val) {
    if(val) scores.push(val);
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    const questionPara = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');

    if(currentStep === 1) {
        questionPara.innerText = t.quiz_q1;
        optionsDiv.innerHTML = `<button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q1_a}</button>
                                <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q1_b}</button>
                                <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q1_c}</button>`;
        currentStep++;
    } else if(currentStep === 2) {
        questionPara.innerText = t.quiz_q2;
        optionsDiv.innerHTML = `<button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q2_a}</button>
                                <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q2_b}</button>
                                <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q2_c}</button>`;
        currentStep++;
    } else if(currentStep === 3) {
        questionPara.innerText = t.quiz_q3;
        optionsDiv.innerHTML = `<button class="quiz-opt" onclick="nextStep('A')">${t.quiz_q3_a}</button>
                                <button class="quiz-opt" onclick="nextStep('B')">${t.quiz_q3_b}</button>
                                <button class="quiz-opt" onclick="nextStep('C')">${t.quiz_q3_c}</button>`;
        currentStep++;
    } else {
        showFinalResult();
    }
}

// 5. 🔱 Final Result with Mandatory Warning
function showFinalResult() {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    const counts = { A: 0, B: 0, C: 0 };
    scores.forEach(s => counts[s]++);
    
    let finalDosha = "VATA";
    if(counts.B > counts.A && counts.B > counts.C) finalDosha = "PITTA";
    if(counts.C > counts.A && counts.C > counts.B) finalDosha = "KAPHA";

    const data = doshaGuidance[finalDosha];
    const container = document.getElementById('dosha-quiz-container');

    container.innerHTML = `
        <div class="resonance-result-box" style="padding: 30px; border: 2px solid #f5c542; background: rgba(245,197,66,0.05); border-radius: 20px; text-align: left;">
            <h2 class="gold-text cinzel" style="text-align: center;">Energy Alignment Report</h2>
            <p style="font-size: 1.1rem; border-bottom: 1px solid rgba(245,197,66,0.1); padding-bottom: 10px;">
                <strong>${lang === 'hi' ? 'स्थिति:' : 'Status:'}</strong> ${data.status[lang]}
            </p>
            <p><strong>${lang === 'hi' ? 'अलाइनमेंट मार्ग:' : 'Alignment Path:'}</strong> ${data.path[lang]}</p>
            
            <div style="margin-top: 25px; padding: 20px; border: 1px solid #ff4d4d; background: rgba(255, 77, 77, 0.05); border-radius: 12px;">
                <h4 style="color: #ff4d4d; margin-top: 0; font-family: 'Cinzel';">⚠️ Mandatory Warning</h4>
                <p style="font-size: 0.9rem; color: #ccc; margin-bottom: 0;">
                    ${lang === 'hi' 
                        ? 'बिना सटीक <b>Planetary Positions</b> के विश्लेषण के, किसी भी फ्रीक्वेंसी का प्रयोग हानिकारक हो सकता है। यह सुझाव आपको केवल सतर्क करने के लिए है।' 
                        : 'Without exact <b>Planetary Position</b> analysis, using any frequency can be harmful. These tips are for awareness only.'}
                </p>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; margin-top:30px;">
                <p style="text-align:center; color:#f5c542; font-weight:bold;">${t.form_analysis_prompt || 'सटीक फ्रीक्वेंसी के लिए विवरण भरें:'}</p>
                <button class="quiz-opt" onclick="loadDivineForm('Kundali', '${finalDosha}')">🔱 ${t.btn_kundali}</button>
                <button class="quiz-opt" onclick="loadDivineForm('Palmistry', '${finalDosha}')">✋ ${t.btn_palm}</button>
            </div>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth' });
}

// 6. Dynamic Form & Submit (Same as your logic but with scroll fix)
window.loadDivineForm = function(method, dosha) {
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const t = translations[lang];
    const container = document.getElementById('dosha-quiz-container');

    let formHTML = `
        <div class="magical-form-box" style="padding:20px;">
            <h3 class="gold-text" style="font-family:'Cinzel';">🔱 ${method} Analysis</h3>
            <form id="healing-contact-form" onsubmit="handleFinalSubmit(event, '${method}', '${dosha}')">
                <input type="text" id="cust_name" placeholder="${t.ph_name}" required class="quiz-opt" style="text-align:left;">
                <input type="tel" id="cust_whatsapp" placeholder="${t.ph_whatsapp}" required class="quiz-opt" style="text-align:left;">
                ${method === 'Kundali' ? `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <input type="date" id="cust_dob" required class="quiz-opt">
                        <input type="time" id="cust_time" required class="quiz-opt">
                    </div>
                    <input type="text" id="cust_place" placeholder="${t.ph_place}" required class="quiz-opt" style="text-align:left;">
                ` : ''}
                <textarea id="cust_issue" placeholder="${t.ph_issue}" class="quiz-opt" style="height:80px; text-align:left;"></textarea>
                <button type="submit" class="quiz-opt" style="background:#f5c542; color:#000; font-weight:bold; margin-top:20px;">${t.btn_submit_form}</button>
            </form>
        </div>
    `;
    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

window.handleFinalSubmit = function(event, method, dosha) {
    event.preventDefault();
    const lang = localStorage.getItem('selectedLang') || 'hi';
    alert(translations[lang].alert_success || "Details Received! Mahadev Bless You.");
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadTable, 500);
});

// 7. 🔱 MASTER TRANSLATION ENGINE & TRIGGER
const updateStaticText = (lang) => {
    const translations = window.pageTranslations?.[lang] || window.translations?.[lang];
    if (!translations) return;

    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key]) {
            el.innerHTML = translations[key]; 
        }
    });
};

// जब यूज़र भाषा बदलेगा, तब यह ट्रिगर चलेगा
document.addEventListener('click', (e) => {
    if (e.target.closest('#langToggle') || e.target.closest('.lang-switch')) {
        setTimeout(() => {
            const newLang = localStorage.getItem('selectedLang') || 'en';
            
            // 1. HTML के सारे data-key अपडेट करेगा
            updateStaticText(newLang);
            
            // 2. तुम्हारी JS वाली टेबल को नई भाषा में दोबारा लोड करेगा
            loadTable();
            
        }, 100);
    }
});

// पेज लोड होने पर भी दोनों को सेट करेगा (तुम्हारे पुराने DOMContentLoaded की जगह इसे यूज़ करो)
window.addEventListener('load', () => {
    setTimeout(() => {
        const lang = localStorage.getItem('selectedLang') || 'en';
        updateStaticText(lang);
        loadTable();
    }, 200);
});

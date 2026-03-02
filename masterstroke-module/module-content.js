// 1. Function to Load Dynamic Form based on Selection
function loadDivineForm(method, dosha) {
    const container = document.getElementById('dosha-quiz-container');
    let formHTML = `
        <div class="magical-form-box" style="animation: fadeIn 0.8s;">
            <h3 class="gold-text">🔱 ${method} Analysis for Sound Healing</h3>
            <p style="font-size:0.8rem; margin-bottom:20px;">Please provide details to calculate your Personal Frequency.</p>
            <form id="healing-contact-form">
                <input type="hidden" name="service" value="Sound Healing">
                <input type="hidden" name="method" value="${method}">
                <input type="hidden" name="detected_dosha" value="${dosha}">
                
                <input type="text" placeholder="Full Name" required class="form-input">
    `;

    // 2. Conditional Fields Logic
    if (method === 'Kundali') {
        formHTML += `
            <input type="date" title="Birth Date" required class="form-input">
            <input type="time" title="Birth Time" required class="form-input">
            <input type="text" placeholder="Birth Place (City, Country)" required class="form-input">
        `;
    } else if (method === 'Palmistry') {
        formHTML += `
            <input type="text" placeholder="Current Location" required class="form-input">
            <div class="palm-instruction">
                <p>📸 <b>Note:</b> Keep clear photos of both hands (Front & Back) ready. Our team will ask for them on WhatsApp/Email.</p>
            </div>
        `;
    } else if (method === 'Numerology') {
        formHTML += `
            <input type="date" title="Birth Date" required class="form-input">
            <input type="text" placeholder="Current Full Name (Spelling)" required class="form-input">
        `;
    }

    formHTML += `
                <input type="tel" placeholder="WhatsApp Number" required class="form-input">
                <textarea placeholder="Any specific health/mental issue?" class="form-input"></textarea>
                <button type="submit" class="module-btn" style="width:100%">SUBMIT DETAILS TO MAHADEV ASTROLOGER MA</button>
            </form>
        </div>
    `;

    container.innerHTML = formHTML;
}

// Result function ko bhi update karein taaki wo loadDivineForm ko call kare
function showFinalResult() {
    let finalDosha = (scores[0] === 'A') ? "VATA" : (scores[0] === 'B' ? "PITTA" : "KAPHA");
    const container = document.getElementById('dosha-quiz-container');
    
    container.innerHTML = `
        <div class="result-box">
            <h2 class="gold-text">Result: ${finalDosha} Dominant</h2>
            <div class="method-selection">
                <p>Unlock your personalized healing frequency via:</p>
                <button class="method-btn" onclick="loadDivineForm('Kundali', '${finalDosha}')">🔱 Astrological Chart (Kundali)</button>
                <button class="method-btn" onclick="loadDivineForm('Palmistry', '${finalDosha}')">✋ Palmistry Analysis</button>
                <button class="method-btn" onclick="loadDivineForm('Numerology', '${finalDosha}')">🔢 Numerology Vibration</button>
            </div>
        </div>
    `;
    document.getElementById('dosha-warning').style.display = 'block';
}
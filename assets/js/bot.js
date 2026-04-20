(function injectMahadevBot() {
    // Duplicate check: Pehle se bot hai toh dobara load na ho
    if (document.getElementById('mahadev-bot-container')) return;

    const botHTML = `
    <div id="mahadev-bot-container" style="position:fixed; bottom:25px; right:20px; z-index:2147483647 !important; font-family:'Poppins', sans-serif; display:block !important;">
        
        <div id="bot-icon" onclick="toggleBot()" style="background:#f5c542; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-size:30px; transition: 0.3s; -webkit-tap-highlight-color: transparent;">
            🔱
        </div>
        
        <div id="bot-window" style="display:none; width:320px; max-width:85vw; background:#0a0a14; border:2px solid #f5c542; border-radius:15px; position:absolute; bottom:75px; right:0; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8); flex-direction:column;">
            
            <div style="background:#f5c542; color:#000; padding:12px; font-weight:bold; text-align:center; font-size:0.9rem; letter-spacing:1px;">
                MAHADEV AI ASSISTANT
            </div>
            
            <div id="chatResponse" style="height:250px; overflow-y:auto; padding:15px; color:#ddd; font-size:0.85rem; line-height:1.6; background:rgba(255,255,255,0.03);">
                Har Har Mahadev! 🙏 Main aapki kaise madad kar sakta hoon?
            </div>
            
            <div style="padding:12px; border-top:1px solid #333; background:#0f0f1a;">
                <textarea id="userQuestion" placeholder="Apna prashn likhein..." style="width:100%; background:#1a1a2a; color:#fff; border:1px solid #444; border-radius:8px; padding:10px; font-size:0.85rem; outline:none; resize:none; margin-bottom:8px; box-sizing:border-box;"></textarea>
                <button onclick="processBotQuery()" style="width:100%; background:#f5c542; border:none; padding:10px; font-weight:bold; cursor:pointer; border-radius:8px; color:#000; font-size:0.8rem; text-transform:uppercase;">
                    PUCHIYE ➔
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', botHTML);
})();

/** 🔱 Function: Open/Close Toggle */
window.toggleBot = function() {
    const windowDiv = document.getElementById('bot-window');
    if (windowDiv) {
        // Mobile compatibility ke liye current display check
        const isHidden = windowDiv.style.display === 'none' || windowDiv.style.display === '';
        windowDiv.style.display = isHidden ? 'flex' : 'none';
    }
};

/** 🔱 Function: Smart Query Handler */
window.processBotQuery = async function() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.toLowerCase().trim();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "🔱 Mahadev dhyan laga rahe hain...";
    questionInput.value = ""; // Clear input immediately

    // --- Level 1: Business Logic & Site Navigation ---
    if (question.includes("buy") || question.includes("price") || question.includes("order") || question.includes("kharid")) {
        responseArea.innerHTML = "🔱 Shubh Vichar! Aapko sahi product dilane mein main madad karta hoon... Redirecting to WhatsApp.";
        setTimeout(() => { window.location.href = "https://wa.me/91YOUR_NUMBER?text=Pranam, mujhe order ke bare mein puchna hai."; }, 1500);
        return;
    }

    if (question.includes("horoscope") || question.includes("rashifal")) {
        responseArea.innerHTML = "🔱 Chaliye, aaj ka bhagyoday dekhte hain... <br><br><a href='/horoscope/horoscope.html' style='color:#f5c542; font-weight:bold;'>Rashifal Section ➔</a>";
        return;
    }

    // --- Level 2: AI Logic (HuggingFace) ---
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL_PATH", {
            headers: { Authorization: "Bearer YOUR_HF_TOKEN", "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ inputs: question }),
        });
        const result = await response.json();
        const aiJawab = result[0]?.generated_text || result.generated_text;

        if (aiJawab && aiJawab.length > 5) {
            responseArea.innerHTML = `🔱 <b>Guru:</b> ${aiJawab}`;
        } else {
            throw new Error("AI Slow");
        }
    } catch (e) {
        // --- Level 3: Human Support Fallback ---
        responseArea.innerHTML = "🔱 Is prashn ka uttar purn vishleshan mangta hai. Sidha mujhse judiye: <br><br><a href='https://wa.me/91YOUR_NUMBER?text=Pranam, mujhe " + encodeURIComponent(question) + " ke bare mein janna hai' style='background:#25D366; color:white; padding:8px 12px; border-radius:5px; text-decoration:none; display:inline-block;'>WhatsApp Par Baat Karein</a>";
    }
};

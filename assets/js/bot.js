(function injectMahadevBot() {
    // 1. Bot ka HTML Structure create karein
    const botHTML = `
    <div id="mahadev-bot-container" style="position:fixed; bottom:20px; right:20px; z-index:9999; font-family:'Poppins', sans-serif;">
        <div id="bot-icon" onclick="toggleBot()" style="background:#f5c542; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 0 15px rgba(245,197,66,0.5); font-size:30px;">🔱</div>
        
        <div id="bot-window" style="display:none; width:300px; background:#0a0a14; border:2px solid #f5c542; border-radius:15px; position:absolute; bottom:70px; right:0; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <div style="background:#f5c542; color:#000; padding:10px; font-weight:bold; text-align:center;">MAHADEV AI ASSISTANT</div>
            <div id="chatResponse" style="height:200px; overflow-y:auto; padding:15px; color:#ddd; font-size:0.85rem; line-height:1.5; background:rgba(255,255,255,0.02);">
                Har Har Mahadev! 🙏 Main aapki kaise madad kar sakta hoon?
            </div>
            <div style="padding:10px; border-top:1px solid #333;">
                <textarea id="userQuestion" placeholder="Puchiye..." style="width:100%; background:#1a1a2a; color:#fff; border:1px solid #444; border-radius:5px; padding:8px; font-size:0.8rem; outline:none; resize:none;"></textarea>
                <button onclick="processBotQuery()" style="width:100%; background:#f5c542; border:none; padding:8px; font-weight:bold; margin-top:5px; cursor:pointer; border-radius:5px;">SAWAAL PUCHIYE</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', botHTML);
})();

// 🔱 Open/Close Bot
window.toggleBot = function() {
    const windowDiv = document.getElementById('bot-window');
    windowDiv.style.display = windowDiv.style.display === 'none' ? 'block' : 'none';
};

// 🔱 Core Logic (Redirection & Knowledge)
window.processBotQuery = function() {
    const question = document.getElementById('userQuestion').value.toLowerCase();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "Mahadev vishleshan kar rahe hain... 🕉️";

    // Intent Logic
    setTimeout(() => {
        if (question.includes("kharid") || question.includes("price") || question.includes("order")) {
            responseArea.innerHTML = "🔱 Order ke liye aapko WhatsApp par bhej raha hoon...";
            window.location.href = "https://wa.me/YOUR_NUMBER?text=Bhai, Order karna hai";
        } 
        else if (question.includes("rashi") || question.includes("horoscope")) {
            responseArea.innerHTML = "🔱 Chaliye, aaj ka rashifal dekhte hain...";
            window.location.href = "/horoscope/horoscope.html";
        }
        else if (question.includes("gemstone") || question.includes("pukhraj") || question.includes("stone")) {
            responseArea.innerHTML = "🔱 Gems ke baare mein janne ke liye shop par chaliye...";
            window.location.href = "/shop.html";
        }
        else {
            responseArea.innerHTML = "🔱 Aapka sawal prabal hai. Sateek gyan ke liye humse WhatsApp par baat karein.";
        }
    }, 1500);
};

window.processBotQuery = async function() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.toLowerCase().trim();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "🔱 Mahadev dhyan laga rahe hain...";
    questionInput.value = ""; // Input clear kar dein

    // --- LEVEL 1: SITE GUIDE & SALES (Basic Training + Business) ---
    
    // 🛍️ Sales & Order Redirect
    if (question.includes("kharid") || question.includes("price") || question.includes("order") || question.includes("buy")) {
        responseArea.innerHTML = "🔱 Shubh Vichar! Order ke liye aapko WhatsApp par bhej raha hoon...";
        setTimeout(() => { 
            window.location.href = "https://wa.me/YOUR_NUMBER?text=Pranam, mujhe gemstone/rudraksha order karna hai"; 
        }, 1500);
        return;
    }

    // 🕉️ Horoscope/Panchang Redirect
    if (question.includes("horoscope") || question.includes("rashifal")) {
        responseArea.innerHTML = "🔱 Aap apna dainik rashifal yahan padh sakte hain: <br><a href='/horoscope/horoscope.html' style='color:#f5c542;'>Horoscope Section ➔</a>";
        return;
    }
    if (question.includes("panchang") || question.includes("rahukaal")) {
        responseArea.innerHTML = "🔱 Shubh Muhurat aur Rahukaal ki jankari yahan dekhein: <br><a href='/panchang/panchang.html' style='color:#f5c542;'>Panchang Section ➔</a>";
        return;
    }

    // --- LEVEL 2: HUGGINGFACE AI (Deep Astrology Knowledge) ---
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL_PATH", {
            headers: { 
                "Authorization": "Bearer YOUR_HF_TOKEN",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: question }),
        });

        const result = await response.json();
        const aiResponse = result[0]?.generated_text || result.generated_text;

        if (aiResponse && aiResponse.length > 5) {
            responseArea.innerHTML = `🔱 <b>Astro AI:</b> ${aiResponse}`;
        } else {
            throw new Error("AI Silent");
        }

    } catch (error) {
        // --- LEVEL 3: DIRECT HUMAN SUPPORT (WhatsApp Connect) ---
        // Jab bot ya AI ko samajh na aaye
        responseArea.innerHTML = "🔱 Is prashn ka uttar purn vishleshan mangta hai. Main aapko seedha **Mahadev Astrologer MA** se jodh raha hoon... <br><br> <a href='https://wa.me/YOUR_NUMBER?text=Pranam, mujhe is baare mein janna hai: " + encodeURIComponent(question) + "' style='background:#25D366; color:white; padding:8px 12px; border-radius:5px; text-decoration:none; display:inline-block; margin-top:10px;'>WhatsApp Par Baat Karein ➔</a>";
    }
};

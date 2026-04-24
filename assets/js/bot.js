window.processBotQuery = async function() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.toLowerCase().trim();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "🔱 Mahadev margdarshan kar rahe hain...";
    questionInput.value = "";

    // --- 🔱 LEVEL 1: MASTER NAVIGATOR ---

    // 1. ♈ 12 Rashi Logic
    const rashis = {
        "mesh": "aries", "aries": "aries", "vrishabh": "taurus", "taurus": "taurus",
        "mithun": "gemini", "gemini": "gemini", "kark": "cancer", "cancer": "cancer",
        "singh": "leo", "leo": "leo", "kanya": "virgo", "virgo": "virgo",
        "tula": "libra", "libra": "libra", "vrishchik": "scorpio", "scorpio": "scorpio",
        "dhanu": "sagittarius", "sagittarius": "sagittarius", "makar": "capricorn", 
        "capricorn": "capricorn", "kumbh": "aquarius", "aquarius": "aquarius", 
        "meen": "pisces", "pisces": "pisces"
    };

    let foundRashi = Object.keys(rashis).find(r => question.includes(r));
    if (foundRashi) {
        responseArea.innerHTML = `🔱 ${foundRashi.toUpperCase()} rashi ka gyan load ho raha hai...`;
        setTimeout(() => { window.location.href = `/horoscope/${rashis[foundRashi]}.html`; }, 1500);
        return;
    }

    // 2. 📅 Horoscope & Panchang
    if (question.includes("panchang") || question.includes("muhurat") || question.includes("rahukaal")) {
        responseArea.innerHTML = "🔱 Aaj ka Panchang aur Shubh samay yahan dekhein: <br><a href='/panchang/panchang.html'>Aaj ka Panchang ➔</a>";
        return;
    }
    if (question.includes("horoscope") || question.includes("rashifal")) {
        responseArea.innerHTML = "🔱 Dainik rashifal yahan padhein: <br><a href='/horoscope/horoscope.html'>Horoscope Page ➔</a>";
        return;
    }

    // 3. 📚 Guides
    if (question.includes("kundli") || question.includes("kundali")) {
        responseArea.innerHTML = "🔱 Kundli vishleshan: <br><a href='/latest-guide/kundali.html'>Kundali Guide ➔</a>";
        return;
    }
    if (question.includes("numerology") || question.includes("ank jyotish")) {
        responseArea.innerHTML = "🔱 Ankon ka rahasya: <br><a href='/latest-guide/numerology.html'>Numerology ➔</a>";
        return;
    }

    // 4. 💎 Products
    if (question.includes("gemstone") || question.includes("ratna") || question.includes("rudraksha")) {
        responseArea.innerHTML = "🔱 Shuddh ratna aur rudraksha: <br><a href='/products/shop.html'>Divine Store ➔</a>";
        return;
    }

    // --- LEVEL 2: SECURE AI BRAIN (Hugging Face) ---
    try {
        // 🔥 SUDHAR: Firebase se token mangwana (GitHub warning se bachne ke liye)
        const secureToken = await window.getDivineKey(); 

        if (!secureToken) throw new Error("Key Not Found");

        const response = await fetch("https://api-inference.huggingface.co/models/mahadev-astrologer-ma-admin/mahadev-astrologer-ma-v1", {
            headers: { 
                "Authorization": `Bearer ${secureToken}`, // 🔥 SUDHAR: Fixed syntax & dynamic token
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `Answer as Mahadev Astro Expert in Hinglish. Question: ${question}`,
                parameters: { max_new_tokens: 150, temperature: 0.6, return_full_text: false }
            }),
        });

        const result = await response.json();
        let aiJawab = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;
        
        if (aiJawab && aiJawab.length > 3) {
            aiJawab = aiJawab.replace(/Instruction:.*Question:.*Answer:/gs, "").trim();
            responseArea.innerHTML = `🔱 <b>Astro AI:</b> ${aiJawab}`;
        } else {
            throw new Error("AI Empty");
        }
    } catch (error) {
        // --- LEVEL 3: WhatsApp Support ---
        responseArea.innerHTML = "🔱 Iska sateek uttar purn vishleshan mangta hai. Sidha mujhse judiye: <br><br><a href='https://wa.me/message/VCK5OVBDCN7YK1?text=Pranam, mujhe " + encodeURIComponent(question) + " ke bare mein janna hai' style='background:#25D366; color:white; padding:8px 12px; border-radius:5px; text-decoration:none; display:inline-block;'>WhatsApp Par Baat Karein</a>";
    }
};

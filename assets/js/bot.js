window.processBotQuery = async function() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.toLowerCase().trim();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "🔱 Mahadev margdarshan kar rahe hain...";
    questionInput.value = "";

    // --- 🔱 LEVEL 1: MASTER NAVIGATOR (38+ Pages Training) ---

    // 1. ♈ 12 Rashi Logic (Direct Path)
    const rashis = {
        "mesh": "aries", "aries": "aries",
        "vrishabh": "taurus", "taurus": "taurus",
        "mithun": "gemini", "gemini": "gemini",
        "kark": "cancer", "cancer": "cancer",
        "singh": "leo", "leo": "leo",
        "kanya": "virgo", "virgo": "virgo",
        "tula": "libra", "libra": "libra",
        "vrishchik": "scorpio", "scorpio": "scorpio",
        "dhanu": "sagittarius", "sagittarius": "sagittarius",
        "makar": "capricorn", "capricorn": "capricorn",
        "kumbh": "aquarius", "aquarius": "aquarius",
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

    // 3. 📚 Latest Guides & Tools (Knowledge Base)
    if (question.includes("kundli") || question.includes("kundali")) {
        responseArea.innerHTML = "🔱 Kundli vishleshan ke liye hamari guide dekhein: <br><a href='/latest-guide/kundali.html'>Kundali Guide ➔</a>";
        return;
    }
    if (question.includes("numerology") || question.includes("ank jyotish")) {
        responseArea.innerHTML = "🔱 Ankon ka rahasya yahan hai: <br><a href='/latest-guide/numerology.html'>Numerology ➔</a>";
        return;
    }
    if (question.includes("water") || question.includes("calculator") || question.includes("health")) {
        responseArea.innerHTML = "🔱 Ayurvedic health calculator yahan hai: <br><a href='/latest-guide/ayurvedic-health-water-calculator.html'>Water Calculator ➔</a>";
        return;
    }
    if (question.includes("grih dosh") || question.includes("dosh")) {
        responseArea.innerHTML = "🔱 Grih dosh aur upaay yahan padhein: <br><a href='/latest-guide/grih-dosh.html'>Grih Dosh Guide ➔</a>";
        return;
    }
    if (question.includes("guide") || question.includes("lekh")) {
        responseArea.innerHTML = "🔱 Hamari saari adhyatmik guides yahan hain: <br><a href='/latest-guide/guides.html'>Knowledge Hub ➔</a>";
        return;
    }

    // 4. 💎 Divine Products (Shop Sections)
    if (question.includes("gemstone") || question.includes("ratna") || question.includes("pukhraj")) {
        responseArea.innerHTML = "🔱 Certified gemstones yahan dekhein: <br><a href='/products/gemstones.html'>Gemstones ➔</a>";
        return;
    }
    if (question.includes("rudraksha")) {
        responseArea.innerHTML = "🔱 Original Rudraksha yahan hain: <br><a href='/products/rudraksha.html'>Rudraksha Store ➔</a>";
        return;
    }
    if (question.includes("herbal") || question.includes("wellness") || question.includes("jadi buti")) {
        responseArea.innerHTML = "🔱 Herbal wellness products yahan hain: <br><a href='/products/herbal-wellness.html'>Herbal Wellness ➔</a>";
        return;
    }
    if (question.includes("puja kit") || question.includes("samagri")) {
        responseArea.innerHTML = "🔱 Puja kits yahan uplabdha hain: <br><a href='/products/puja-kits.html'>Puja Kits ➔</a>";
        return;
    }
    if (question.includes("shop") || question.includes("kharid") || question.includes("buy")) {
        responseArea.innerHTML = "🔱 Hamara poora store yahan browse karein: <br><a href='/products/shop.html'>Divine Shop ➔</a>";
        return;
    }

    // 5. 🛠️ Vedic Tools
    if (question.includes("tool")) {
        responseArea.innerHTML = "🔱 Hamare saare Vedic tools yahan dekhein: <br><a href='/tools/tools.html'>Vedic Tools ➔</a>";
        return;
    }

    // --- LEVEL 2: AI BRAIN (HuggingFace) ---
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
        } else { throw new Error(); }
    } catch (e) {
        // --- LEVEL 3: HUMAN SUPPORT (WhatsApp) ---
        responseArea.innerHTML = "🔱 Iska sateek uttar purn vishleshan mangta hai. Sidha mujhse judiye: <br><br><a href='https://wa.me/message/VCK5OVBDCN7YK1?text=Pranam, mujhe " + encodeURIComponent(question) + " ke bare mein janna hai' style='background:#25D366; color:white; padding:8px 12px; border-radius:5px; text-decoration:none; display:inline-block;'>WhatsApp Par Baat Karein</a>";
    }
};

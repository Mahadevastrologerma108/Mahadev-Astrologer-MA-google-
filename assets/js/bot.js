window.processBotQuery = async function() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.toLowerCase().trim();
    const responseArea = document.getElementById('chatResponse');

    if (!question) return;

    responseArea.innerHTML = "🔱 Mahadev margdarshan kar rahe hain...";
    questionInput.value = "";

    // --- 🔱 LEVEL 1: MASTER NAVIGATOR (Naya Smart Redirect) ---
    
    // Yahan humne wo saare keywords aur links dal diye hain
    const smartAction = getSmartRedirect(question);

    if (smartAction) {
        responseArea.innerHTML = `🔱 ${smartAction.msg}`;
        // 1.5 second ka intezaar taaki user message padh le, phir redirect
        setTimeout(() => { 
            window.location.href = smartAction.url; 
        }, 1500);
        return;
    }

    // --- LEVEL 2: SECURE AI BRAIN (Hugging Face) ---
    try {
        const secureToken = await window.getDivineKey(); 
        if (!secureToken) throw new Error("Key Not Found");

        const response = await fetch("https://api-inference.huggingface.co/models/mahadev-astrologer-ma-admin/mahadev-astrologer-ma-v1", {
            headers: { 
                "Authorization": `Bearer ${secureToken}`, 
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
        // --- LEVEL 3: WhatsApp Support (Fallback) ---
        responseArea.innerHTML = "🔱 Iska sateek uttar purn vishleshan mangta hai. Sidha mujhse judiye: <br><br><a href='https://wa.me/message/VCK5OVBDCN7YK1?text=Pranam, mujhe " + encodeURIComponent(question) + " ke bare mein janna hai' style='background:#25D366; color:white; padding:8px 12px; border-radius:5px; text-decoration:none; display:inline-block;'>WhatsApp Par Baat Karein</a>";
    }
};

// 🚩 YAHAN MASTER MAP WALA FUNCTION RAKHEIN
function getSmartRedirect(query) {
    query = query.toLowerCase();

    // 🌟 1. 12 RASHI LOGIC
    if (/(mesh|aries)/.test(query)) return { url: "/horoscope/aries.html", msg: "♈ Mesh (Aries) rashi ka gyan load ho raha hai..." };
    if (/(vrishabha|taurus)/.test(query)) return { url: "/horoscope/taurus.html", msg: "♉ Vrishabha (Taurus) rashi ka gyan load ho raha hai..." };
    if (/(mithun|gemini)/.test(query)) return { url: "/horoscope/gemini.html", msg: "♊ Mithun (Gemini) rashi ka gyan load ho raha hai..." };
    if (/(kark|karka|cancer)/.test(query)) return { url: "/horoscope/cancer.html", msg: "♋ Kark (Cancer) rashi ka gyan load ho raha hai..." };
    if (/(simha|singh|leo)/.test(query)) return { url: "/horoscope/leo.html", msg: "♌ Simha (Leo) rashi ka gyan load ho raha hai..." };
    if (/(kanya|virgo)/.test(query)) return { url: "/horoscope/virgo.html", msg: "♍ Kanya (Virgo) rashi ka gyan load ho raha hai..." };
    if (/(tula|libra)/.test(query)) return { url: "/horoscope/libra.html", msg: "♎ Tula (Libra) rashi ka gyan load ho raha hai..." };
    if (/(vrishchik|scorpio)/.test(query)) return { url: "/horoscope/scorpio.html", msg: "Scorpio rashi ka gyan load ho raha hai..." };
    if (/(dhanu|sagittarius)/.test(query)) return { url: "/horoscope/sagittarius.html", msg: "♐ Dhanu rashi ka gyan load ho raha hai..." };
    if (/(makar|capricorn)/.test(query)) return { url: "/horoscope/capricorn.html", msg: "♑ Makar rashi ka gyan load ho raha hai..." };
    if (/(kumbh|aquarius)/.test(query)) return { url: "/horoscope/aquarius.html", msg: "♒ Kumbh rashi ka gyan load ho raha hai..." };
    if (/(meen|pisces)/.test(query)) return { url: "/horoscope/pisces.html", msg: "♓ Meen rashi ka gyan load ho raha hai..." };

    // 🔮 2. HOROSCOPE & PANCHANG
    if (/(panchang|calendar|tithi|chaughadia|muhurat|rahukal)/.test(query)) return { url: "/panchang/panchang.html", msg: "🌞 Aaj ka Panchang aur Shubh Muhurat dekhein." };
    if (/(rashifal|horoscope|rashi|zodiac)/.test(query)) return { url: "/horoscope/horoscope.html", msg: "🔮 Sabhi rashiyon ka aaj ka rashifal dekhein." };

    // 📜 3. FORMS & CONSULTATION
    if (/(book|appointment|form|baat karni|dikha)/.test(query)) return { url: "/index.html#book", msg: "📜 Paramarsh (Consultation) ke liye ye form bharein." };

    // 💎 4. STORE & PRODUCTS
    if (/(gem|gemstone|ratna|stone|pukhraj)/.test(query)) return { url: "/products/gemstones.html", msg: "💎 Asli aur abhimantrit Ratna dekhein." };
    if (/(rudraksh|mala)/.test(query)) return { url: "/products/rudraksha.html", msg: "📿 Siddha Rudraksha yahan uplabdh hain." };
    if (/(store|shop|buy|kharid)/.test(query)) return { url: "/products/shop.html", msg: "🛍️ Divine Astro Store mein aapka swagat hai." };

    // 📚 5. GUIDES & MODULES
    if (/(water|pani|jal|hydration)/.test(query)) return { url: "/latest-guide/ayurvedic-health-water-calculator.html", msg: "💧 Ayurvedic Water Calculator." };
    if (/(sound|healing|music|vibration)/.test(query)) return { url: "/masterstroke-module/sound-healing.html", msg: "🎵 Sound Healing ki duniya mein chaliye." };
    if (/(numerology|ank jyotish|lucky number)/.test(query)) return { url: "/latest-guide/numerology.html", msg: "🔢 Numerology ka rahasya samjhein." };
    if (/(guide|article|post|lekh|blog|latest)/.test(query)) return { url: "/latest-guide/guides.html", msg: "📚 Hamare navinatam lekh yahan padhein." };

    // ℹ️ 6. LEGAL & ABOUT PAGES (Ise zaroor rakhein)
    if (/(about|bare me|who are|parichay|kaun ho)/.test(query)) return { url: "/pages/about.html", msg: "🔱 Mahadev Astrologer MA ke bare mein yahan jaaniye." };
    if (/(contact|sampark|phone|whatsapp|email|call|madad|help)/.test(query)) return { url: "/pages/contact.html", msg: "📞 Humse sampark karne ki sabhi jankari yahan hai." };
    if (/(privacy)/.test(query)) return { url: "/pages/privacy.html", msg: "🔒 Hamari Privacy Policy padhein." };
    if (/(term|condition|niyam|shartein)/.test(query)) return { url: "/pages/terms.html", msg: "📝 Terms and Conditions yahan uplabdh hain." };
    if (/(disclaimer)/.test(query)) return { url: "/pages/disclaimer.html", msg: "⚠️ Hamara Disclaimer dhyan se padhein." };
    if (/(home|main|wapas|shuru|start|piche)/.test(query)) return { url: "/index.html", msg: "🏠 Mukhya prishth (Home) par chalte hain." };

    return null; 
}

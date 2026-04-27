/* ====================================================================
    🔱 MAHADEV BOT - PRO VERSION (v2.1)
    Upgrade: Llama-3 Fine-Tuned Model Integration
   ==================================================================== */

const BotConfig = {
    modelUrl: "https://api-inference.huggingface.co/models/mahadev-astrologer-ma-admin/mahadev-astrologer-ma-v1",
    whatsappLink: "https://wa.me/message/VCK5OVBDCN7YK1",
    redirectDelay: 1500 
};

const RouteMap = [
    // ... (Aapka purana RouteMap ekdum sahi hai, use waisa hi rehne dein)
    { pattern: /(mesh|aries)/, url: "/horoscope/aries.html", msg: "♈ Mesh (Aries) rashi ka rashifal." },
    { pattern: /(vrishabha|taurus)/, url: "/horoscope/taurus.html", msg: "♉ Vrishabha (Taurus) rashi ka rashifal." },
    { pattern: /(mithun|gemini)/, url: "/horoscope/gemini.html", msg: "♊ Mithun (Gemini) rashi ka rashifal." },
    { pattern: /(kark|cancer)/, url: "/horoscope/cancer.html", msg: "♋ Kark (Cancer) rashi ka rashifal." },
    { pattern: /(singh|simha|leo)/, url: "/horoscope/leo.html", msg: "♌ Singh (Leo) rashi ka rashifal." },
    { pattern: /(kanya|virgo)/, url: "/horoscope/virgo.html", msg: "♍ Kanya (Virgo) rashi ka rashifal." },
    { pattern: /(tula|libra)/, url: "/horoscope/libra.html", msg: "♎ Tula (Libra) rashi ka rashifal." },
    { pattern: /(vrishchik|scorpio)/, url: "/horoscope/scorpio.html", msg: "♏ Scorpio rashi ka rashifal." },
    { pattern: /(dhanu|sagittarius)/, url: "/horoscope/sagittarius.html", msg: "♐ Dhanu rashi ka rashifal." },
    { pattern: /(makar|capricorn)/, url: "/horoscope/capricorn.html", msg: "♑ Makar rashi ka rashifal." },
    { pattern: /(kumbh|aquarius)/, url: "/horoscope/aquarius.html", msg: "♒ Kumbh rashi ka rashifal." },
    { pattern: /(meen|pisces)/, url: "/horoscope/pisces.html", msg: "♓ Meen rashi ka rashifal." },
    { pattern: /(panchang|calendar|tithi|chaughadia|muhurat|rahukal|din)/, url: "/panchang/panchang.html", msg: "🌞 Panchang aur Shubh Muhurat dekhein." },
    { pattern: /(horoscope|rashifal|rashi|zodiac)/, url: "/horoscope/horoscope.html", msg: "🔮 Dainik Rashifal khul raha hai." },
    { pattern: /(kundli|match|milan|patri)/, exclude: "form", url: "/latest-guide/kundali.html", msg: "📜 Kundli Guide padhein." },
    { pattern: /(gem|ratna|stone|pukhraj|neelam|moti)/, url: "/products/gemstones.html", msg: "💎 Gemstones Store khul raha hai." },
    { pattern: /(rudraksh|mala)/, url: "/products/rudraksha.html", msg: "📿 Siddha Rudraksha dekhein." },
    { pattern: /(herb|jadi booti|wellness)/, url: "/products/herbal-wellness.html", msg: "🌿 Herbal Wellness products." },
    { pattern: /(puja|kit|samagri)/, url: "/products/puja-kits.html", msg: "🪔 Puja Kits aur Samagri." },
    { pattern: /(store|shop|buy|kharid|dukan)/, url: "/products/shop.html", msg: "🛍️ Divine Astro Store khul raha hai." },
    { pattern: /(water|pani|jal|hydration)/, url: "/latest-guide/ayurvedic-health-water-calculator.html", msg: "💧 Water Calculator." },
    { pattern: /(sound|healing|music|vibration|frequency)/, url: "/masterstroke-module/sound-healing.html", msg: "🎵 Sound Healing module." },
    { pattern: /(numerology|ank jyotish|lucky number)/, url: "/latest-guide/numerology.html", msg: "🔢 Numerology ka rahasya samjhein." },
    { pattern: /(grih dosh|upay|shanti)/, url: "/latest-guide/grih-dosh.html", msg: "🪐 Grih Dosh aur upay." },
    { pattern: /(guide|article|post|lekh|blog)/, url: "/latest-guide/guides.html", msg: "📚 Hamare astrology guides padhein." },
    { pattern: /(tool|calculator|yantra)/, url: "/tools/tools.html", msg: "⚙️ Astro Tools yahan hain." },
    { pattern: /(book|appointment|form|dikha|baat karni|consult)/, url: "/index.html#book", msg: "📜 Form par redirect kar rahe hain..." },
    { pattern: /(about|bare me|kaun ho|parichay)/, url: "/pages/about.html", msg: "🔱 Hamare bare mein jaaniye." },
    { pattern: /(contact|sampark|phone|whatsapp|help|madad)/, url: "/pages/contact.html", msg: "📞 Sampark jankari yahan hai." },
    { pattern: /(home|main|start|piche)/, url: "/index.html", msg: "🏠 Home page par chalte hain." }
];

function getSmartRedirect(query) {
    for (let route of RouteMap) {
        if (route.exclude && query.includes(route.exclude)) continue;
        if (route.pattern.test(query)) return route;
    }
    return null;
}

window.processBotQuery = async function() {
    const inputEl = document.getElementById('userQuestion') || document.getElementById('chat-input');
    const outputEl = document.getElementById('chatResponse') || document.getElementById('chat-body');
    
    if (!inputEl) return;
    
    const query = inputEl.value.toLowerCase().trim();
    if (!query) return;

    if (outputEl) outputEl.innerHTML = "🔱 Mahadev margdarshan kar rahe hain...";
    inputEl.value = "";

    // --- PHASE 1: ROUTING (Instant Navigation) ---
    const smartAction = getSmartRedirect(query);
    if (smartAction) {
        if (outputEl) outputEl.innerHTML = `🔱 ${smartAction.msg}`;
        setTimeout(() => { window.location.href = smartAction.url; }, BotConfig.redirectDelay);
        return;
    }

    // --- PHASE 2: AI INFERENCE (Hugging Face + Llama-3 Fine-tuned) ---
    try {
        const secureToken = await window.getDivineKey(); 
        if (!secureToken) throw new Error("API Key Missing");

        const response = await fetch(BotConfig.modelUrl, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${secureToken}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                // Naya Prompt Format jo aapne Colab mein train kiya hai
                inputs: `### Instruction: Tum Mahadev Astrologer MA ho. Tumhare paas jo gyan hai usse user ko Hinglish (Hindi + English mix) mein samjhao. ### Question: ${query} ### Response:`,
                parameters: { 
                    max_new_tokens: 200, 
                    temperature: 0.7, 
                    return_full_text: false 
                }
            })
        });

        const result = await response.json();

        // Model Loading Handling (Cold Start)
        if (result.error && result.error.includes("loading")) {
            if (outputEl) outputEl.innerHTML = "🔱 Mahadev Bot abhi gyan jaagrit kar rahe hain (Model Loading)... Kripya 15 seconds baad dobara poochein.";
            return;
        }

        let aiText = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;
        
        if (aiText && aiText.trim().length > 0) {
            // Sirf asli response nikalna
            aiText = aiText.split("### Response:").pop().trim();
            if (outputEl) outputEl.innerHTML = `🔱 <b>MA Bot:</b> ${aiText}`;
        } else {
            throw new Error("Empty AI Response");
        }

    } catch (error) {
        console.error("🔱 Bot System Error:", error.message);
        
        const fallbackMsg = `Pranam, mujhe "${query}" ke bare mein janna hai`;
        const waLink = `${BotConfig.whatsappLink}?text=${encodeURIComponent(fallbackMsg)}`;
        
        if (outputEl) {
            outputEl.innerHTML = `
                🔱 Iska sateek uttar purn vishleshan mangta hai. Sidha mujhse judiye:<br><br>
                <a href="${waLink}" target="_blank" style="background:#25D366; color:#fff; padding:8px 15px; border-radius:5px; text-decoration:none; display:inline-block; font-weight:bold; letter-spacing:0.5px;">
                    <i class="fab fa-whatsapp"></i> WhatsApp Par Baat Karein
                </a>`;
        }
    }
};

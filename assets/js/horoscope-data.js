const dailyHoroscope = {
    "aries": {
        "career": {
            "hi": "आज नेतृत्व और निर्णय लेने की क्षमता से करियर में वृद्धि होगी।",
            "en": "Leadership and decision-making skills will boost your career today."
        },
        "love": {
            "hi": "जीवनसाथी के साथ संवाद से बात बन जाएगी।",
            "en": "Communication with your partner will resolve issues."
        },
        "health": {
            "hi": "ऊर्जा अच्छी रहेगी, लेकिन थकान से बचें।",
            "en": "Energy will be high, but avoid exhaustion."
        },
        "luckyColor": "Crimson",
        "luckyNumber": "9",
        "luckyTime": "10:30 AM"
    },
    "taurus": {
        "career": {
            "hi": "मेहनत का फल मिलेगा और काम में स्थिरता रहेगी।",
            "en": "Hard work will pay off with stability at work."
        },
        "love": {
            "hi": "रोमांटिक पल मिलेंगे और जुड़ाव मजबूत होगा।",
            "en": "Romantic moments will strengthen your bond."
        },
        "health": {
            "hi": "आराम ज़रूरी है, थकान महसूस हो सकती है।",
            "en": "Rest is important as you may feel tired."
        },
        "luckyColor": "Olive Green",
        "luckyNumber": "6",
        "luckyTime": "12:20 PM"
    }
    // Isi tarah baaki 10 rashiyon ka data add karte jana...
};

// 🔱 Data Load Karne Wala Master Function
function loadHoroscope(rashiKey) {
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const data = dailyHoroscope[rashiKey];

    if (data) {
        // Language ke hisaab se text pick karna
        document.getElementById('h-career').innerText = data.career[lang];
        document.getElementById('h-love').innerText = data.love[lang];
        document.getElementById('h-health').innerText = data.health[lang];
        
        // Lucky details (common)
        document.getElementById('h-color').innerText = data.luckyColor;
        document.getElementById('h-number').innerText = data.luckyNumber;
        document.getElementById('h-time').innerText = data.luckyTime;

        // SEO & Title update (Dynamic)
        const rashiNames = { 
            "aries": { hi: "मेष", en: "Aries" },
            "taurus": { hi: "वृषभ", en: "Taurus" }
            // ... baaki naam
        };
        const currentName = rashiNames[rashiKey][lang];
        document.title = `${currentName} Rashifal 2026 | Mahadev Astrologer`;
    }
}

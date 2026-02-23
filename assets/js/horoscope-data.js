const dailyHoroscope = {
  aries: {
    career: { hi: "काम के बोझ को आज खुद पर हावी न होने दें, धीरे-धीरे सब संभल जाएगा।", en: "Try not to let work pressure overwhelm you today; things will settle down gradually." },
    love: { hi: "अपनों के साथ कुछ पल सुकून के बिताएं, छोटी बातों को तूल न दें।", en: "Spend peaceful moments with loved ones and avoid overthinking small issues." },
    health: { hi: "आंखों को थोड़ा आराम दें, स्क्रीन टाइम कम करना बेहतर होगा।", en: "Give your eyes some rest; reducing screen time would be better." },
    tip: { hi: "ॐ नमः शिवाय का जाप करें", en: "Chant 'Om Namah Shivaya'" },
    luckyColor: { hi: "लाल", en: "Red" }, luckyNumber: "9", luckyTime: "10:15 AM"
  },
  taurus: {
    career: { hi: "आज नई योजनाओं पर सोच-विचार करें, जल्दबाज़ी में फैसले न लें।", en: "Reflect on new plans today; avoid making hasty decisions." },
    love: { hi: "जीवनसाथी की बातों को सुनने से घर का माहौल और भी सुखद होगा।", en: "Listening to your partner will make the home atmosphere even more pleasant." },
    health: { hi: "ताज़ा फल और पर्याप्त पानी आपको दिनभर ऊर्जावान रखेगा।", en: "Fresh fruits and enough water will keep you energized all day." },
    tip: { hi: "किसी ज़रूरतमंद की मदद करें", en: "Help someone in need" },
    luckyColor: { hi: "सफेद", en: "White" }, luckyNumber: "6", luckyTime: "12:45 PM"
  },
  gemini: {
    career: { hi: "आज अपनी क्रिएटिविटी का इस्तेमाल करें, नए रास्ते खुल सकते हैं।", en: "Use your creativity today; new paths might open up for you." },
    love: { hi: "पुराने दोस्तों से बातचीत मन को हल्का और खुशमिजाज बनाएगी।", en: "Talking to old friends will make your heart feel light and happy." },
    health: { hi: "योग या हल्की स्ट्रेचिंग से शरीर की जकड़न दूर होगी।", en: "Yoga or light stretching will help relieve body stiffness." },
    tip: { hi: "पक्षियों को दाना डालें", en: "Feed the birds" },
    luckyColor: { hi: "हरा", en: "Green" }, luckyNumber: "5", luckyTime: "03:30 PM"
  },
  cancer: {
    career: { hi: "मेहनत का फल धीरे-धीरे ही सही पर पक्का मिलेगा, धैर्य बनाए रखें।", en: "The fruits of your labor will come slowly but surely; keep patience." },
    love: { hi: "भावुक होने के बजाय व्यावहारिक सोच रिश्तों में संतुलन लाएगी।", en: "Practical thinking instead of being overly emotional will balance relationships." },
    health: { hi: "ठंडी चीज़ों के सेवन से बचें, गले का ध्यान रखना ज़रूरी है।", en: "Avoid cold things; taking care of your throat is important." },
    tip: { hi: "गायत्री मंत्र का पाठ करें", en: "Recite the Gayatri Mantra" },
    luckyColor: { hi: "चांदी जैसा", en: "Silver" }, luckyNumber: "2", luckyTime: "09:00 AM"
  },
  leo: {
    career: { hi: "सहकर्मियों के साथ मिलकर काम करना आपके प्रोजेक्ट को सफल बनाएगा।", en: "Working together with colleagues will make your project successful." },
    love: { hi: "रिश्तों में ईगो को जगह न दें, प्यार से बात संभालना आसान होगा।", en: "Don't let ego enter relationships; handling things with love will be easier." },
    health: { hi: "रीढ़ की हड्डी का ध्यान रखें, बैठने का पोस्चर सही रखें।", en: "Take care of your spine; maintain a correct sitting posture." },
    tip: { hi: "सूर्य देव को जल अर्पित करें", en: "Offer water to the Sun God" },
    luckyColor: { hi: "सुनहरा", en: "Gold" }, luckyNumber: "1", luckyTime: "08:15 AM"
  },
  virgo: {
    career: { hi: "बारीकियों पर ध्यान देना अच्छी बात है, पर खुद को थकाएं नहीं।", en: "Focusing on details is good, but don't exhaust yourself." },
    love: { hi: "परिवार के साथ शाम की चाय पुरानी यादें ताज़ा कर देगी।", en: "Evening tea with family will refresh old memories." },
    health: { hi: "घर का बना सादा खाना आज आपके पाचन के लिए सबसे अच्छा है।", en: "Simple home-cooked food is best for your digestion today." },
    tip: { hi: "गणेश जी को दूर्वा चढ़ाएं", en: "Offer Durva grass to Lord Ganesha" },
    luckyColor: { hi: "पिस्ता", en: "Pistachio Green" }, luckyNumber: "7", luckyTime: "11:30 AM"
  },
  libra: {
    career: { hi: "फैसलों में संतुलन बनाए रखें, बजट पर नज़र रखना फायदेमंद होगा।", en: "Maintain balance in decisions; keeping an eye on the budget will benefit you." },
    love: { hi: "पार्टनर के साथ किसी छोटे ट्रिप की योजना मन को ताज़गी देगी।", en: "Planning a small trip with your partner will refresh your mind." },
    health: { hi: "किडनी और पानी की मात्रा का ध्यान रखें, हाइड्रेटेड रहें।", en: "Take care of hydration; stay well-hydrated for kidney health." },
    tip: { hi: "इत्र का प्रयोग करें", en: "Use a mild fragrance/perfume" },
    luckyColor: { hi: "नीला", en: "Light Blue" }, luckyNumber: "8", luckyTime: "04:20 PM"
  },
  scorpio: {
    career: { hi: "आज अपनी ऊर्जा को सही दिशा में लगाएं, काम में फोकस बढ़ेगा।", en: "Direct your energy in the right direction today; focus will improve." },
    love: { hi: "पार्टनर पर भरोसा करना रिश्ते की नींव को और मजबूत बनाएगा।", en: "Trusting your partner will strengthen the foundation of your relationship." },
    health: { hi: "देर रात तक जागने से बचें, पूरी नींद सेहत के लिए ज़रूरी है।", en: "Avoid staying up late; full sleep is essential for health." },
    tip: { hi: "हनुमान चालीसा का पाठ करें", en: "Recite Hanuman Chalisa" },
    luckyColor: { hi: "मैरून", en: "Maroon" }, luckyNumber: "9", luckyTime: "07:45 PM"
  },
  sagittarius: {
    career: { hi: "सीखने की प्रक्रिया कभी न रोकें, नया ज्ञान तरक्की दिलाएगा।", en: "Never stop learning; new knowledge will bring progress." },
    love: { hi: "हंसी-मज़ाक से घर का माहौल हल्का रखें, तनाव दूर होगा।", en: "Keep the home atmosphere light with humor; stress will vanish." },
    health: { hi: "पैरों की मालिश आज आपको बहुत सुकून और आराम दे सकती है।", en: "A foot massage can give you great comfort and relaxation today." },
    tip: { hi: "माथे पर केसर का तिलक लगाएं", en: "Apply a Saffron tilak on the forehead" },
    luckyColor: { hi: "पीला", en: "Yellow" }, luckyNumber: "3", luckyTime: "06:10 AM"
  },
  capricorn: {
    career: { hi: "अनुशासन ही आपकी ताकत है, बस काम के साथ आराम भी ज़रूरी है।", en: "Discipline is your strength; just remember rest is equally important." },
    love: { hi: "पुराने मतभेदों को भुलाकर नई शुरुआत करने का अच्छा समय है।", en: "It's a good time to forget old differences and make a fresh start." },
    health: { hi: "घुटनों और जोड़ों का ध्यान रखें, ज़ोर न डालें।", en: "Take care of your knees and joints; don't overstrain them." },
    tip: { hi: "शनि चालीसा का पाठ करें", en: "Recite Shani Chalisa" },
    luckyColor: { hi: "काला", en: "Black" }, luckyNumber: "8", luckyTime: "05:50 PM"
  },
  aquarius: {
    career: { hi: "आज अपनी बात स्पष्टता से रखें, गलतफहमियां दूर होंगी।", en: "Express yourself clearly today; misunderstandings will clear up." },
    love: { hi: "समाज सेवा या किसी नेक काम में साथ देना बॉन्डिंग बढ़ाएगा।", en: "Participating together in social service will strengthen your bonding." },
    health: { hi: "ताजी हवा में सांस लेना आपके फेफड़ों के लिए अच्छा रहेगा।", en: "Breathing in fresh air will be good for your lungs." },
    tip: { hi: "शिव चालीसा का पाठ करें", en: "Recite Shiv Chalisa" },
    luckyColor: { hi: "आसमानी", en: "Sky Blue" }, luckyNumber: "11", luckyTime: "01:00 PM"
  },
  pisces: {
    career: { hi: "ख्वाबों को हकीकत में बदलने के लिए योजनाबद्ध तरीके से चलें।", en: "To turn dreams into reality, follow a planned approach." },
    love: { hi: "आध्यात्मिक चर्चा रिश्तों में एक नई गहराई लेकर आएगी।", en: "Spiritual discussions will bring a new depth to relationships." },
    health: { hi: "पैरों में सूजन हो तो थोड़ा आराम करें, गुनगुने पानी का इस्तेमाल करें।", en: "If feet are swollen, rest a bit; use lukewarm water." },
    tip: { hi: "विष्णु सहस्रनाम का श्रवण करें", en: "Listen to Vishnu Sahasranama" },
    luckyColor: { hi: "सुनहरा पीला", en: "Golden Yellow" }, luckyNumber: "7", luckyTime: "04:50 PM"
  }
};

// 2. Integrated Load Function
function loadHoroscope(rashiKey) {
    const lang = localStorage.getItem('lang') || 'hi'; 
    const data = dailyHoroscope[rashiKey];

    if (data) {
        // --- Translations Engine ---
        if (window.translations && window.translations[lang]) {
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (window.translations[lang][key]) el.innerText = window.translations[lang][key];
            });
        }

        // --- Date setup ---
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const todayStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
        document.getElementById('todayDate').innerText = (lang === 'hi' ? "आज का राशिफल: " : "Daily Horoscope: ") + todayStr;

        // --- Content Update ---
        document.getElementById('h-career').innerText = data.career[lang];
        document.getElementById('h-love').innerText = data.love[lang];
        document.getElementById('h-health').innerText = data.health[lang];

        // Lucky Bar
        document.getElementById('h-color').innerText = data.luckyColor;
        document.getElementById('h-number').innerText = data.luckyNumber;
        document.getElementById('h-time').innerText = data.luckyTime;

        // --- Titles ---
        const rashiNames = {
            aries: { hi: "मेष", en: "Aries" }, taurus: { hi: "वृषभ", en: "Taurus" },
            gemini: { hi: "मिथुन", en: "Gemini" }, cancer: { hi: "कर्क", en: "Cancer" },
            leo: { hi: "सिंह", en: "Leo" }, virgo: { hi: "कन्या", en: "Virgo" },
            libra: { hi: "तुला", en: "Libra" }, scorpio: { hi: "वृश्चिक", en: "Scorpio" },
            sagittarius: { hi: "धनु", en: "Sagittarius" }, capricorn: { hi: "मकर", en: "Capricorn" },
            aquarius: { hi: "कुंभ", en: "Aquarius" }, pisces: { hi: "मीन", en: "Pisces" }
        };

        const name = rashiNames[rashiKey];
        document.getElementById('rashi-title').innerText = `${name[lang]} - ${lang === 'hi' ? 'राशिफल' : 'Horoscope'}`;
        document.title = `${name[lang]} Daily Horoscope 2026 | Mahadev Astrologer`;
    }
}

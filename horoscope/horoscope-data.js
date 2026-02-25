const dailyHoroscope = {
  aries: {
    career: {
      hi: "आज काम का दबाव महसूस हो सकता है लेकिन घबराने की जरूरत नहीं है। धैर्य और सही प्लानिंग से स्थिति संभल जाएगी।",
      en: "You may feel work pressure today, but there is no need to panic. With patience and planning, things will improve."
    },
    love: {
      hi: "परिवार और पार्टनर के साथ समय बिताने से मन शांत रहेगा। छोटी बातों को नजरअंदाज करना बेहतर होगा।",
      en: "Spending time with family and partner will bring peace. Avoid unnecessary arguments."
    },
    health: {
      hi: "आंखों और सिर में थकान हो सकती है। स्क्रीन टाइम कम रखें और आराम करें।",
      en: "You may feel eye or head strain. Reduce screen time and take rest."
    },
    tip: { hi: "ॐ नमः शिवाय का जाप करें।", en: "Chant Om Namah Shivaya." },
    luckyColor: { hi: "लाल", en: "Red" },
    luckyNumber: "9",
    luckyTime: "10:15 AM",
    luckyDate: "Today"
  },

  taurus: {
    career: {
      hi: "आज नए विचारों पर काम करने का अच्छा समय है। कोई बड़ा फैसला सोच-समझकर लें।",
      en: "Today is good for working on new ideas. Take major decisions carefully."
    },
    love: {
      hi: "जीवनसाथी की बातों को ध्यान से सुनें। इससे रिश्तों में मिठास बढ़ेगी।",
      en: "Listen carefully to your partner. This will strengthen relationships."
    },
    health: {
      hi: "खान-पान संतुलित रखें और पानी ज्यादा पिएं। इससे ऊर्जा बनी रहेगी।",
      en: "Maintain a balanced diet and drink enough water."
    },
    tip: { hi: "किसी जरूरतमंद की मदद करें।", en: "Help someone in need." },
    luckyColor: { hi: "सफेद", en: "White" },
    luckyNumber: "6",
    luckyTime: "12:45 PM",
    luckyDate: "Today"
  },

  gemini: {
    career: {
      hi: "आपकी बातचीत की कला आज काम आएगी। नए मौके मिल सकते हैं।",
      en: "Your communication skills will help today. New opportunities may come."
    },
    love: {
      hi: "पुराने दोस्तों से बात होगी जिससे मन खुश रहेगा। रिश्तों में नई ताजगी आएगी।",
      en: "Talking to old friends will make you feel happy and relaxed."
    },
    health: {
      hi: "हल्की एक्सरसाइज़ या योग फायदेमंद रहेगा। शरीर हल्का महसूस होगा।",
      en: "Light exercise or yoga will be beneficial."
    },
    tip: { hi: "पक्षियों को दाना डालें।", en: "Feed the birds." },
    luckyColor: { hi: "हरा", en: "Green" },
    luckyNumber: "5",
    luckyTime: "03:30 PM",
    luckyDate: "Today"
  },

  cancer: {
    career: {
      hi: "मेहनत का फल धीरे-धीरे मिलेगा। धैर्य बनाए रखें और काम पर ध्यान दें।",
      en: "Your efforts will pay off slowly. Stay patient and focused."
    },
    love: {
      hi: "भावनाओं में बहने से बचें। समझदारी से बात करने से रिश्ते मजबूत होंगे।",
      en: "Avoid being overly emotional. Practical talks will help."
    },
    health: {
      hi: "ठंडी चीजों से बचें और गले का ध्यान रखें।",
      en: "Avoid cold items and take care of your throat."
    },
    tip: { hi: "गायत्री मंत्र का पाठ करें।", en: "Recite Gayatri Mantra." },
    luckyColor: { hi: "चांदी", en: "Silver" },
    luckyNumber: "2",
    luckyTime: "09:00 AM",
    luckyDate: "Today"
  },

  leo: {
    career: {
      hi: "टीमवर्क से सफलता मिलेगी। अहंकार से बचें और सहयोग करें।",
      en: "Teamwork will bring success. Avoid ego issues."
    },
    love: {
      hi: "प्यार से बात करने से रिश्ते और मजबूत होंगे।",
      en: "Handle relationships with love and care."
    },
    health: {
      hi: "रीढ़ और पीठ का ध्यान रखें। सही पोस्चर में बैठें।",
      en: "Take care of your spine and posture."
    },
    tip: { hi: "सूर्य को जल अर्पित करें।", en: "Offer water to the Sun." },
    luckyColor: { hi: "सुनहरा", en: "Golden" },
    luckyNumber: "1",
    luckyTime: "08:15 AM",
    luckyDate: "Today"
  },

  virgo: {
    career: {
      hi: "बारीकियों पर ध्यान दें लेकिन खुद को थकाएं नहीं।",
      en: "Focus on details but don’t overwork yourself."
    },
    love: {
      hi: "परिवार के साथ समय बिताने से मन खुश रहेगा।",
      en: "Spending time with family will bring happiness."
    },
    health: {
      hi: "सादा और घर का बना खाना फायदेमंद रहेगा।",
      en: "Simple home-cooked food will be good."
    },
    tip: { hi: "गणेश जी को दूर्वा चढ़ाएं।", en: "Offer Durva to Lord Ganesha." },
    luckyColor: { hi: "पिस्ता", en: "Pistachio Green" },
    luckyNumber: "7",
    luckyTime: "11:30 AM",
    luckyDate: "Today"
  },

  libra: {
    career: {
      hi: "फैसलों में संतुलन बनाए रखें। आर्थिक योजना पर ध्यान दें।",
      en: "Maintain balance in decisions. Watch your finances."
    },
    love: {
      hi: "पार्टनर के साथ छोटी यात्रा की योजना बन सकती है।",
      en: "A short trip with your partner is possible."
    },
    health: {
      hi: "पानी ज्यादा पिएं और खुद को हाइड्रेट रखें।",
      en: "Drink plenty of water and stay hydrated."
    },
    tip: { hi: "हल्की खुशबू का प्रयोग करें।", en: "Use a mild fragrance." },
    luckyColor: { hi: "नीला", en: "Light Blue" },
    luckyNumber: "8",
    luckyTime: "04:20 PM",
    luckyDate: "Today"
  },

  scorpio: {
    career: {
      hi: "ऊर्जा को सही दिशा में लगाएं। फोकस बढ़ेगा।",
      en: "Channel your energy in the right direction."
    },
    love: {
      hi: "भरोसा रिश्तों को मजबूत बनाएगा।",
      en: "Trust will strengthen relationships."
    },
    health: {
      hi: "पूरी नींद लेना जरूरी है। देर रात जागने से बचें।",
      en: "Proper sleep is essential. Avoid late nights."
    },
    tip: { hi: "हनुमान चालीसा का पाठ करें।", en: "Recite Hanuman Chalisa." },
    luckyColor: { hi: "मैरून", en: "Maroon" },
    luckyNumber: "9",
    luckyTime: "07:45 PM",
    luckyDate: "Today"
  },

  sagittarius: {
    career: {
      hi: "सीखने की इच्छा आपको आगे बढ़ाएगी।",
      en: "Your desire to learn will help you grow."
    },
    love: {
      hi: "हंसी-मजाक से घर का माहौल अच्छा रहेगा।",
      en: "Keep the atmosphere light with humor."
    },
    health: {
      hi: "पैरों की मालिश आराम देगी।",
      en: "Foot massage will be relaxing."
    },
    tip: { hi: "केसर का तिलक लगाएं।", en: "Apply saffron tilak." },
    luckyColor: { hi: "पीला", en: "Yellow" },
    luckyNumber: "3",
    luckyTime: "06:10 AM",
    luckyDate: "Today"
  },

  capricorn: {
    career: {
      hi: "अनुशासन आपकी ताकत है। काम के साथ आराम भी जरूरी है।",
      en: "Discipline is your strength. Balance work and rest."
    },
    love: {
      hi: "पुरानी गलतफहमियां दूर हो सकती हैं।",
      en: "Old misunderstandings may clear."
    },
    health: {
      hi: "जोड़ों और घुटनों का ध्यान रखें।",
      en: "Take care of joints and knees."
    },
    tip: { hi: "शनि चालीसा का पाठ करें।", en: "Recite Shani Chalisa." },
    luckyColor: { hi: "काला", en: "Black" },
    luckyNumber: "8",
    luckyTime: "05:50 PM",
    luckyDate: "Today"
  },

  aquarius: {
    career: {
      hi: "अपनी बात साफ रखें। गलतफहमियां दूर होंगी।",
      en: "Express yourself clearly to avoid confusion."
    },
    love: {
      hi: "साथ मिलकर समाजसेवा करना रिश्ते मजबूत करेगा।",
      en: "Doing social work together will strengthen bonds."
    },
    health: {
      hi: "ताजी हवा में समय बिताएं।",
      en: "Spend time in fresh air."
    },
    tip: { hi: "शिव चालीसा का पाठ करें।", en: "Recite Shiv Chalisa." },
    luckyColor: { hi: "आसमानी", en: "Sky Blue" },
    luckyNumber: "11",
    luckyTime: "01:00 PM",
    luckyDate: "Today"
  },

  pisces: {
    career: {
      hi: "योजनाबद्ध तरीके से चलेंगे तो सफलता मिलेगी।",
      en: "Following a planned approach will bring success."
    },
    love: {
      hi: "आध्यात्मिक बातें रिश्तों को गहरा करेंगी।",
      en: "Spiritual discussions will deepen relationships."
    },
    health: {
      hi: "पैरों को आराम दें और गुनगुने पानी का प्रयोग करें।",
      en: "Rest your feet and use lukewarm water."
    },
    tip: { hi: "विष्णु सहस्रनाम सुनें।", en: "Listen to Vishnu Sahasranama." },
    luckyColor: { hi: "सुनहरा पीला", en: "Golden Yellow" },
    luckyNumber: "7",
    luckyTime: "04:50 PM",
    luckyDate: "Today"
  }
};

// 2. Integrated Load Function
function loadHoroscope(rashiKey) {
    // 1. Language aur Data fetch karna
    const lang = localStorage.getItem('selectedLang') || 'hi'; 
    const data = dailyHoroscope[rashiKey];

    if (data) {
        // --- A. Static Labels Translation (Heading labels) ---
        if (window.translations && window.translations[lang]) {
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (window.translations[lang][key]) el.innerText = window.translations[lang][key];
            });
        }

        // --- B. Date setup (Bilingual Date) ---
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const todayStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
        const dateEl = document.getElementById('todayDate');
        if(dateEl) {
            dateEl.innerText = (lang === 'hi' ? "आज का परामर्श: " : "Today's Guidance: ") + todayStr;
        }

        // --- C. Content Update (Dynamic Data from Objects) ---
        // Hum check kar rahe hain ki agar value ek object hai toh lang ke hisaab se uthaye
        const fields = {
            'h-career': data.career[lang],
            'h-love': data.love[lang],
            'h-health': data.health[lang],
            'h-tip': data.tip[lang], // Tip object handle
            'h-color': data.luckyColor[lang], // Color object handle
            'h-number': data.luckyNumber,
            'h-time': data.luckyTime
        };

        Object.entries(fields).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val || "--";
        });

        // --- D. Rashi Title & Tab Title ---
        const rashiNames = {
            aries: { hi: "मेष", en: "Aries" }, taurus: { hi: "वृषभ", en: "Taurus" },
            gemini: { hi: "मिथुन", en: "Gemini" }, cancer: { hi: "कर्क", en: "Cancer" },
            leo: { hi: "सिंह", en: "Leo" }, virgo: { hi: "कन्या", en: "Virgo" },
            libra: { hi: "तुला", en: "Libra" }, scorpio: { hi: "वृश्चिक", en: "Scorpio" },
            sagittarius: { hi: "धनु", en: "Sagittarius" }, capricorn: { hi: "मकर", en: "Capricorn" },
            aquarius: { hi: "कुंभ", en: "Aquarius" }, pisces: { hi: "मीन", en: "Pisces" }
        };

        const name = rashiNames[rashiKey];
        const titleEl = document.getElementById('rashi-title');
        if(titleEl) {
            titleEl.innerText = `${name[lang]} - ${lang === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope'}`;
        }
        document.title = `${name[lang]} | ${lang === 'hi' ? 'आज का राशिफल' : 'Daily Horoscope'} 2026`;
    }
}

// 🔱 Auto-Refresh on Storage Change (Bhasha badalte hi data badle)
window.addEventListener('storage', () => {
    const rashiFromURL = window.location.pathname.split('/').pop().replace('.html', '');
    if(rashiFromURL) loadHoroscope(rashiFromURL);
});

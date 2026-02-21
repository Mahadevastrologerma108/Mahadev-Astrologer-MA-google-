// 1. Aapka Integrated Data
const dailyHoroscope = {
  aries: {
    career: {
      hi: "आज पैसों को लेकर थोड़ा सोच-विचार ज्यादा रह सकता है। खर्च अचानक सामने आ सकता है, लेकिन संभलकर चलोगे तो संतुलन बना रहेगा।",
      en: "Money matters may need extra attention today. Sudden expenses are possible, but mindful handling can keep things balanced."
    },
    love: {
      hi: "परिवार या पार्टनर के साथ पैसों को लेकर बातचीत हो सकती है। शांत तरीके से बात करने पर गलतफहमी कम हो सकती है।",
      en: "Discussions about finances may happen with family or partner. Calm communication can avoid misunderstandings."
    },
    health: {
      hi: "मानसिक थकान महसूस हो सकती है। थोड़ा आराम और गहरी सांस लेना फायदेमंद रहेगा।",
      en: "Mental tiredness may be felt. Rest and deep breathing can help."
    },
    tip: "ॐ नमः शिवाय का मन ही मन जप",
    luckyColor: "Red",
    luckyNumber: "1",
    luckyTime: "10:00 AM"
  },

  taurus: {
    career: {
      hi: "कमाई को लेकर धीरे-धीरे स्थिति साफ होती दिख सकती है। जल्दबाज़ी में कोई बड़ा फैसला टालना ठीक रहेगा।",
      en: "Income-related matters may slowly become clearer. Avoid rushing into big decisions."
    },
    love: {
      hi: "घर में पैसों को लेकर सहमति बन सकती है। भरोसे से बात करने पर माहौल हल्का रहेगा।",
      en: "Financial understanding may improve within the family. Trust-based talks will help."
    },
    health: {
      hi: "खानपान में लापरवाही से बचना सही रहेगा। पेट से जुड़ी हल्की दिक्कत महसूस हो सकती है।",
      en: "Avoid careless eating habits. Minor digestive issues are possible."
    },
    tip: "ॐ सोमाय नमः",
    luckyColor: "White",
    luckyNumber: "6",
    luckyTime: "12:30 PM"
  },

  gemini: {
    career: {
      hi: "पैसों को लेकर बातचीत या मीटिंग हो सकती है। सही बात सही समय पर कहना फायदेमंद रहेगा।",
      en: "Money-related discussions or meetings may happen. Speaking wisely can benefit you."
    },
    love: {
      hi: "परिवार के किसी सदस्य की सलाह काम आ सकती है। सुनने से नया नजरिया मिल सकता है।",
      en: "Advice from a family member may help. Listening can give a new perspective."
    },
    health: {
      hi: "थोड़ी बेचैनी या तनाव महसूस हो सकता है। खुद को ज़्यादा थकाने से बचो।",
      en: "Restlessness or stress may occur. Avoid overworking yourself."
    },
    tip: "मन शांत रखो, जल्दबाज़ी मत करो",
    luckyColor: "Yellow",
    luckyNumber: "5",
    luckyTime: "3:45 PM"
  },

  cancer: {
    career: {
      hi: "आज खर्च और सेविंग दोनों पर ध्यान जा सकता है। संतुलन बनाए रखने की कोशिश फायदेमंद रहेगी।",
      en: "Expenses and savings may both need attention today. Maintaining balance is important."
    },
    love: {
      hi: "परिवार का सहयोग मन को सुकून देगा। पैसों से जुड़ा कोई फैसला मिलकर लिया जा सकता है।",
      en: "Family support will bring comfort. Financial decisions can be made together."
    },
    health: {
      hi: "मौसम के कारण सुस्ती लग सकती है। पानी और आराम पर ध्यान दो।",
      en: "Seasonal laziness may be felt. Stay hydrated and rest well."
    },
    tip: "गायत्री मंत्र का स्मरण",
    luckyColor: "Silver",
    luckyNumber: "2",
    luckyTime: "9:15 AM"
  },

  leo: {
    career: {
      hi: "कमाई बढ़ाने के नए विचार मन में आ सकते हैं। अभी योजना बनाना बेहतर रहेगा।",
      en: "New ideas to increase income may come up. Planning is better than acting immediately."
    },
    love: {
      hi: "रिश्तों में ईगो से बचना ज़रूरी है। पैसों की बात नरमी से रखें।",
      en: "Avoid ego in relationships. Handle money discussions gently."
    },
    health: {
      hi: "थकान महसूस हो सकती है। शरीर के संकेतों को नज़रअंदाज़ न करें।",
      en: "Fatigue may be felt. Don’t ignore your body’s signals."
    },
    tip: "ॐ नमो भगवते वासुदेवाय",
    luckyColor: "Gold",
    luckyNumber: "1",
    luckyTime: "11:20 AM"
  },

  virgo: {
    career: {
      hi: "पैसों से जुड़ा कोई पुराना काम आगे बढ़ सकता है। धैर्य रखने से फायदा दिख सकता है।",
      en: "An old financial matter may move forward. Patience can bring benefits."
    },
    love: {
      hi: "परिवार में आर्थिक सहयोग की भावना रहेगी। साथ मिलकर हल निकाल सकते हो।",
      en: "Financial cooperation in the family is likely. Solutions can be found together."
    },
    health: {
      hi: "पेट या गले से जुड़ी हल्की परेशानी हो सकती है। आराम जरूरी है।",
      en: "Minor digestive or throat issues may occur. Proper rest is needed."
    },
    tip: "धीरे चलो, सोच-समझकर",
    luckyColor: "Green",
    luckyNumber: "5",
    luckyTime: "2:40 PM"
  },

  libra: {
    career: {
      hi: "खर्च बढ़ने का एहसास हो सकता है। बजट पर ध्यान देने से स्थिति संभल सकती है।",
      en: "Expenses may feel higher. Budget planning can help manage things."
    },
    love: {
      hi: "घर में पैसों को लेकर चर्चा हो सकती है। संतुलित शब्दों का इस्तेमाल करो।",
      en: "Money-related talks may happen at home. Use balanced words."
    },
    health: {
      hi: "मानसिक तनाव थोड़ा कम हो सकता है। हल्का महसूस करोगे।",
      en: "Mental stress may reduce. You may feel lighter."
    },
    tip: "लक्ष्मी-गणेश का स्मरण",
    luckyColor: "Pink",
    luckyNumber: "6",
    luckyTime: "4:10 PM"
  },

  scorpio: {
    career: {
      hi: "कमाई से जुड़ा कोई अच्छा संकेत मिल सकता है। आत्मविश्वास बढ़ेगा।",
      en: "A positive sign related to income may appear. Confidence will rise."
    },
    love: {
      hi: "परिवार का साथ आर्थिक मामलों में मददगार रहेगा। भरोसा मजबूत होगा।",
      en: "Family support will help in financial matters. Trust will grow."
    },
    health: {
      hi: "स्वास्थ्य सामान्य रहेगा। मन शांत महसूस हो सकता है।",
      en: "Health should remain normal. A sense of calm may be felt."
    },
    tip: "ॐ वैष्णवी नमः",
    luckyColor: "Maroon",
    luckyNumber: "9",
    luckyTime: "8:15 PM"
  },

  sagittarius: {
    career: {
      hi: "किसी अनुभवी व्यक्ति की सलाह पैसों के मामले में काम आ सकती है। सुनना फायदेमंद रहेगा।",
      en: "Advice from an experienced person may help financially. Listening is beneficial."
    },
    love: {
      hi: "घर में खर्च को लेकर समझदारी दिखाने की ज़रूरत है। शांति बनाए रखें।",
      en: "Wisdom is needed regarding expenses at home. Maintain calmness."
    },
    health: {
      hi: "थोड़ी लापरवाही नुकसान दे सकती है। दिनचर्या संभालकर रखें।",
      en: "Carelessness may cause issues. Maintain a proper routine."
    },
    tip: "ॐ का जप",
    luckyColor: "Orange",
    luckyNumber: "3",
    luckyTime: "7:30 AM"
  },

  capricorn: {
    career: {
      hi: "पैसों को लेकर दबाव महसूस हो सकता है। धीरे-धीरे स्थिति संभलती दिखेगी।",
      en: "Financial pressure may be felt. Things may slowly stabilize."
    },
    love: {
      hi: "गुस्से से बचो, नहीं तो घर का माहौल प्रभावित हो सकता है।",
      en: "Avoid anger, or it may affect the home atmosphere."
    },
    health: {
      hi: "पुरानी परेशानी हल्की सी उभर सकती है। आराम ज़रूरी है।",
      en: "An old issue may slightly resurface. Rest is important."
    },
    tip: "श्री शिवाय नमस्तुभ्यं",
    luckyColor: "Grey",
    luckyNumber: "8",
    luckyTime: "1:20 PM"
  },

  aquarius: {
    career: {
      hi: "कमाई में उतार-चढ़ाव महसूस हो सकता है। धैर्य से काम लेने पर रास्ता साफ होगा।",
      en: "Income fluctuations may be felt. Patience will clear the path."
    },
    love: {
      hi: "परिवार में अपनापन बढ़ेगा। पैसों की बात खुलकर हो सकती है।",
      en: "Warmth will increase in the family. Financial talks may open up."
    },
    health: {
      hi: "तनाव थोड़ा परेशान कर सकता है। खुद को समय देना ज़रूरी है।",
      en: "Stress may bother you. Giving time to yourself is necessary."
    },
    tip: "ॐ नमः शिवाय",
    luckyColor: "Blue",
    luckyNumber: "11",
    luckyTime: "6:45 PM"
  },

  pisces: {
    career: {
      hi: "पैसों को लेकर भावनाओं में बहने से बचो। सोच-समझकर कदम उठाना सही रहेगा।",
      en: "Avoid emotional decisions in money matters. Thoughtful steps are better."
    },
    love: {
      hi: "घर में कोई अच्छी खबर मन खुश कर सकती है। माहौल सकारात्मक रहेगा।",
      en: "Good news at home may lift your mood. Positivity will be felt."
    },
    health: {
      hi: "स्वास्थ्य सामान्य रहेगा। बस थोड़ी सावधानी ज़रूरी है।",
      en: "Health should remain fine. Just maintain a bit of caution."
    },
    tip: "मन शांत रखो, भरोसा रखो",
    luckyColor: "Light Pink",
    luckyNumber: "7",
    luckyTime: "10:00 AM"
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
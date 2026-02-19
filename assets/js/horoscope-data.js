// 1. Aapka Integrated Data
const dailyHoroscope = {
  aries: {
    career: {
      hi: "आज काम में थोड़ा दबाव महसूस हो सकता है। अपने फैसले सोच-समझकर लें।\nनई जिम्मेदारियां चुनौतीपूर्ण होंगी, लेकिन संभलकर काम करेंगे तो फायदा होगा।",
      en: "You may feel some pressure at work today. Take decisions carefully.\nNew responsibilities may be challenging, but handling them wisely will benefit you."
    },
    love: {
      hi: "रिश्तों में छोटी बातों पर धैर्य रखें। प्यार और समझ से माहौल अच्छा रहेगा।\nसाझा समय बिताना रिश्तों को मजबूत करेगा।",
      en: "Be patient with small matters in relationships. Love and understanding will keep things smooth.\nSpending quality time together will strengthen bonds."
    },
    health: {
      hi: "थकान या सिर भारी लग सकता है। थोड़ा आराम और ध्यान फायदेमंद रहेगा।\n'ॐ नमः शिवाय' मंत्र का उच्चारण मन को शांति देगा।",
      en: "You may feel tired or heavy-headed. Some rest and mindfulness will help.\nChanting 'Om Namah Shivaya' can calm your mind."
    },
    luckyColor: "Red",
    luckyNumber: "1",
    luckyTime: "10:00 AM",
    advice: {
      hi: "आज धैर्य और समझदारी सबसे जरूरी है। अपनी ऊर्जा सही काम में लगाएं।",
      en: "Patience and wisdom are key today. Focus your energy on the right tasks."
    }
  },

  taurus: {
    career: {
      hi: "काम से जुड़े फैसलों में थोड़ी सावधानी रखें। जल्दीबाज़ी से बचें।\nनई योजनाएं धीरे-धीरे अपनाएं, इससे स्थिरता बनी रहेगी।",
      en: "Be cautious with work decisions. Avoid rushing.\nAdopt new plans gradually; it will bring stability."
    },
    love: {
      hi: "परिवार और साथी के साथ समय बिताना लाभकारी होगा।\nखुलकर बातें करने से समझ बढ़ेगी।",
      en: "Spending time with family and partner will be beneficial.\nOpen conversations will improve understanding."
    },
    health: {
      hi: "खानपान और नींद पर ध्यान दें। छोटी-छोटी आदतें फर्क डालेंगी।\n'ॐ सोमाय नमः' मंत्र का उच्चारण मन को शांत करेगा।",
      en: "Pay attention to diet and sleep. Small habits make a difference.\nChanting 'Om Somaya Namah' will calm your mind."
    },
    luckyColor: "White",
    luckyNumber: "6",
    luckyTime: "12:30 PM",
    advice: {
      hi: "आज सोच-समझकर फैसले लें और अपने समय का सही उपयोग करें।",
      en: "Make thoughtful decisions today and use your time wisely."
    }
  },

  gemini: {
    career: {
      hi: "काम में बातचीत ज्यादा हो सकती है। सुनना भी उतना ही जरूरी है।\nसाझा विचार और सहयोग से काम आसान होगा।",
      en: "Communication may increase at work. Listening is equally important.\nCollaboration and shared ideas will make work easier."
    },
    love: {
      hi: "रिश्तों में थोड़ी चिंता हो सकती है। धैर्य और प्यार से समाधान मिलेगा।\nछोटी-छोटी बातें समझदारी से संभालें।",
      en: "Some concerns may arise in relationships. Patience and love will help resolve them.\nHandle small matters wisely."
    },
    health: {
      hi: "स्वास्थ्य सामान्य रहेगा। थोड़ी हल्की व्यायाम लाभकारी होगी।\n'ॐ नमः शिवाय' मंत्र का उच्चारण मन को शांति देगा।",
      en: "Health will be normal. Light exercise will be beneficial.\nChanting 'Om Namah Shivaya' will calm your mind."
    },
    luckyColor: "Yellow",
    luckyNumber: "5",
    luckyTime: "3:45 PM",
    advice: {
      hi: "आज धैर्य और संतुलन बनाए रखें, किसी भी कार्य में जल्दबाज़ी से बचें।",
      en: "Maintain patience and balance today; avoid haste in any task."
    }
  },

  cancer: {
    career: {
      hi: "आज खर्च और कमाई दोनों पर ध्यान दें। संतुलित निर्णय लाभ देंगे।\nनए अवसरों पर सोच-समझकर काम करें।",
      en: "Pay attention to income and expenses today. Balanced decisions will help.\nThink carefully before taking new opportunities."
    },
    love: {
      hi: "परिवार और साथी के साथ भावनात्मक समय अच्छा रहेगा।\nसाझा प्रयास से रिश्तों में सामंजस्य बढ़ेगा।",
      en: "Emotional moments with family and partner will be good.\nJoint efforts will enhance harmony in relationships."
    },
    health: {
      hi: "स्वास्थ्य में हल्की कमजोरी महसूस हो सकती है। आराम और पोषण पर ध्यान दें।\nगायत्री मंत्र का उच्चारण मन को शांति देगा।",
      en: "You may feel slightly weak. Focus on rest and nutrition.\nChanting Gayatri Mantra will calm your mind."
    },
    luckyColor: "Silver",
    luckyNumber: "2",
    luckyTime: "9:15 AM",
    advice: {
      hi: "आज संतुलन और संयम सबसे ज्यादा जरूरी है।",
      en: "Balance and self-control are most important today."
    }
  },

  leo: {
    career: {
      hi: "काम में फोकस जरूरी है। ध्यान भटकने से बचें।\nसुरुचिपूर्ण योजना से सफलता मिल सकती है।",
      en: "Focus is necessary at work. Avoid distractions.\nA well-planned approach can lead to success."
    },
    love: {
      hi: "रिश्तों में थोड़ी परीक्षा हो सकती है। धैर्य बनाए रखें।\nसाझा समय और समझदारी से रिश्ते मजबूत होंगे।",
      en: "Relationships may be tested. Maintain patience.\nQuality time and understanding will strengthen bonds."
    },
    health: {
      hi: "पानी और नींद पर ध्यान दें। थकान कम करने के उपाय करें।\n'ॐ नमो भगवते वासुदेवाय' मंत्र से मन स्थिर होगा।",
      en: "Pay attention to hydration and sleep. Take measures to reduce fatigue.\nChanting 'Om Namo Bhagavate Vasudevaya' will stabilize your mind."
    },
    luckyColor: "Gold",
    luckyNumber: "1",
    luckyTime: "11:20 AM",
    advice: {
      hi: "आज योजना और संयम से काम करें, जल्दबाज़ी से बचें।",
      en: "Act with planning and patience today; avoid haste."
    }
  },

  virgo: {
    career: {
      hi: "व्यापार और काम में प्रगति संभव है। स्पष्ट योजना से आत्मविश्वास बढ़ेगा।\nसंकट के समय संयम बनाए रखें।",
      en: "Progress in work and business is possible. Clear planning will boost confidence.\nMaintain composure during challenges."
    },
    love: {
      hi: "साथी या परिवार के साथ तालमेल अच्छा रहेगा।\nसाझा प्रयास रिश्तों को मजबूत करेगा।",
      en: "Coordination with partner or family will be good.\nJoint efforts will strengthen relationships."
    },
    health: {
      hi: "पेट और गले से हल्की परेशानी हो सकती है। ध्यान और आराम लाभकारी होंगे।\nशिव मंत्र का उच्चारण शांति देगा।",
      en: "Minor digestive or throat issues may occur. Rest and mindfulness will help.\nChanting Shiva mantra will bring peace."
    },
    luckyColor: "Green",
    luckyNumber: "5",
    luckyTime: "2:40 PM",
    advice: {
      hi: "आज सोच-समझकर कदम उठाएं और संतुलित रहें।",
      en: "Take thoughtful steps today and stay balanced."
    }
  },

  libra: {
    career: {
      hi: "आज खर्च बढ़ सकते हैं, संयम जरूरी है।\nनए अवसर सोच-समझकर अपनाएं।",
      en: "Expenses may rise today; discipline is necessary.\nAdopt new opportunities carefully."
    },
    love: {
      hi: "रिश्तों में शब्दों का असर बढ़ सकता है।\nसोच-समझकर बातचीत करें।",
      en: "Words may have more impact in relationships today.\nSpeak thoughtfully."
    },
    health: {
      hi: "पुरानी परेशानियों में राहत मिल सकती है।\nथोड़ा ध्यान और आराम जरूरी है।",
      en: "Relief from old issues is possible.\nSome attention and rest are needed."
    },
    luckyColor: "Pink",
    luckyNumber: "6",
    luckyTime: "4:10 PM",
    advice: {
      hi: "आज संयम और समझदारी से काम लें।",
      en: "Act with prudence and patience today."
    }
  },

  scorpio: {
    career: {
      hi: "काम में प्रशंसा या अवसर मिल सकता है।\nआत्मविश्वास बढ़ाने के लिए सकारात्मक सोच रखें।",
      en: "Recognition or opportunity may come at work.\nMaintain positive thinking to boost confidence."
    },
    love: {
      hi: "परिवार और साथी का समर्थन महसूस होगा।\nमिलकर काम करने की भावना बनेगी।",
      en: "Support from family and partner will be felt.\nA sense of teamwork will grow."
    },
    health: {
      hi: "स्वास्थ्य सामान्य रहेगा। हल्की सावधानी फायदेमंद होगी।\n'ॐ वैष्णवी नमः' मंत्र मन को शांत करेगा।",
      en: "Health will be normal. Some caution will help.\nChanting 'Om Vaishnavi Namah' will calm your mind."
    },
    luckyColor: "Maroon",
    luckyNumber: "9",
    luckyTime: "8:15 PM",
    advice: {
      hi: "आज सकारात्मक सोच और संयम बनाए रखें।",
      en: "Keep positive thinking and composure today."
    }
  },

  sagittarius: {
    career: {
      hi: "बुजुर्गों या साथी की सलाह लाभकारी होगी।\nनए विचारों को अपनाएं और संयम बनाए रखें।",
      en: "Advice from elders or partner will help.\nEmbrace new ideas and maintain composure."
    },
    love: {
      hi: "जल्दबाज़ी से बचें।\nधैर्य से रिश्तों में सुधार आएगा।",
      en: "Avoid impulsiveness.\nPatience will improve relationships."
    },
    health: {
      hi: "धूल और प्रदूषण से दूरी बनाएं।\n'ॐ' मंत्र का उच्चारण शांति देगा।",
      en: "Avoid dust and pollution.\nChanting 'Om' will bring peace."
    },
    luckyColor: "Orange",
    luckyNumber: "3",
    luckyTime: "7:30 AM",
    advice: {
      hi: "आज सोच-समझकर कदम उठाएं और संयम बनाए रखें।",
      en: "Take thoughtful steps and stay composed today."
    }
  },

  capricorn: {
    career: {
      hi: "आज खर्चों पर ध्यान दें। संतुलित रहना लाभकारी होगा।\nनए अवसर सोच-समझकर अपनाएं।",
      en: "Pay attention to expenses today. Staying balanced will help.\nAdopt new opportunities carefully."
    },
    love: {
      hi: "गुस्सा रिश्तों को प्रभावित कर सकता है।\nशांति बनाए रखने से मधुरता बनी रहेगी।",
      en: "Anger may affect relationships.\nMaintaining calm will keep harmony."
    },
    health: {
      hi: "पुरानी परेशानियाँ उभर सकती हैं।\n'श्री शिवाय नमस्तुभ्यं' मंत्र का उच्चारण फायदेमंद होगा।",
      en: "Old issues may resurface.\nChanting 'Shree Shivaya Namastubhyam' will be helpful."
    },
    luckyColor: "Grey",
    luckyNumber: "8",
    luckyTime: "1:20 PM",
    advice: {
      hi: "आज संयम और संतुलन बनाए रखें।",
      en: "Maintain composure and balance today."
    }
  },

  aquarius: {
    career: {
      hi: "काम में उतार-चढ़ाव होंगे।\nधैर्य बनाए रखने से चीजें आसान होंगी।",
      en: "Ups and downs at work may occur.\nPatience will make things easier."
    },
    love: {
      hi: "रिश्तों में अपनापन लौट सकता है।\nखुलकर बात करें, समझ बढ़ेगी।",
      en: "Warmth may return in relationships.\nOpen communication will improve understanding."
    },
    health: {
      hi: "तनाव और ब्लड प्रेशर पर ध्यान दें।\n'ॐ नमः शिवाय' मंत्र शांति देगा।",
      en: "Pay attention to stress and BP.\nChanting 'Om Namah Shivaya' will calm your mind."
    },
    luckyColor: "Blue",
    luckyNumber: "11",
    luckyTime: "6:45 PM",
    advice: {
      hi: "आज संयम और धैर्य रखें।",
      en: "Maintain patience and composure today."
    }
  },

  pisces: {
    career: {
      hi: "अति आत्मविश्वास से बचें।\nसोच-समझकर कदम उठाने से लाभ होगा।",
      en: "Avoid overconfidence.\nThoughtful steps will be beneficial."
    },
    love: {
      hi: "परिवार में अच्छी खबर सुनने को मिल सकती है।\nसाझा समय खुशियाँ बढ़ाएगा।",
      en: "Good news in family may come.\nSpending time together will increase happiness."
    },
    health: {
      hi: "स्वास्थ्य सामान्य रहेगा।\nवाहन चलाते समय सावधानी रखें।",
      en: "Health will remain fine.\nTake care while driving."
    },
    luckyColor: "Light Pink",
    luckyNumber: "7",
    luckyTime: "10:00 AM",
    advice: {
      hi: "आज समझदारी और धैर्य से काम लें।",
      en: "Act wisely and with patience today."
    }
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
const dailyHoroscope = {
  "aries": {
    "career": "आज नेतृत्व और निर्णय लेने की क्षमता से करियर में वृद्धि होगी। वरिष्ठ आप पर भरोसा दिखाएंगे。\nLeadership and decision-making skills will boost your career. Seniors will trust your abilities.",
    "love": "जीवनसाथी के साथ हल्की नोक-झोंक हो सकती है, शांत संवाद से बात बन जाएगी。\nMinor arguments with your partner may occur, but calm communication will resolve them.",
    "health": "ऊर्जा अच्छी रहेगी, लेकिन अधिक मेहनत से थकान हो सकती है。\nEnergy will be high, but avoid overexertion.",
    "luckyColor": "Crimson",
    "luckyNumber": "9",
    "luckyTime": "10:30 AM"
  },

  "taurus": {
    "career": "मेहनत का फल मिलेगा और काम में स्थिरता बनी रहेगी。\nYour hard work will pay off and stability at work will continue.",
    "love": "रोमांटिक पल मिलेंगे और भावनात्मक जुड़ाव मजबूत होगा。\nRomantic moments and emotional bonding will strengthen.",
    "health": "शरीर में भारीपन या थकान महसूस हो सकती है, आराम ज़रूरी है。\nYou may feel tired or heavy; proper rest is important.",
    "luckyColor": "Olive Green",
    "luckyNumber": "6",
    "luckyTime": "12:20 PM"
  },

  "gemini": {
    "career": "संवाद और नेटवर्किंग से लाभ होगा, इंटरव्यू के लिए अच्छा दिन है。\nCommunication and networking will bring benefits; a good day for interviews.",
    "love": "स्पष्ट बातचीत से भ्रम दूर होगा。\nClear communication will remove confusion in relationships.",
    "health": "मानसिक तनाव हो सकता है, ब्रेक और गहरी सांस लें。\nMental stress is possible; take breaks and practice deep breathing.",
    "luckyColor": "Sky Blue",
    "luckyNumber": "5",
    "luckyTime": "11:45 AM"
  },

  "cancer": {
    "career": "टीमवर्क से सफलता मिलेगी, भावनात्मक समझ आपकी ताकत बनेगी。\nTeamwork will bring success; emotional intelligence is your strength.",
    "love": "परिवार और जीवनसाथी से भावनात्मक सहयोग मिलेगा。\nEmotional support from family and partner is indicated.",
    "health": "पाचन या एसिडिटी की समस्या हो सकती है。\nDigestive or acidity issues may trouble you.",
    "luckyColor": "Silver",
    "luckyNumber": "2",
    "luckyTime": "01:15 PM"
  },

  "leo": {
    "career": "आज प्रशंसा या पहचान मिल सकती है。\nYou may receive appreciation or recognition today.",
    "love": "आकर्षण मजबूत रहेगा, अहंकार से बचें。\nAttraction will be strong; keep ego under control.",
    "health": "स्वास्थ्य अच्छा रहेगा, पानी अधिक पिएँ。\nOverall health will be good; stay hydrated.",
    "luckyColor": "Gold",
    "luckyNumber": "1",
    "luckyTime": "02:35 PM"
  },

  "virgo": {
    "career": "योजना और अनुशासन से लंबित काम पूरे होंगे。\nPlanning and discipline will help you complete pending tasks.",
    "love": "ज़्यादा सोचने से बचें, सरल दृष्टिकोण रखें。\nAvoid overthinking; keep a simple approach.",
    "health": "पाचन तंत्र पर ध्यान देना ज़रूरी है。\nFocus on digestive health.",
    "luckyColor": "Beige",
    "luckyNumber": "3",
    "luckyTime": "04:40 PM"
  },

  "libra": {
    "career": "साझेदारी और सहयोग से लाभ होगा。\nPartnerships and collaboration will be beneficial.",
    "love": "रिश्तों में संतुलन और सामंजस्य रहेगा。\nBalance and harmony will prevail in relationships.",
    "health": "पीठ दर्द या पोस्चर समस्या हो सकती है。\nBack pain or posture issues may occur.",
    "luckyColor": "Rose Pink",
    "luckyNumber": "7",
    "luckyTime": "06:30 PM"
  },

  "scorpio": {
    "career": "रणनीति और गुप्त योजना सफल होगी。\nStrategic and behind-the-scenes planning will succeed.",
    "love": "भरोसा बनाए रखें, शक से बचें。\nMaintain trust and avoid possessiveness.",
    "health": "मूड स्विंग या हार्मोनल असंतुलन हो सकता है。\nMood swings or hormonal imbalance may occur.",
    "luckyColor": "Deep Red",
    "luckyNumber": "8",
    "luckyTime": "08:25 PM"
  },

  "sagittarius": {
    "career": "सीखने या यात्रा से भविष्य में लाभ होगा。\nLearning or travel will support future growth.",
    "love": "सकारात्मक ऊर्जा से परिवार में खुशी रहेगी。\nPositive vibes will keep family life happy.",
    "health": "जोड़ों या पैरों में परेशानी हो सकती है。\nJoint or leg discomfort is possible.",
    "luckyColor": "Saffron",
    "luckyNumber": "4",
    "luckyTime": "07:55 AM"
  },

  "capricorn": {
    "career": "मेहनत का पूरा फल मिलेगा और ज़िम्मेदारी बढ़ेगी。\nHard work will be rewarded and responsibilities increase.",
    "love": "भावनाएँ व्यक्त करने का सही समय है。\nIt’s a good time to express your feelings.",
    "health": "गर्दन या कंधे में दर्द हो सकता है。\nNeck or shoulder pain is possible.",
    "luckyColor": "Charcoal",
    "luckyNumber": "8",
    "luckyTime": "03:55 PM"
  },

  "aquarius": {
    "career": "नए और रचनात्मक विचारों से पहचान बनेगी。\nInnovative ideas will help you stand out.",
    "love": "अचानक आया संदेश खुशी देगा。\nAn unexpected message or call will bring happiness.",
    "health": "मानसिक आराम की आवश्यकता है。\nMental rest is necessary today.",
    "luckyColor": "Turquoise",
    "luckyNumber": "11",
    "luckyTime": "05:45 PM"
  },

  "pisces": {
    "career": "अंतर्ज्ञान पर भरोसा करें, सही दिशा मिलेगी。\nTrust your intuition; it will guide you correctly.",
    "love": "भावनात्मक नज़दीकियाँ बढ़ेंगी。\nEmotional closeness will increase.",
    "health": "नींद पूरी लेना बेहद ज़रूरी है。\nProper sleep is very important today.",
    "luckyColor": "Lavender",
    "luckyNumber": "12",
    "luckyTime": "09:30 PM"
  }
};

// Data Load Karne Wala Function
function loadHoroscope(rashiKey) {
const data = dailyHoroscope[rashiKey];
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const today = new Date().toLocaleDateString('en-US', options);

if (data) {
document.getElementById('todayDate').innerText = "Daily Horoscope: " + today;
document.getElementById('h-career').innerText = data.career;
document.getElementById('h-love').innerText = data.love;
document.getElementById('h-health').innerText = data.health;
document.getElementById('h-color').innerText = data.luckyColor;
document.getElementById('h-number').innerText = data.luckyNumber;
document.getElementById('h-time').innerText = data.luckyTime;
}

}
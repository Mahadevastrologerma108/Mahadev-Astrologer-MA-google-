const dailyHoroscope = {
    "aries": {
        "career": { "hi": "आज नेतृत्व और निर्णय लेने की क्षमता से करियर में वृद्धि होगी।", "en": "Leadership and decision-making skills will boost your career today." },
        "love": { "hi": "जीवनसाथी के साथ संवाद से बात बन जाएगी।", "en": "Communication with your partner will resolve issues." },
        "health": { "hi": "ऊर्जा अच्छी रहेगी, लेकिन थकान से बचें।", "en": "Energy will be high, but avoid exhaustion." },
        "luckyColor": "Crimson", "luckyNumber": "9", "luckyTime": "10:30 AM"
    },
    "taurus": {
        "career": { "hi": "मेहनत का फल मिलेगा और काम में स्थिरता रहेगी।", "en": "Hard work will pay off with stability at work." },
        "love": { "hi": "रोमांटिक पल मिलेंगे और जुड़ाव मजबूत होगा।", "en": "Romantic moments will strengthen your bond." },
        "health": { "hi": "आराम ज़रूरी है, थकान महसूस हो सकती है।", "en": "Rest is important as you may feel tired." },
        "luckyColor": "Olive Green", "luckyNumber": "6", "luckyTime": "12:20 PM"
    },
    "gemini": {
        "career": { "hi": "संवाद और नेटवर्king से लाभ होगा, इंटरव्यू के लिए अच्छा दिन है।", "en": "Communication and networking will bring benefits today." },
        "love": { "hi": "स्पष्ट बातचीत से भ्रम दूर होगा।", "en": "Clear communication will remove confusion." },
        "health": { "hi": "मानसिक तनाव हो सकता है, गहरी सांस लें।", "en": "Mental stress is possible; practice deep breathing." },
        "luckyColor": "Sky Blue", "luckyNumber": "5", "luckyTime": "11:45 AM"
    },
    "cancer": {
        "career": { "hi": "टीमवर्क से सफलता मिलेगी, अपनी समझ पर भरोसा रखें।", "en": "Teamwork will bring success; trust your instincts." },
        "love": { "hi": "परिवार और साथी से भावनात्मक सहयोग मिलेगा।", "en": "Emotional support from family and partner is indicated." },
        "health": { "hi": "पाचन या एसिडिटी की समस्या हो सकती है।", "en": "Digestive or acidity issues may trouble you." },
        "luckyColor": "Silver", "luckyNumber": "2", "luckyTime": "01:15 PM"
    },
    "leo": {
        "career": { "hi": "आज प्रशंसा या पहचान मिल सकती है, आत्मविश्वास बना रहेगा।", "en": "You may receive appreciation or recognition today." },
        "love": { "hi": "आकर्षण मजबूत रहेगा, लेकिन अहंकार से बचें।", "en": "Attraction will be strong; avoid ego." },
        "health": { "hi": "स्वास्थ्य अच्छा रहेगा, पानी अधिक पिएं।", "en": "Overall health will be good; stay hydrated." },
        "luckyColor": "Gold", "luckyNumber": "1", "luckyTime": "02:35 PM"
    },
    "virgo": {
        "career": { "hi": "योजना और अनुशासन से रुके हुए काम पूरे होंगे।", "en": "Planning and discipline will help complete pending tasks." },
        "love": { "hi": "ज़्यादा सोचने से बचें, रिश्ते को सरल रखें।", "en": "Avoid overthinking; keep relationships simple." },
        "health": { "hi": "पाचन तंत्र पर ध्यान देना ज़रूरी है।", "en": "Focus on digestive health." },
        "luckyColor": "Beige", "luckyNumber": "3", "luckyTime": "04:40 PM"
    },
    "libra": {
        "career": { "hi": "साझेदारी और सहयोग से लाभ होगा।", "en": "Partnerships and collaboration will be beneficial." },
        "love": { "hi": "रिश्तों में संतुलन और सामंजस्य बना रहेगा।", "en": "Balance and harmony will prevail." },
        "health": { "hi": "पीठ दर्द या बैठने के तरीके (posture) पर ध्यान दें।", "en": "Back pain or posture issues may occur." },
        "luckyColor": "Rose Pink", "luckyNumber": "7", "luckyTime": "06:30 PM"
    },
    "scorpio": {
        "career": { "hi": "रणनीति और गुप्त योजनाएं सफल होंगी।", "en": "Strategic and secret planning will succeed." },
        "love": { "hi": "भरोसा बनाए रखें, शक करने से बचें।", "en": "Maintain trust; avoid possessiveness." },
        "health": { "hi": "मूड स्विंग्स हो सकते हैं, शांत रहें।", "en": "Mood swings are possible; stay calm." },
        "luckyColor": "Deep Red", "luckyNumber": "8", "luckyTime": "08:25 PM"
    },
    "sagittarius": {
        "career": { "hi": "सीखने या यात्रा करने से भविष्य में लाभ होगा।", "en": "Learning or travel will support future growth." },
        "love": { "hi": "सकारात्मक ऊर्जा से परिवार में खुशी रहेगी।", "en": "Positive vibes will keep family life happy." },
        "health": { "hi": "जोड़ों या पैरों में हल्का दर्द हो सकता है।", "en": "Joint or leg discomfort is possible." },
        "luckyColor": "Saffron", "luckyNumber": "4", "luckyTime": "07:55 AM"
    },
    "capricorn": {
        "career": { "hi": "मेहनत का फल मिलेगा, बड़ी ज़िम्मेदारी मिल सकती है।", "en": "Hard work will be rewarded with new responsibilities." },
        "love": { "hi": "भावनाएं व्यक्त करने के लिए सही समय है।", "en": "Good time to express your feelings." },
        "health": { "hi": "गर्दन या कंधे में दर्द की शिकायत हो सकती है।", "en": "Neck or shoulder pain is possible." },
        "luckyColor": "Charcoal", "luckyNumber": "8", "luckyTime": "03:55 PM"
    },
    "aquarius": {
        "career": { "hi": "नए और रचनात्मक विचारों से पहचान बनेगी।", "en": "Innovative ideas will help you stand out." },
        "love": { "hi": "अचानक कोई संदेश मिलने से खुशी होगी।", "en": "An unexpected message will bring happiness." },
        "health": { "hi": "मानसिक आराम की ज़रूरत है।", "en": "Mental rest is necessary today." },
        "luckyColor": "Turquoise", "luckyNumber": "11", "luckyTime": "05:45 PM"
    },
    "pisces": {
        "career": { "hi": "अपने अंतर्ज्ञान (intuition) पर भरोसा करें, रास्ता मिलेगा।", "en": "Trust your intuition; it will guide you correctly." },
        "love": { "hi": "भावनात्मक नज़दीकियां बढ़ेंगी।", "en": "Emotional closeness will increase." },
        "health": { "hi": "पूरी नींद लेना बेहद ज़रूरी है।", "en": "Proper sleep is very important today." },
        "luckyColor": "Lavender", "luckyNumber": "12", "luckyTime": "09:30 PM"
    }
};

// 🔱 Master Function to Load Data
function loadHoroscope(rashiKey) {
    const lang = localStorage.getItem('preferredLang') || 'hi';
    const data = dailyHoroscope[rashiKey];

    if (data) {
        // Date Setup
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
        
        // Display Text
        document.getElementById('todayDate').innerText = (lang === 'hi' ? "आज का राशिफल: " : "Daily Horoscope: ") + today;
        document.getElementById('h-career').innerText = data.career[lang];
        document.getElementById('h-love').innerText = data.love[lang];
        document.getElementById('h-health').innerText = data.health[lang];
        document.getElementById('h-color').innerText = data.luckyColor;
        document.getElementById('h-number').innerText = data.luckyNumber;
        document.getElementById('h-time').innerText = data.luckyTime;

        // Dynamic Title & Heading for Multilingual
        const rashiNames = {
            "aries": { hi: "मेष", en: "Aries" },
            "taurus": { hi: "वृषभ", en: "Taurus" },
            "gemini": { hi: "मिथुन", en: "Gemini" },
            "cancer": { hi: "कर्क", en: "Cancer" },
            "leo": { hi: "सिंह", en: "Leo" },
            "virgo": { hi: "कन्या", en: "Virgo" },
            "libra": { hi: "तुला", en: "Libra" },
            "scorpio": { hi: "वृश्चिक", en: "Scorpio" },
            "sagittarius": { hi: "धनु", en: "Sagittarius" },
            "capricorn": { hi: "मकर", en: "Capricorn" },
            "aquarius": { hi: "कुंभ", en: "Aquarius" },
            "pisces": { hi: "मीन", en: "Pisces" }
        };

        const name = rashiNames[rashiKey];
        document.getElementById('rashi-title').innerText = `${name[lang]} - ${lang === 'hi' ? 'राशिफल' : 'Horoscope'}`;
        document.title = `${name[lang]} Daily Horoscope 2026 | Mahadev Astrologer`;
    }
}

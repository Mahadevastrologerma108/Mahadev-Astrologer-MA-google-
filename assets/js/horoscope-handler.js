/* 🔱 MAHADEV ASTROLOGER - CENTRAL HOROSCOPE HANDLER */

// 1. 🌍 UI Translation Mapping (Bilingual Magic)
const horoscopeUI = {
    hi: {
        found_msg: "आपकी संभावित राशि:",
        read_more: "आज का राशिफल पढ़ें →",
        rashi_suffix: " राशिफल"
    },
    en: {
        found_msg: "Your Identified Rashi:",
        read_more: "Read Today's Horoscope →",
        rashi_suffix: " Horoscope"
    }
};

/**
 * 2. 🔍 MAGIC RASHI FINDER
 * Horoscope selection page par rashi dhoondhne ke liye.
 */
function handleMagicFind(val) {
    if (!val) return;

    const resultBox = document.getElementById('magicResult');
    if (!resultBox) return; 
    
    const lang = localStorage.getItem('selectedLang') || 'hi';
    const ui = horoscopeUI[lang];

    const rashiMap = {
        aries: { hi: "मेष", en: "Aries", icon: "♈" },
        taurus: { hi: "वृषभ", en: "Taurus", icon: "♉" },
        gemini: { hi: "मिथुन", en: "Gemini", icon: "♊" },
        cancer: { hi: "कर्क", en: "Cancer", icon: "♋" },
        leo: { hi: "सिंह", en: "Leo", icon: "♌" },
        virgo: { hi: "कन्या", en: "Virgo", icon: "♍" },
        libra: { hi: "तुला", en: "Libra", icon: "♎" },
        scorpio: { hi: "वृश्चिक", en: "Scorpio", icon: "♏" },
        sagittarius: { hi: "धनु", en: "Sagittarius", icon: "♐" },
        capricorn: { hi: "मकर", en: "Capricorn", icon: "♑" },
        aquarius: { hi: "कुंभ", en: "Aquarius", icon: "♒" },
        pisces: { hi: "मीन", en: "Pisces", icon: "♓" }
    };

    const info = rashiMap[val];
    const rashiName = info[lang]; // Language ke hisaab se naam uthayega

    // Result Card Display (Bilingual)
    resultBox.innerHTML = `
        <div class="animated fadeIn" style="padding: 20px;">
            <div style="font-size: 3.5rem; margin-bottom: 10px;">${info.icon}</div>
            <p style="color: #bbb; margin: 0;">${ui.found_msg}</p>
            <h4 style="color: #f5c542; font-size: 1.8rem; margin: 5px 0 15px 0;">${rashiName}</h4>
            <a href="${val}.html" class="redirect-btn" style="text-decoration:none; background: #f5c542; color: #000; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold;">
                ${ui.read_more}
            </a>
        </div>
    `;

    resultBox.style.display = 'block';

    // Dropdown Sync logic
    const nameF = document.getElementById('nameFinder');
    const monthF = document.getElementById('monthFinder');
    if (document.activeElement === nameF) monthF.selectedIndex = 0;
    else if (document.activeElement === monthF) nameF.selectedIndex = 0;
}

/**
 * 3. 📝 DATA LOADER
 * Individual rashi pages (aries.html etc.) par content load karne ke liye.
 */
function loadHoroscope(rashiKey) {
    const lang = localStorage.getItem('selectedLang') || 'hi'; 
    const data = window.dailyHoroscope ? window.dailyHoroscope[rashiKey] : null;

    if (!data) {
        console.warn("🔱 Mahadev: Data not found for rashi:", rashiKey);
        return;
    }

    // A. Content Fields Mapping
    const fields = {
        'h-career': data.career[lang],
        'h-love': data.love[lang],
        'h-health': data.health[lang],
        'h-tip': data.tip[lang],
        'h-color': data.luckyColor[lang],
        'h-number': data.luckyNumber,
        'h-time': data.luckyTime
    };

    Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "--";
    });

    // B. Title Update (Bilingual)
    const rashiTitle = document.getElementById('rashi-title');
    if (rashiTitle) {
        const rashiMap = { aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer", leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio", sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius", pisces: "Pisces" };
        const nameInLang = lang === 'hi' ? rashiMap[rashiKey] : rashiKey.charAt(0).toUpperCase() + rashiKey.slice(1);
        
        // Agar aapke pas translations.js mein keys hain (rashi_1 etc), to wo yahan use ho sakti hain
        rashiTitle.innerText = nameInLang + horoscopeUI[lang].rashi_suffix;
    }

    // C. Date Update
    const dateEl = document.getElementById('todayDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
    }
}

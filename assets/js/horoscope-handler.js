/* 🔱 MAHADEV ASTROLOGER - CENTRAL HOROSCOPE HANDLER */

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

// 🔍 MAGIC RASHI FINDER (For horoscope.html)
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
    resultBox.innerHTML = `
        <div class="animated fadeIn" style="padding: 20px;">
            <div style="font-size: 3.5rem; margin-bottom: 10px;">${info.icon}</div>
            <p style="color: #bbb; margin: 0;">${ui.found_msg}</p>
            <h4 style="color: #f5c542; font-size: 1.8rem; margin: 5px 0 15px 0;">${info[lang]}</h4>
            <a href="${val}.html" class="redirect-btn" style="text-decoration:none; background: #f5c542; color: #000; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold;">
                ${ui.read_more}
            </a>
        </div>
    `;
    resultBox.style.display = 'block';
}

// 📝 DATA LOADER (For aries.html, taurus.html etc.)
function loadHoroscope(rashiKey) {
    const lang = localStorage.getItem('selectedLang') || 'hi'; 
    // Data check: window.dailyHoroscope se feed le raha hai
    const data = window.dailyHoroscope ? window.dailyHoroscope[rashiKey] : null;

    if (!data) {
        console.warn("🔱 Mahadev: Data not found for:", rashiKey);
        return;
    }

    // A. Content Fields Mapping (Fixed Object handling)
    const fields = {
        'h-career': data.career[lang],
        'h-love': data.love[lang],
        'h-health': data.health[lang],
        'h-tip': data.tip[lang],
        'h-color': data.luckyColor[lang],
        'h-number': data.luckyNumber,
        // Yahan fix kiya hai: check karega ki time object hai ya string
        'h-time': typeof data.luckyTime === 'object' ? data.luckyTime[lang] : data.luckyTime
    };

    Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "--";
    });

    // B. Title Update (Bilingual Rashi Names)
    const rashiTitle = document.getElementById('rashi-title');
    if (rashiTitle) {
        const names = {
            aries: { hi: "मेष", en: "Aries" }, taurus: { hi: "वृषभ", en: "Taurus" },
            gemini: { hi: "मिथुन", en: "Gemini" }, cancer: { hi: "कर्क", en: "Cancer" },
            leo: { hi: "सिंह", en: "Leo" }, virgo: { hi: "कन्या", en: "Virgo" },
            libra: { hi: "तुला", en: "Libra" }, scorpio: { hi: "वृश्चिक", en: "Scorpio" },
            sagittarius: { hi: "धनु", en: "Sagittarius" }, capricorn: { hi: "मकर", en: "Capricorn" },
            aquarius: { hi: "कुंभ", en: "Aquarius" }, pisces: { hi: "मीन", en: "Pisces" }
        };
        const currentName = names[rashiKey] ? names[rashiKey][lang] : rashiKey;
        rashiTitle.innerText = currentName + horoscopeUI[lang].rashi_suffix;
    }

    // C. Date Update
    const dateEl = document.getElementById('todayDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', options);
    }
}
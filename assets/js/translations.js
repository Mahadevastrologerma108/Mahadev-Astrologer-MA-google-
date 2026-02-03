const translations = {
    en: {
        
  // ===== PLANETS =====
  planet_sun: "Sun (Surya)",
  planet_moon: "Moon (Chandra)",
  planet_mars: "Mars (Mangal)",
  planet_mercury: "Mercury (Budh)",
  planet_jupiter: "Jupiter (Guru)",
  planet_venus: "Venus (Shukra)",
  planet_saturn: "Saturn (Shani)",
  planet_rahu: "Rahu",
  planet_ketu: "Ketu",

  // ===== HOUSES =====
  house_1: "1st House (Self/Physical)",
  house_2: "2nd House (Wealth/Family)",
  house_3: "3rd House (Siblings/Courage)",
  house_4: "4th House (Mother/Happiness)",
  house_5: "5th House (Children/Wisdom)",
  house_6: "6th House (Debt/Enemies)",
  house_7: "7th House (Marriage/Partner)",
  house_8: "8th House (Longevity/Secrets)",
  house_9: "9th House (Luck/Dharma)",
  house_10: "10th House (Career/Karma)",
  house_11: "11th House (Income/Gains)",
  house_12: "12th House (Losses/Spirituality)",

  // ===== NAKSHATRA =====
  nak_ashwini: "Ashwini",
  nak_bharani: "Bharani",
  nak_krittika: "Krittika",
  nak_rohini: "Rohini",
  nak_mrigashira: "Mrigashira",
  nak_ardra: "Ardra",
  nak_punarvasu: "Punarvasu",
  nak_pushya: "Pushya",
  nak_ashlesha: "Ashlesha",
  nak_magha: "Magha",
  nak_purva_phalguni: "Purva Phalguni",
  nak_uttara_phalguni: "Uttara Phalguni",
  nak_hasta: "Hasta",
  nak_chitra: "Chitra",
  nak_swati: "Swati",
  nak_vishakha: "Vishakha",
  nak_anuradha: "Anuradha",
  nak_jyeshtha: "Jyeshtha",
  nak_mula: "Mula",
  nak_purva_ashadha: "Purva Ashadha",
  nak_uttara_ashadha: "Uttara Ashadha",
  nak_shravana: "Shravana",
  nak_dhanishta: "Dhanishta",
  nak_shatabhisha: "Shatabhisha",
  nak_purva_bhadrapada: "Purva Bhadrapada",
  nak_uttara_bhadrapada: "Uttara Bhadrapada",
  nak_revati: "Revati",

  // ===== YOGA & DOSHA =====
  yoga_gajkesari: "Gajkesari Yoga",
  yoga_budhaditya: "Budhaditya Yoga",
  yoga_shasha: "Shasha Yoga",
  yoga_malavya: "Malavya Yoga",
  yoga_hamsa: "Hamsa Yoga",
  yoga_bhadra: "Bhadra Yoga",
  yoga_ruchaka: "Ruchaka Yoga",
  yoga_laxmi: "Laxmi Yoga",

  dosha_mangal: "Mangal Dosha",
  dosha_kaal_sarp: "Kaal Sarp Dosha",
  dosha_pitar: "Pitar Dosha",

  // ===== NUMEROLOGY =====
  num_1: "Number 1 (Sun)",
  num_2: "Number 2 (Moon)",
  num_3: "Number 3 (Jupiter)",
  num_4: "Number 4 (Rahu)",
  num_5: "Number 5 (Mercury)",
  num_6: "Number 6 (Venus)",
  num_7: "Number 7 (Ketu)",
  num_8: "Number 8 (Saturn)",
  num_9: "Number 9 (Mars)"

  // ===== 64 YOGINI =====
  yogini_1: "Mangala",
  yogini_2: "Pingala",
  yogini_3: "Dhanya",
  yogini_4: "Bhramari",
  yogini_5: "Bhadrika",
  yogini_6: "Ulka",
  yogini_7: "Siddha",
  yogini_8: "Sankata",

  yogini_9: "Mangala",
  yogini_10: "Pingala",
  yogini_11: "Dhanya",
  yogini_12: "Bhramari",
  yogini_13: "Bhadrika",
  yogini_14: "Ulka",
  yogini_15: "Siddha",
  yogini_16: "Sankata",

  yogini_17: "Mangala",
  yogini_18: "Pingala",
  yogini_19: "Dhanya",
  yogini_20: "Bhramari",
  yogini_21: "Bhadrika",
  yogini_22: "Ulka",
  yogini_23: "Siddha",
  yogini_24: "Sankata",

  yogini_25: "Mangala",
  yogini_26: "Pingala",
  yogini_27: "Dhanya",
  yogini_28: "Bhramari",
  yogini_29: "Bhadrika",
  yogini_30: "Ulka",
  yogini_31: "Siddha",
  yogini_32: "Sankata",

  yogini_33: "Mangala",
  yogini_34: "Pingala",
  yogini_35: "Dhanya",
  yogini_36: "Bhramari",
  yogini_37: "Bhadrika",
  yogini_38: "Ulka",
  yogini_39: "Siddha",
  yogini_40: "Sankata",

  yogini_41: "Mangala",
  yogini_42: "Pingala",
  yogini_43: "Dhanya",
  yogini_44: "Bhramari",
  yogini_45: "Bhadrika",
  yogini_46: "Ulka",
  yogini_47: "Siddha",
  yogini_48: "Sankata",

  yogini_49: "Mangala",
  yogini_50: "Pingala",
  yogini_51: "Dhanya",
  yogini_52: "Bhramari",
  yogini_53: "Bhadrika",
  yogini_54: "Ulka",
  yogini_55: "Siddha",
  yogini_56: "Sankata",

  yogini_57: "Mangala",
  yogini_58: "Pingala",
  yogini_59: "Dhanya",
  yogini_60: "Bhramari",
  yogini_61: "Bhadrika",
  yogini_62: "Ulka",
  yogini_63: "Siddha",
  yogini_64: "Sankata",

  // ===== 11 RUDRA =====
  rudra_1: "Kapali",
  rudra_2: "Pingala",
  rudra_3: "Bhim",
  rudra_4: "Virupaksha",
  rudra_5: "Vilohita",
  rudra_6: "Ajapada",
  rudra_7: "Ahirbudhnya",
  rudra_8: "Shambhu",
  rudra_9: "Chand",
  rudra_10: "Bhava",
  rudra_11: "Ishana",

  // ===== 12 ADITYA =====
  aditya_1: "Dhata",
  aditya_2: "Mitra",
  aditya_3: "Aryaman",
  aditya_4: "Pushan",
  aditya_5: "Shakra",
  aditya_6: "Vivasvan",
  aditya_7: "Varuna",
  aditya_8: "Amsa",
  aditya_9: "Bhaga",
  aditya_10: "Tvashta",
  aditya_11: "Savita",
  aditya_12: "Vishnu",

  // ===== 8 VASU =====
  vasu_1: "Dhar",
  vasu_2: "Anala",
  vasu_3: "Ap",
  vasu_4: "Prithvi",
  vasu_5: "Anila",
  vasu_6: "Soma",
  vasu_7: "Aditya",
  vasu_8: "Pratyusha"

  // ===== VASTU =====
  vastu_north: "North Direction (Wealth & Growth)",
  vastu_south: "South Direction (Stability & Strength)",
  vastu_east: "East Direction (Health & Progress)",
  vastu_west: "West Direction (Gains & Satisfaction)",
  vastu_entrance: "Main Entrance Vastu",
  vastu_kitchen: "Kitchen Vastu",
  vastu_bedroom: "Bedroom Vastu",
  vastu_pooja: "Pooja Room Vastu",

  // ===== RUDRAKSHA =====
  rudraksha_1: "1 Mukhi Rudraksha (Shiva)",
  rudraksha_2: "2 Mukhi Rudraksha (Ardhanarishwar)",
  rudraksha_3: "3 Mukhi Rudraksha (Agni)",
  rudraksha_4: "4 Mukhi Rudraksha (Brahma)",
  rudraksha_5: "5 Mukhi Rudraksha (Kalagni Rudra)",
  rudraksha_6: "6 Mukhi Rudraksha (Kartikeya)",
  rudraksha_7: "7 Mukhi Rudraksha (Mahalakshmi)",
  rudraksha_8: "8 Mukhi Rudraksha (Ganesha)",
  rudraksha_9: "9 Mukhi Rudraksha (Durga)",
  rudraksha_10: "10 Mukhi Rudraksha (Vishnu)",

  // ===== GEMSTONES =====
  gem_ruby: "Ruby (Manik)",
  gem_pearl: "Pearl (Moti)",
  gem_red_coral: "Red Coral (Moonga)",
  gem_emerald: "Emerald (Panna)",
  gem_yellow_sapphire: "Yellow Sapphire (Pukhraj)",
  gem_diamond: "Diamond (Heera)",
  gem_blue_sapphire: "Blue Sapphire (Neelam)",
  gem_hessonite: "Hessonite (Gomed)",
  gem_catseye: "Cat's Eye (Lehsunia)",

  // ===== FASTING (VRAT) =====
  vrat_monday: "Monday Fast (Somvar)",
  vrat_tuesday: "Tuesday Fast (Mangalvar)",
  vrat_thursday: "Thursday Fast (Guruvar)",
  vrat_friday: "Friday Fast (Shukravar)",
  vrat_saturday: "Saturday Fast (Shanivar)",
  vrat_ekadashi: "Ekadashi Fast",
  vrat_pradosh: "Pradosh Vrat",

  // ===== SAGES (RISHI) =====
  sage_vashistha: "Vashistha",
  sage_vishwamitra: "Vishwamitra",
  sage_bharadwaj: "Bharadwaj",
  sage_atri: "Atri",
  sage_kashyapa: "Kashyapa",
  sage_gautama: "Gautama",
  sage_jamadagni: "Jamadagni",

  // ===== MARRIAGE COMPATIBILITY =====
  guna_1: "Varna",
  guna_2: "Vashya",
  guna_3: "Tara",
  guna_4: "Yoni",
  guna_5: "Graha Maitri",
  guna_6: "Gana",
  guna_7: "Bhakoot",
  guna_8: "Nadi",

  // ===== VEDAS =====
  veda_rig: "Rigveda",
  veda_yajur: "Yajurveda",
  veda_sama: "Samaveda",
  veda_atharva: "Atharvaveda",

  // ===== UPANISHADS =====
  upanishad_isha: "Isha Upanishad",
  upanishad_kena: "Kena Upanishad",
  upanishad_katha: "Katha Upanishad",
  upanishad_prashna: "Prashna Upanishad",
  upanishad_mundaka: "Mundaka Upanishad",
  upanishad_mandukya: "Mandukya Upanishad"

    },
    hi: {
        
  // ===== ग्रह =====
  planet_sun: "सूर्य देव",
  planet_moon: "चंद्र देव",
  planet_mars: "मंगल देव",
  planet_mercury: "बुध देव",
  planet_jupiter: "बृहस्पति (गुरु)",
  planet_venus: "शुक्र देव",
  planet_saturn: "शनि देव",
  planet_rahu: "राहु ग्रह",
  planet_ketu: "केतु ग्रह",

  // ===== भाव =====
  house_1: "प्रथम भाव (तनु भाव)",
  house_2: "द्वितीय भाव (धन भाव)",
  house_3: "तृतीय भाव (सहज भाव)",
  house_4: "चतुर्थ भाव (सुख भाव)",
  house_5: "पंचम भाव (सुत भाव)",
  house_6: "षष्ठ भाव (रिपु भाव)",
  house_7: "सप्तम भाव (जाया भाव)",
  house_8: "अष्टम भाव (आयु भाव)",
  house_9: "नवम भाव (भाग्य भाव)",
  house_10: "दशम भाव (कर्म भाव)",
  house_11: "एकादश भाव (आय भाव)",
  house_12: "द्वादश भाव (व्यय भाव)",

  // ===== नक्षत्र =====
  nak_ashwini: "अश्विनी",
  nak_bharani: "भरणी",
  nak_krittika: "कृत्तिका",
  nak_rohini: "रोहिणी",
  nak_mrigashira: "मृगशिरा",
  nak_ardra: "आर्द्रा",
  nak_punarvasu: "पुनर्वसु",
  nak_pushya: "पुष्य",
  nak_ashlesha: "श्लेषा",
  nak_magha: "मघा",
  nak_purva_phalguni: "पूर्वाफाल्गुनी",
  nak_uttara_phalguni: "उत्तराफाल्गुनी",
  nak_hasta: "हस्त",
  nak_chitra: "चित्रा",
  nak_swati: "स्वाति",
  nak_vishakha: "विशाखा",
  nak_anuradha: "अनुराधा",
  nak_jyeshtha: "ज्येष्ठा",
  nak_mula: "मूल",
  nak_purva_ashadha: "पूर्वाषाढ़ा",
  nak_uttara_ashadha: "उत्तराषाढ़ा",
  nak_shravana: "श्रवण",
  nak_dhanishta: "धनिष्ठा",
  nak_shatabhisha: "शतभिषा",
  nak_purva_bhadrapada: "पूर्वाभाद्रपद",
  nak_uttara_bhadrapada: "उत्तराभाद्रपद",
  nak_revati: "रेवती",

  // ===== योग व दोष =====
  yoga_gajkesari: "गजकेसरी योग",
  yoga_budhaditya: "बुधादित्य योग",
  yoga_shasha: "शश योग",
  yoga_malavya: "मालव्य योग",
  yoga_hamsa: "हंस योग",
  yoga_bhadra: "भद्र योग",
  yoga_ruchaka: "रुचक योग",
  yoga_laxmi: "लक्ष्मी योग",

  dosha_mangal: "मंगल दोष",
  dosha_kaal_sarp: "काल सर्प दोष",
  dosha_pitar: "पितृ दोष",

  // ===== अंक ज्योतिष =====
  num_1: "नंबर 1 (सूर्य)",
  num_2: "नंबर 2 (चंद्र)",
  num_3: "नंबर 3 (गुरु)",
  num_4: "नंबर 4 (राहु)",
  num_5: "नंबर 5 (बुध)",
  num_6: "नंबर 6 (शुक्र)",
  num_7: "नंबर 7 (केतु)",
  num_8: "नंबर 8 (शनि)",
  num_9: "नंबर 9 (मंगल)"

  // ===== 64 योगिनी =====
  yogini_1: "मंगला",
  yogini_2: "पिंगला",
  yogini_3: "धन्या",
  yogini_4: "भ्रामरी",
  yogini_5: "भद्रिका",
  yogini_6: "उल्का",
  yogini_7: "सिद्धा",
  yogini_8: "संकटा",

  yogini_9: "मंगला",
  yogini_10: "पिंगला",
  yogini_11: "धन्या",
  yogini_12: "भ्रामरी",
  yogini_13: "भद्रिका",
  yogini_14: "उल्का",
  yogini_15: "सिद्धा",
  yogini_16: "संकटा",

  yogini_17: "मंगला",
  yogini_18: "पिंगला",
  yogini_19: "धन्या",
  yogini_20: "भ्रामरी",
  yogini_21: "भद्रिका",
  yogini_22: "उल्का",
  yogini_23: "सिद्धा",
  yogini_24: "संकटा",

  yogini_25: "मंगला",
  yogini_26: "पिंगला",
  yogini_27: "धन्या",
  yogini_28: "भ्रामरी",
  yogini_29: "भद्रिका",
  yogini_30: "उल्का",
  yogini_31: "सिद्धा",
  yogini_32: "संकटा",

  yogini_33: "मंगला",
  yogini_34: "पिंगला",
  yogini_35: "धन्या",
  yogini_36: "भ्रामरी",
  yogini_37: "भद्रिका",
  yogini_38: "उल्का",
  yogini_39: "सिद्धा",
  yogini_40: "संकटा",

  yogini_41: "मंगला",
  yogini_42: "पिंगला",
  yogini_43: "धन्या",
  yogini_44: "भ्रामरी",
  yogini_45: "भद्रिका",
  yogini_46: "उल्का",
  yogini_47: "सिद्धा",
  yogini_48: "संकटा",

  yogini_49: "मंगला",
  yogini_50: "पिंगला",
  yogini_51: "धन्या",
  yogini_52: "भ्रामरी",
  yogini_53: "भद्रिका",
  yogini_54: "उल्का",
  yogini_55: "सिद्धा",
  yogini_56: "संकटा",

  yogini_57: "मंगला",
  yogini_58: "पिंगला",
  yogini_59: "धन्या",
  yogini_60: "भ्रामरी",
  yogini_61: "भद्रिका",
  yogini_62: "उल्का",
  yogini_63: "सिद्धा",
  yogini_64: "संकटा",

  // ===== 11 रुद्र =====
  rudra_1: "कपाली",
  rudra_2: "पिंगल",
  rudra_3: "भीम",
  rudra_4: "विरूपाक्ष",
  rudra_5: "विलोहित",
  rudra_6: "अजपाद",
  rudra_7: "अहिर्बुध्न्य",
  rudra_8: "शम्भु",
  rudra_9: "चण्ड",
  rudra_10: "भव",
  rudra_11: "ईशान",

  // ===== 12 आदित्य =====
  aditya_1: "धाता",
  aditya_2: "मित्र",
  aditya_3: "अर्यमान",
  aditya_4: "पूषा",
  aditya_5: "शक्र",
  aditya_6: "विवस्वान",
  aditya_7: "वरुण",
  aditya_8: "अंश",
  aditya_9: "भग",
  aditya_10: "त्वष्टा",
  aditya_11: "सविता",
  aditya_12: "विष्णु",

  // ===== 8 वसु =====
  vasu_1: "धर",
  vasu_2: "अनल",
  vasu_3: "आप",
  vasu_4: "पृथ्वी",
  vasu_5: "अनिल",
  vasu_6: "सोम",
  vasu_7: "आदित्य",
  vasu_8: "प्रत्यूष"

  // ===== वास्तु =====
  vastu_north: "उत्तर दिशा (धन व उन्नति)",
  vastu_south: "दक्षिण दिशा (स्थिरता व शक्ति)",
  vastu_east: "पूर्व दिशा (स्वास्थ्य व प्रगति)",
  vastu_west: "पश्चिम दिशा (लाभ व संतोष)",
  vastu_entrance: "मुख्य द्वार वास्तु",
  vastu_kitchen: "रसोईघर वास्तु",
  vastu_bedroom: "शयन कक्ष वास्तु",
  vastu_pooja: "पूजा कक्ष वास्तु",

  // ===== रुद्राक्ष =====
  rudraksha_1: "एक मुखी रुद्राक्ष (शिव)",
  rudraksha_2: "दो मुखी रुद्राक्ष (अर्धनारीश्वर)",
  rudraksha_3: "तीन मुखी रुद्राक्ष (अग्नि)",
  rudraksha_4: "चार मुखी रुद्राक्ष (ब्रह्मा)",
  rudraksha_5: "पांच मुखी रुद्राक्ष (कालाग्नि रुद्र)",
  rudraksha_6: "छह मुखी रुद्राक्ष (कार्तिकेय)",
  rudraksha_7: "सात मुखी रुद्राक्ष (महालक्ष्मी)",
  rudraksha_8: "आठ मुखी रुद्राक्ष (गणेश)",
  rudraksha_9: "नौ मुखी रुद्राक्ष (दुर्गा)",
  rudraksha_10: "दस मुखी रुद्राक्ष (विष्णु)",

  // ===== रत्न =====
  gem_ruby: "माणिक",
  gem_pearl: "मोती",
  gem_red_coral: "मूंगा",
  gem_emerald: "पन्ना",
  gem_yellow_sapphire: "पुखराज",
  gem_diamond: "हीरा",
  gem_blue_sapphire: "नीलम",
  gem_hessonite: "गोमेद",
  gem_catseye: "लहसुनिया",

  // ===== व्रत =====
  vrat_monday: "सोमवार व्रत",
  vrat_tuesday: "मंगलवार व्रत",
  vrat_thursday: "गुरुवार व्रत",
  vrat_friday: "शुक्रवार व्रत",
  vrat_saturday: "शनिवार व्रत",
  vrat_ekadashi: "एकादशी व्रत",
  vrat_pradosh: "प्रदोष व्रत",

  // ===== ऋषि =====
  sage_vashistha: "वशिष्ठ",
  sage_vishwamitra: "विश्वामित्र",
  sage_bharadwaj: "भरद्वाज",
  sage_atri: "अत्रि",
  sage_kashyapa: "कश्यप",
  sage_gautama: "गौतम",
  sage_jamadagni: "जमदग्नि",

  // ===== विवाह गुण मिलान =====
  guna_1: "वर्ण",
  guna_2: "वश्य",
  guna_3: "तारा",
  guna_4: "योनि",
  guna_5: "ग्रह मैत्री",
  guna_6: "गण",
  guna_7: "भकूट",
  guna_8: "नाड़ी",

  // ===== वेद =====
  veda_rig: "ऋग्वेद",
  veda_yajur: "यजुर्वेद",
  veda_sama: "सामवेद",
  veda_atharva: "अथर्ववेद",

  // ===== उपनिषद =====
  upanishad_isha: "ईश उपनिषद",
  upanishad_kena: "केन उपनिषद",
  upanishad_katha: "कठ उपनिषद",
  upanishad_prashna: "प्रश्न उपनिषद",
  upanishad_mundaka: "मुण्डक उपनिषद",
  upanishad_mandukya: "माण्डूक्य उपनिषद"
    }
};

// --- Updated Logic for Header/Footer Connection ---
let currentLang = localStorage.getItem('site_lang') || 'en';

// Humne 'window.' lagaya hai taaki Header ise dhoond sake
window.updateUI = function() {
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
                elem.placeholder = translations[currentLang][key];
            } else {
                // innerHTML use kar rahe hain taaki agar koi symbol ho toh dikhe
                elem.innerHTML = translations[currentLang][key];
            }
        }
    });

    const langBtnText = document.getElementById('lang-text');
    if (langBtnText) {
        langBtnText.innerText = currentLang === 'en' ? 'हिंदी' : 'English';
    }
    document.documentElement.lang = currentLang;
};

window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('site_lang', currentLang);
    window.updateUI();
};

// Initial Load
document.addEventListener('DOMContentLoaded', window.updateUI);
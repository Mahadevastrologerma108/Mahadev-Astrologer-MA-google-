import os

# Sabhi 12 Rashi ki list
rashis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
          "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

# 🔱 100% Unique SEO & Vedic Data (AdSense Approval Booster)
rashi_details = {
    "aries": {"lord": "मंगल देव (Mars)", "element": "अग्नि (Fire)", "mantra": "रां (Ram)", "gem": "लाल मूंगा (Red Coral)", "rudraksha": "3 मुखी", 
              "nature": "मेष राशि वाले जातक जन्म से ही निडर, ऊर्जावान और बेहतरीन नेतृत्व क्षमता वाले होते हैं। ये चुनौतियों का सामना डटकर करते हैं।", 
              "shiv": "मंगल ग्रह की उत्पत्ति भगवान शिव के अंश से हुई है। इसलिए मेष राशि के जातकों पर महादेव की विशेष कृपा होती है।"},
    "taurus": {"lord": "शुक्र देव (Venus)", "element": "पृथ्वी (Earth)", "mantra": "ईं (Eem)", "gem": "ओपल या हीरा (Opal)", "rudraksha": "6 मुखी", 
               "nature": "वृषभ राशि के जातक शांत, धैर्यवान और कला प्रेमी होते हैं। इन्हें स्थिरता और विलासिता पसंद होती है।", 
               "shiv": "शुक्राचार्य भगवान शिव के परम भक्त थे। वृषभ राशि वालों को शिवलिंग पर सफेद चंदन लगाने से अपार सफलता मिलती है।"},
    "gemini": {"lord": "बुध देव (Mercury)", "element": "वायु (Air)", "mantra": "ऐं (Aim)", "gem": "पन्ना (Emerald)", "rudraksha": "4 मुखी", 
               "nature": "मिथुन राशि वाले अत्यधिक बुद्धिमान, बातूनी और बहुमुखी प्रतिभा के धनवान होते हैं। ये तेज़ी से नई चीज़ें सीखते हैं।", 
               "shiv": "बुध को शिव जी का आशीर्वाद प्राप्त है। इन जातकों को शिव आराधना से मानसिक एकाग्रता और व्यापार में वृद्धि मिलती है।"},
    "cancer": {"lord": "चंद्र देव (Moon)", "element": "जल (Water)", "mantra": "श्रीं (Shreem)", "gem": "मोती (Pearl)", "rudraksha": "2 मुखी", 
               "nature": "कर्क राशि के लोग बहुत भावुक, परिवार को चाहने वाले और दूसरों की परवाह करने वाले होते हैं।", 
               "shiv": "चन्द्रमा स्वयं महादेव के मस्तक पर विराजमान हैं। कर्क राशि वालों के लिए सोमवारी पूजा और शिव स्तुति सबसे फलदायी है।"},
    "leo": {"lord": "सूर्य देव (Sun)", "element": "अग्नि (Fire)", "mantra": "ह्रीं (Hreem)", "gem": "माणिक्य (Ruby)", "rudraksha": "12 मुखी", 
               "nature": "सिंह राशि के जातक राजा के समान आत्मविश्वासी, निडर और आकर्षक व्यक्तित्व वाले होते हैं।", 
               "shiv": "सूर्य देव शिव के नेत्र माने जाते हैं। महामृत्युंजय मंत्र का जाप सिंह राशि वालों के यश और कीर्ति को अनंत कर देता है।"},
    "virgo": {"lord": "बुध देव (Mercury)", "element": "पृथ्वी (Earth)", "mantra": "ऐं (Aim)", "gem": "पन्ना (Emerald)", "rudraksha": "4 मुखी", 
               "nature": "कन्या राशि वाले बहुत ही परफेक्शनिस्ट, व्यावहारिक और विश्लेषणात्मक (Analytical) होते हैं।", 
               "shiv": "गणेश जी और शिव जी की संयुक्त आराधना कन्या राशि वालों की बुद्धि और करियर को नई ऊंचाइयों पर ले जाती है।"},
    "libra": {"lord": "शुक्र देव (Venus)", "element": "वायु (Air)", "mantra": "ईं (Eem)", "gem": "सफेद पुखराज (White Sapphire)", "rudraksha": "6 मुखी", 
               "nature": "तुला राशि के लोग न्यायप्रिय, कूटनीतिक और संतुलन बनाकर चलने वाले होते हैं।", 
               "shiv": "तुला राशि वालों को शिव-पार्वती (अर्धनारीश्वर स्वरूप) की पूजा से वैवाहिक जीवन और साझेदारी में अपार सुख मिलता है।"},
    "scorpio": {"lord": "मंगल देव (Mars)", "element": "जल (Water)", "mantra": "रां (Ram)", "gem": "लाल मूंगा (Red Coral)", "rudraksha": "3 मुखी", 
               "nature": "वृश्चिक राशि वाले अत्यंत रहस्यमयी, जुनूनी और गहरी सोच वाले होते हैं। ये जो ठान लें, वो करते हैं।", 
               "shiv": "महादेव के भैरव और रुद्रावतार की पूजा वृश्चिक राशि वालों के गुप्त शत्रुओं का नाश करती है और साहस बढ़ाती है।"},
    "sagittarius": {"lord": "बृहस्पति देव (Jupiter)", "element": "अग्नि (Fire)", "mantra": "ह्रीं (Hreem)", "gem": "पीला पुखराज (Yellow Sapphire)", "rudraksha": "5 मुखी", 
               "nature": "धनु राशि के लोग आशावादी, दार्शनिक और ज्ञान की खोज करने वाले होते हैं। इन्हें स्वतंत्रता पसंद है।", 
               "shiv": "गुरु बृहस्पति शिव के आराधक हैं। धनु राशि वालों द्वारा शिवलिंग पर पीले पुष्प अर्पित करने से भाग्य उदय होता है।"},
    "capricorn": {"lord": "शनि देव (Saturn)", "element": "पृथ्वी (Earth)", "mantra": "शं (Sham)", "gem": "नीलम (Blue Sapphire)", "rudraksha": "7 मुखी", 
               "nature": "मकर राशि वाले बहुत ही अनुशासित, मेहनती और अपने लक्ष्यों के प्रति गंभीर होते हैं।", 
               "shiv": "शनिदेव महादेव के परम शिष्य हैं। शिव चालीसा का पाठ मकर राशि वालों को करियर की हर ऊंचाई तक ले जाता है।"},
    "aquarius": {"lord": "शनि देव (Saturn)", "element": "वायु (Air)", "mantra": "शं (Sham)", "gem": "नीलम (Blue Sapphire)", "rudraksha": "7 मुखी", 
               "nature": "कुंभ राशि वाले प्रगतिशील, समाज सेवक और लीक से हटकर सोचने वाले (Innovative) होते हैं।", 
               "shiv": "महाशिवरात्रि का व्रत और शिव आराधना कुंभ राशि के जातकों को मानसिक शांति और समाज में प्रतिष्ठा दिलाती है।"},
    "pisces": {"lord": "बृहस्पति देव (Jupiter)", "element": "जल (Water)", "mantra": "ह्रीं (Hreem)", "gem": "पीला पुखराज (Yellow Sapphire)", "rudraksha": "5 मुखी", 
               "nature": "मीन राशि के लोग अत्यंत दयालु, कल्पनाशील और आध्यात्मिक स्वभाव के होते हैं।", 
               "shiv": "मीन राशि वालों का मन महादेव की भक्ति में जल्दी लगता है। रुद्राष्टकम का पाठ इनके जीवन में चमत्कारिक बदलाव लाता है।"}
}

adsense_snippet = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3541428040051953" crossorigin="anonymous"></script>'
base_url = "https://www.mahadevastrologerma.in/horoscope/"

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{title} राशि का आज का राशिफल। महादेव एस्ट्रोलॉजर MA पर जानें आज का करियर, प्रेम, स्वास्थ्य और अचूक वैदिक उपाय।">
    <link rel="canonical" href="{canonical_url}">
    {adsense_code}
    <title>{title} | Daily Horoscope 2026 | MAHADEV ASTROLOGER MA</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        .horo-card {{ max-width: 800px; margin: 120px auto 50px; padding: 30px; background: rgba(245,197,66,0.05); border: 1px solid #f5c542; border-radius: 20px; text-align: center; }}
        .rashi-title {{ font-family: 'Cinzel'; color: #f5c542; font-size: 2.5rem; margin-bottom: 5px; }}
        .date-line {{ color: #888; margin-bottom: 30px; font-size: 0.9rem; }}
        .grid-container {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; text-align: left; margin-top: 20px; }}
        .info-box {{ background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border-left: 3px solid #f5c542; }}
        .info-box h3 {{ color: #f5c542; font-size: 1.1rem; margin-bottom: 8px; font-family: 'Cinzel'; }}
        .info-box p {{ font-size: 0.95rem; line-height: 1.6; color: #ddd; margin: 0; }}
        .lucky-strip {{ margin-top: 30px; display: flex; justify-content: space-around; background: rgba(245,197,66,0.1); padding: 15px; border-radius: 10px; color: #f5c542; font-weight: 600; border: 1px dashed rgba(245,197,66,0.3); }}
        .wisdom-box {{ margin-top: 40px; text-align: left; border-top: 1px solid rgba(245,197,66,0.1); padding-top: 20px; }}
        .resonance-card {{ background: rgba(245,197,66,0.05); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid rgba(245,197,66,0.2); }}
        @media (max-width: 600px) {{ .grid-container {{ grid-template-columns: 1fr; }} .lucky-strip {{ flex-direction: column; gap: 10px; }} }}
    </style>
</head>
<body class="panchang-body">
    <div id="header-placeholder"></div>
    <div class="horo-card">
        <h1 id="rashi-title" class="rashi-title">Loading...</h1>
        <p id="todayDate" class="date-line"></p>
        
        <div class="grid-container">
            <div class="info-box"><h3 data-key="horo_career">Career</h3><p id="h-career">Fetching...</p></div>
            <div class="info-box"><h3 data-key="horo_love">Love</h3><p id="h-love">Fetching...</p></div>
            <div class="info-box"><h3 data-key="horo_health">Health</h3><p id="h-health">Fetching...</p></div>
            <div class="info-box"><h3 data-key="horo_remedy">Vedic Remedy</h3><p id="h-remedy">Fetching...</p></div>
            <div class="info-box" style="grid-column: 1 / -1; border-left-color: #00ff88;">
                <h3 data-key="expert_note">Expert Note</h3><p id="h-expert">Fetching...</p>
            </div>
        </div>
        
        <div class="lucky-strip">
            <span>Color: <b id="h-color">-</b></span>
            <span>Number: <b id="h-number">-</b></span>
            <span>Time: <b id="h-time">-</b></span>
        </div>

        <div class="wisdom-box">
            <h3 class="gold-text" data-key="about_rashi_title">{title} राशि - स्वभाव और वैदिक महत्व</h3>
            <p style="font-size: 0.95rem; color: #ddd; line-height: 1.8; margin-bottom: 15px;">
                वैदिक ज्योतिष के अनुसार, इस राशि का तत्व <b>{element}</b> है और इसके स्वामी <b>{lord}</b> हैं। {nature}
            </p>
            
            <p style="font-size: 0.95rem; color: #ddd; line-height: 1.8; margin-bottom: 15px;">
                <b>महादेव के साथ संबंध (Spiritual Connection):</b> {shiv}
            </p>

            <div class="resonance-card">
                <h4 class="gold-text" data-key="naad_brahma_title">नाद ब्रह्म (Naad Brahma) और वैदिक उपाय</h4>
                <ul style="font-size: 0.9rem; color: #ccc; line-height: 1.8; padding-left: 20px; margin-top: 10px;">
                    <li><b>शुभ रुद्राक्ष:</b> ब्रह्मांडीय ऊर्जा को संतुलित करने के लिए <b>{rudraksha} रुद्राक्ष</b> धारण करना सर्वोत्तम माना गया है।</li>
                    <li><b>शुभ रत्न:</b> वैदिक ज्योतिष में इस राशि के लिए <b>{gem}</b> धारण करना अत्यंत भाग्यशाली होता है।</li>
                    <li><b>बीज मंत्र:</b> अपनी ऊर्जा को अलाइन करने के लिए प्रतिदिन <b>"{mantra}"</b> बीज मंत्र का जाप करें।</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="/index.html#services" style="padding: 10px 20px; background: rgba(245,197,66,0.1); border: 1px solid #f5c542; color: #f5c542; text-decoration: none; border-radius: 5px; font-family: 'Poppins'; font-size: 0.9rem; transition: 0.3s; display: inline-block;">अपनी जन्म कुंडली का पूर्ण विश्लेषण करवाएं</a>
            </div>
        </div>
    </div>
    <div id="footer-placeholder"></div>

    <script src="/horoscope/horoscope-data.js"></script>
    <script src="/assets/js/horoscope-handler.js"></script>
    <script type="module" src="/assets/js/firebase-handler.js"></script>    
    <script src="/assets/js/translations.js"></script>
    <script src="/assets/js/layout.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            if (typeof loadHoroscope === 'function') {{
                loadHoroscope('{rashi_key}');
            }} else {{
                console.error("🔱 Handler machine nahi mili!");
            }}
        }});
    </script>
</body>
</html>"""

target_dir = 'horoscope'
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

for r in rashis:
    file_path = os.path.join(target_dir, r + ".html")
    current_canonical = f"{base_url}{r}.html"
    details = rashi_details[r]

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(
            title=r.capitalize(), 
            rashi_key=r,
            canonical_url=current_canonical,
            adsense_code=adsense_snippet,
            lord=details['lord'],
            element=details['element'],
            mantra=details['mantra'],
            gem=details['gem'],
            rudraksha=details['rudraksha'],
            nature=details['nature'],
            shiv=details['shiv']
        ))

print("🔱 12 Sunday-Optimized Pages Generated Successfully!")

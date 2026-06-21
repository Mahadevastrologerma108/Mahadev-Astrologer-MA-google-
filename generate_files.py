import os

# All 12 Zodiac signs
rashis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
          "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

# 🔱 100% Unique SEO & Vedic Data (Translated to English for AdSense Bot Compliance)
rashi_details = {
    "aries": {"lord": "Mars (Mangal Dev)", "element": "Fire", "mantra": "Ram", "gem": "Red Coral", "rudraksha": "3 Mukhi", 
              "nature": "Aries natives are born fearless, energetic, and possess excellent leadership qualities. They face challenges head-on with courage.", 
              "shiv": "The planet Mars originated from the divine form of Lord Shiva. Hence, Aries natives are always blessed with Mahadev's special grace."},
    "taurus": {"lord": "Venus (Shukra Dev)", "element": "Earth", "mantra": "Eem", "gem": "Opal or Diamond", "rudraksha": "6 Mukhi", 
               "nature": "Taurus individuals are calm, patient, and lovers of art. They seek stability, loyalty, and a touch of luxury in life.", 
               "shiv": "Shukracharya was a supreme devotee of Lord Shiva. Applying white sandalwood to the Shivling brings immense success to Taurus natives."},
    "gemini": {"lord": "Mercury (Budh Dev)", "element": "Air", "mantra": "Aim", "gem": "Emerald", "rudraksha": "4 Mukhi", 
               "nature": "Gemini natives are highly intelligent, communicative, and multi-talented. They possess a rapid learning ability.", 
               "shiv": "Mercury is blessed by Lord Shiva. Worshipping Shiva grants mental concentration and business growth to these natives."},
    "cancer": {"lord": "Moon (Chandra Dev)", "element": "Water", "mantra": "Shreem", "gem": "Pearl", "rudraksha": "2 Mukhi", 
               "nature": "Cancer individuals are deeply emotional, family-oriented, and profoundly caring towards others.", 
               "shiv": "The Moon itself adorns the forehead of Mahadev. Somvar (Monday) worship and Shiva Stuti are most fruitful for Cancer natives."},
    "leo": {"lord": "Sun (Surya Dev)", "element": "Fire", "mantra": "Hreem", "gem": "Ruby", "rudraksha": "12 Mukhi", 
               "nature": "Leo natives are confident like a king, fearless, and possess a highly charismatic personality.", 
               "shiv": "The Sun God is considered the eye of Shiva. Chanting the Mahamrityunjaya Mantra brings infinite fame and glory to Leo individuals."},
    "virgo": {"lord": "Mercury (Budh Dev)", "element": "Earth", "mantra": "Aim", "gem": "Emerald", "rudraksha": "4 Mukhi", 
               "nature": "Virgo natives are absolute perfectionists, highly practical, and deeply analytical in their approach.", 
               "shiv": "The combined worship of Lord Ganesha and Shiva takes the intellect and career of Virgo natives to new heights."},
    "libra": {"lord": "Venus (Shukra Dev)", "element": "Air", "mantra": "Eem", "gem": "White Sapphire", "rudraksha": "6 Mukhi", 
               "nature": "Libra individuals are fair, diplomatic, and always strive to maintain balance in every aspect of life.", 
               "shiv": "Worshipping Shiva-Parvati in their Ardhanarishvara form brings immense happiness in marriage and partnerships for Libra natives."},
    "scorpio": {"lord": "Mars (Mangal Dev)", "element": "Water", "mantra": "Ram", "gem": "Red Coral", "rudraksha": "3 Mukhi", 
               "nature": "Scorpio natives are intensely mysterious, passionate, and deep thinkers. They achieve whatever they set their minds to.", 
               "shiv": "Worshipping Bhairav and the Rudra avatar of Mahadev destroys the hidden enemies of Scorpio natives and boosts their courage."},
    "sagittarius": {"lord": "Jupiter (Brihaspati Dev)", "element": "Fire", "mantra": "Hreem", "gem": "Yellow Sapphire", "rudraksha": "5 Mukhi", 
               "nature": "Sagittarius individuals are optimistic, philosophical, and seekers of ultimate knowledge. They value their freedom immensely.", 
               "shiv": "Guru Brihaspati is an ardent worshipper of Shiva. Offering yellow flowers on a Shivling awakens the fortune of Sagittarius natives."},
    "capricorn": {"lord": "Saturn (Shani Dev)", "element": "Earth", "mantra": "Sham", "gem": "Blue Sapphire", "rudraksha": "7 Mukhi", 
               "nature": "Capricorn natives are highly disciplined, hardworking, and extremely serious about their life goals.", 
               "shiv": "Shani Dev is the supreme disciple of Mahadev. Reciting the Shiva Chalisa elevates Capricorn natives to the pinnacle of their careers."},
    "aquarius": {"lord": "Saturn (Shani Dev)", "element": "Air", "mantra": "Sham", "gem": "Blue Sapphire", "rudraksha": "7 Mukhi", 
               "nature": "Aquarius individuals are progressive, humanitarian, and always think out of the box with innovative ideas.", 
               "shiv": "Observing the Mahashivratri fast and worshipping Shiva brings mental peace and immense social prestige to Aquarius natives."},
    "pisces": {"lord": "Jupiter (Brihaspati Dev)", "element": "Water", "mantra": "Hreem", "gem": "Yellow Sapphire", "rudraksha": "5 Mukhi", 
               "nature": "Pisces individuals are extremely compassionate, imaginative, and possess a deeply spiritual nature.", 
               "shiv": "The mind of Pisces natives naturally aligns with Mahadev's devotion. Reciting the Rudrashtakam brings miraculous positive changes to their lives."}
}

adsense_snippet = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3541428040051953" crossorigin="anonymous"></script>'
base_url = "https://www.mahadevastrologerma.in/horoscope/"

target_dir = 'horoscope'
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

# Generator loop
for r in rashis:
    file_path = os.path.join(target_dir, r + ".html")
    current_canonical = f"{base_url}{r}"
    details = rashi_details[r]
    
    page_title = r.capitalize()
    rashi_key = r
    lord = details['lord']
    element = details['element']
    nature = details['nature']
    shiv = details['shiv']
    rudraksha = details['rudraksha']
    gem = details['gem']
    mantra = details['mantra']

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Daily horoscope for {page_title} zodiac sign. Discover today's career, love, health predictions, and infallible Vedic remedies on Mahadev Astrologer MA.">
    
    <link rel="canonical" href="{current_canonical}">
    {adsense_snippet}
    
    <title>{page_title} | Daily Horoscope 2026 | MAHADEV ASTROLOGER MA</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    
    <script src="/assets/js/translations.js"></script>
    <script src="/horoscope/horoscope-trans.js"></script> 
    <script src="/assets/js/layout.js"></script>
    
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        .horo-card {{ max-width: 800px; margin: 120px auto 50px; padding: 30px; background: rgba(245,197,66,0.05); border: 1px solid #f5c542; border-radius: 20px; text-align: center; }}
        .rashi-title {{ font-family: 'Cinzel'; color: #f5c542; font-size: 2.5rem; margin-bottom: 5px; }}
        .date-line {{ color: #888; margin-bottom: 10px; font-size: 0.9rem; }}
        .tagline-text {{ color: #fff; font-family: 'Cinzel'; font-size: 1.2rem; margin-bottom: 10px; font-weight: bold; text-shadow: 1px 1px 5px rgba(245,197,66,0.5); }}
        .power-badge {{ display: inline-block; background: rgba(245,197,66,0.15); border: 1px solid rgba(245,197,66,0.5); padding: 5px 15px; border-radius: 20px; color: #f5c542; font-size: 0.85rem; margin-bottom: 25px; font-family: 'Poppins'; }}
        .grid-container {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; text-align: left; margin-top: 20px; }}
        .info-box {{ background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border-left: 3px solid #f5c542; position: relative; }}
        .info-box h3 {{ color: #f5c542; font-size: 1.1rem; margin-bottom: 8px; font-family: 'Cinzel'; display: flex; justify-content: space-between; align-items: center; }}
        .star-rating {{ font-size: 0.85rem; letter-spacing: 2px; }}
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
        
        <div id="h-tagline" class="tagline-text"></div>
        <div class="power-badge">Prediction Power: <b id="h-power">--</b></div>
        
        <div class="grid-container">
            <div class="info-box">
                <h3 data-key="horo_career">Career <span id="rating-career" class="star-rating"></span></h3>
                <p id="h-career">Fetching data...</p>
            </div>
            <div class="info-box">
                <h3 data-key="horo_love">Love <span id="rating-love" class="star-rating"></span></h3>
                <p id="h-love">Fetching data...</p>
            </div>
            <div class="info-box">
                <h3 data-key="horo_health">Health <span id="rating-health" class="star-rating"></span></h3>
                <p id="h-health">Fetching data...</p>
            </div>
            <div class="info-box">
                <h3 data-key="horo_remedy">Vedic Remedy</h3>
                <p id="h-remedy">Fetching data...</p>
            </div>
            <div class="info-box" style="grid-column: 1 / -1; border-left-color: #00ff88;">
                <h3 data-key="expert_note">Expert Note</h3><p id="h-expert">Fetching data...</p>
            </div>
        </div>
        
        <div class="lucky-strip">
            <span>Color: <b id="h-color">-</b></span>
            <span>Number: <b id="h-number">-</b></span>
            <span>Time: <b id="h-time">-</b></span>
        </div>

        <div class="wisdom-box">
            <h3 class="gold-text" data-key="about_rashi_title">{page_title} Zodiac - Nature & Vedic Significance</h3>
            <p style="font-size: 0.95rem; color: #ddd; line-height: 1.8; margin-bottom: 15px;">
                According to Vedic astrology, the element of this zodiac is <b>{element}</b> and its ruling lord is <b>{lord}</b>. {nature}
            </p>
            
            <p style="font-size: 0.95rem; color: #ddd; line-height: 1.8; margin-bottom: 15px;">
                <b>Spiritual Connection with Mahadev:</b> {shiv}
            </p>

            <div class="resonance-card">
                <h4 class="gold-text" data-key="naad_brahma_title">Naad Brahma & Vedic Remedies</h4>
                <ul style="font-size: 0.9rem; color: #ccc; line-height: 1.8; padding-left: 20px; margin-top: 10px;">
                    <li><b>Auspicious Rudraksha:</b> To balance cosmic energies, wearing a <b>{rudraksha}</b> is considered highly beneficial.</li>
                    <li><b>Auspicious Gemstone:</b> In Vedic astrology, wearing <b>{gem}</b> is extremely lucky for this zodiac sign.</li>
                    <li><b>Beej Mantra:</b> Chant the <b>"{mantra}"</b> Beej Mantra daily to align your spiritual aura.</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="/index.html#services" style="padding: 10px 20px; background: rgba(245,197,66,0.1); border: 1px solid #f5c542; color: #f5c542; text-decoration: none; border-radius: 5px; font-family: 'Poppins'; font-size: 0.9rem; transition: 0.3s; display: inline-block;" data-key="consult_btn">Get a complete analysis of your birth chart</a>
            </div>
        </div>
    </div>
    <div id="footer-placeholder"></div>

    <script src="/horoscope/horoscope-data.js"></script>
    <script src="/assets/js/horoscope-handler.js"></script>
    <script type="module" src="/assets/js/firebase-handler.js"></script>    
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            if (typeof loadHoroscope === 'function') {{
                loadHoroscope('{rashi_key}');
            }} else {{
                console.error("🔱 Handler machine not found!");
            }}
        }});
    </script>
</body>
</html>"""

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

print("🔱 12 PRO AdSense-Optimized English Pages Generated Successfully!")

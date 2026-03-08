import os

rashis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
          "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

# 🔱 Static Data for each Rashi (ये Keys translations.js में होनी चाहिए)
rashi_details = {
    "aries": {"lord": "Mars (Mangal)", "element": "Fire", "mantra": "Ram"},
    "taurus": {"lord": "Venus (Shukra)", "element": "Earth", "mantra": "Eem"},
    "gemini": {"lord": "Mercury (Budh)", "element": "Air", "mantra": "Aim"},
    "cancer": {"lord": "Moon (Chandra)", "element": "Water", "mantra": "Shreem"},
    "leo": {"lord": "Sun (Surya)", "element": "Fire", "mantra": "Hreem"},
    "virgo": {"lord": "Mercury (Budh)", "element": "Earth", "mantra": "Aim"},
    "libra": {"lord": "Venus (Shukra)", "element": "Air", "mantra": "Eem"},
    "scorpio": {"lord": "Mars (Mangal)", "element": "Water", "mantra": "Ram"},
    "sagittarius": {"lord": "Jupiter (Guru)", "element": "Fire", "mantra": "Hreem"},
    "capricorn": {"lord": "Saturn (Shani)", "element": "Earth", "mantra": "Sham"},
    "aquarius": {"lord": "Saturn (Shani)", "element": "Air", "mantra": "Sham"},
    "pisces": {"lord": "Jupiter (Guru)", "element": "Water", "mantra": "Hreem"},
}

adsense_snippet = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3541428040051953" crossorigin="anonymous"></script>'
base_url = "https://www.mahadevastrologerma.in/horoscope/"

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            <div class="info-box"><h3 data-key="tip_title">Divine Tip</h3><p id="h-tip">Fetching...</p></div>
        </div>
        <div class="lucky-strip">
            <span>Color: <b id="h-color">-</b></span>
            <span>Number: <b id="h-number">-</b></span>
            <span>Time: <b id="h-time">-</b></span>
        </div>

        <div class="wisdom-box">
            <h3 class="gold-text" data-key="about_rashi_title">About This Rashi</h3>
            <p style="font-size: 0.9rem; color: #aaa; line-height: 1.6;" data-key="{rashi_key}_desc">
                {title} is ruled by <b>{lord}</b>. As a <b>{element}</b> element sign, it carries unique cosmic vibrations.
            </p>
            <div class="resonance-card">
                <h4 class="gold-text" data-key="naad_brahma_title">Naad Brahma Resonance</h4>
                <p style="font-size: 0.85rem; color: #ccc; margin: 0;" data-key="{rashi_key}_resonance">
                    Align your energy by chanting the Beej Mantra <b>"{mantra}"</b> for {title}.
                </p>
            </div>
        </div>
    </div>
    <div id="footer-placeholder"></div>

    <script src="/horoscope/horoscope-data.js"></script>
    <script src="/assets/js/horoscope-handler.js"></script>
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
            mantra=details['mantra']
        ))

print("🔱 12 Pages Updated with Bilingual Data-Keys!")

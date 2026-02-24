import os

# 1. Aapki 12 rashiyon ki list
rashis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
          "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

# 2. HTML Template (Aapki styling ke saath)
template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Daily Horoscope 2026</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        .horo-card {{ max-width: 800px; margin: 120px auto 50px; padding: 30px; background: rgba(245,197,66,0.05); border: 1px solid #f5c542; border-radius: 20px; text-align: center; }}
        .rashi-title {{ font-family: 'Cinzel'; color: #f5c542; font-size: 2.5rem; }}
        .grid-container {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; text-align: left; margin-top: 20px; }}
        .info-box {{ background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border-left: 3px solid #f5c542; }}
        .lucky-strip {{ margin-top: 30px; display: flex; justify-content: space-around; background: rgba(245,197,66,0.1); padding: 15px; border-radius: 10px; color: #f5c542; }}
    </style>
</head>
<body class="panchang-body">
    <div id="header-placeholder"></div>
    <div class="horo-card">
        <h1 id="rashi-title">...</h1>
        <p id="todayDate"></p>
        <div class="grid-container">
            <div class="info-box"><h3 data-key="horo_career">Career</h3><p id="h-career">...</p></div>
            <div class="info-box"><h3 data-key="horo_love">Love</h3><p id="h-love">...</p></div>
            <div class="info-box"><h3 data-key="horo_health">Health</h3><p id="h-health">...</p></div>
            <div class="info-box"><h3 data-key="tip_title">Tip</h3><p id="h-tip">...</p></div>
        </div>
        <div class="lucky-strip">
            <span>Color: <b id="h-color">...</b></span>
            <span>Number: <b id="h-number">...</b></span>
            <span>Time: <b id="h-time">...</b></span>
        </div>
    </div>
    <div id="footer-placeholder"></div>
    <script src="/assets/js/translations.js"></script>
    <script src="/assets/js/layout.js"></script>
    <script src="horoscope-data.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {{
            if (typeof loadHoroscope === 'function') {{ loadHoroscope('{rashi_key}'); }}
        }});
    </script>
</body>
</html>"""

# 🔱 YE RAHI WO LINE: Agar folder hai toh naya nahi banayega, usi ko use karega
target_dir = 'horoscope'
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

# 3. Files generate karna
for r in rashis:
    file_path = os.path.join(target_dir, f"{{r}}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(title=r.capitalize(), rashi_key=r))

print(f"🔱 Done! 12 files created/updated in '{{target_dir}}' folder.")

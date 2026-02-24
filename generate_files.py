import os

rashis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", 
          "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]

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
    </style>
</head>
<body class="panchang-body">
    <div id="header-placeholder"></div>
    <div class="horo-card">
        <h1 id="rashi-title">Loading...</h1>
        <div id="h-career"></div><div id="h-love"></div>
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

target_dir = 'horoscope'
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

for r in rashis:
    # Fix: Yahan double curly brace hata diye hain
    file_path = os.path.join(target_dir, r + ".html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(title=r.capitalize(), rashi_key=r))

print("🔱 12 Files created successfully!")

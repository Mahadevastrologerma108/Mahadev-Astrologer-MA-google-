function loadPanchangData(dateObj) {
    const dStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    
    // Safety check for DB
    const db = window.PANCHANG_DATA_2026_02 || {};
    const events = window.YEARLY_EVENTS_2026 || {};
    const t = window.translations ? window.translations[lang] : {};

    const data = db[dStr];
    const event = events[dStr];

    // 1. Ribbon & Descriptions (Safe Update)
    const ribbon = document.getElementById('ribbon-text');
    const eventDesc = document.getElementById('event-display-area');
    
    if (event) {
        ribbon.innerText = event[lang] || event.hi || "Festival Today";
        if(eventDesc) {
            eventDesc.innerHTML = `<div class="p-card" style="width:100%; text-align:left; border-left:3px solid var(--gold); padding:15px;">
                <h3 style="color:var(--gold); font-family:'Cinzel';">${event[lang] || event.hi}</h3>
                <p style="font-size:14px; margin-top:10px; color:#ddd;">${event['desc_'+lang] || ''}</p>
            </div>`;
        }
    } else {
        ribbon.innerText = t['pan_ribbon_loading'] || "Shubh Din";
        if(eventDesc) eventDesc.innerHTML = `<p style="color:#666; text-align:center; padding:10px;">No specific festival today.</p>`;
    }

    // 2. Main Grid (The "Undefined" Killer Logic)
    if (data) {
        const getSafe = (val) => {
            if (!val) return "---";
            return t[val] || val; 
        };

        // Hum check kar rahe hain ki aapke DB mein key ka naam kya hai
        document.getElementById('pan-tithi').innerText = getSafe(data.tithi);
        document.getElementById('pan-nak').innerText = getSafe(data.nakshatra || data.nak);
        document.getElementById('pan-paksha').innerText = getSafe(data.paksha);
        
        // YOGA & KARANA FIX: Check both spellings
        document.getElementById('pan-yoga').innerText = getSafe(data.yoga || data.Yoga);
        document.getElementById('pan-karana').innerText = getSafe(data.karana || data.karan || data.Karana);
        
        document.getElementById('pan-sun').innerText = `${data.sunrise || '--'} / ${data.sunset || '--'}`;
        document.getElementById('pan-moon').innerText = data.moonrise || "--:--";
        document.getElementById('pan-muh').innerText = data.muhurat || data.abhijit || "--:--";
        document.getElementById('pan-rahu').innerText = data.rahu_kaal || data.rahu || "--:--";

        // 3. Chaughadia (Table Fix)
        if (data.chaughadia) {
            fillChaug(data.chaughadia.day, 'day-chaug-body');
            fillChaug(data.chaughadia.night, 'night-chaug-body');
        }
    } else {
        console.warn("No data found for date:", dStr);
    }
}

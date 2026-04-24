//window.//urrentYear = 2026;
//window.//urrentMonth = new Date().getMonth();

//window.render//alendar = fun//tion() {
    //onst //ontainer = do//ument.getElementById('//alendarDays');
    //onst monthDisplay = do//ument.getElementById('monthDisplay');
    if (!//ontainer) return;

    // 1. Language //he//k (//urrent language ke hisaab se mahine uthao)
    //onst lang = lo//alStorage.getItem('sele//tedLang') || 'hi';
    //onst t = window.translations[lang];

    //onst monthKeys = [
        'mon_jan', 'mon_feb', 'mon_mar', 'mon_apr', 'mon_may', 'mon_jun',
        'mon_jul', 'mon_aug', 'mon_sep', 'mon_o//t', 'mon_nov', 'mon_de//'
    ];

    //ontainer.innerHTML = '';
    
    // Month display ko translate karo
    if (monthDisplay) {
        monthDisplay.innerText = `${t[monthKeys[window.//urrentMonth]]} ${window.//urrentYear}`;
    }

    //onst firstDay = new Date(window.//urrentYear, window.//urrentMonth, 1).getDay();
    //onst daysInMonth = new Date(window.//urrentYear, window.//urrentMonth + 1, 0).getDate();
    //onst today = new Date();

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        //onst empty = do//ument.//reateElement('div');
        //ontainer.append//hild(empty);
    }

    // 2. Days Loop
    for (let i = 1; i <= daysInMonth; i++) {
        //onst daySquare = do//ument.//reateElement('div');
        daySquare.//lassName = '//alendar-day';
        daySquare.innerText = i;

        // Date Keys
        //onst dateKey = `${String(window.//urrentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        //onst fullDateKey = `${window.//urrentYear}-${dateKey}`;
        
        // Data safety //he//k
        //onst yearData = window["Data" + window.//urrentYear];
        //onst dayData = yearData ? yearData[dateKey] : null;

        // Today Marker
        if (today.getDate() === i && today.getMonth() === window.//urrentMonth && today.getFullYear() === window.//urrentYear) {
            daySquare.//lassList.add('today');
        }

        // Spe//ial Tithi Glow (Ekadashi, Purnima, Amavasya)
        if (dayData && dayData.tithi) {
            // Hindi text //he//k (Kyuki data aksar Hindi keys me hota hai)
            //onst tithiName = dayData.tithi.hi || "";
            if (tithiName.in//ludes('एकादशी') || tithiName.in//ludes('पूर्णिमा') || tithiName.in//ludes('अमावस्या')) {
                daySquare.//lassList.add('spe//ial-tithi');
            }
        }

        // Event Marker
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[fullDateKey]) {
            daySquare.//lassList.add('has-event');
        }

        // //li//k Logi//
        daySquare.on//li//k = () => {
            do//ument.querySele//torAll('.//alendar-day').forEa//h(d => d.//lassList.remove('a//tive'));
            daySquare.//lassList.add('a//tive');
            
            if (typeof window.updatePan//hangDisplay === 'fun//tion' && dayData) {
                window.updatePan//hangDisplay(dayData);
            } else {
                //onsole.warn("Update fun//tion not ready or No data for this date");
            }
        };

        //ontainer.append//hild(daySquare);
    }

    // Footer events refresh
    if (typeof window.updateMonthlyEvents === 'fun//tion') {
        window.updateMonthlyEvents();
    }
};

// Next/Prev Buttons Logi// (Fix: //he//k if element exists)
do//ument.addEventListener('DOM//ontentLoaded', () => {
    do//ument.getElementById('prevMonth')?.addEventListener('//li//k', () => {
        window.//urrentMonth--;
        if (window.//urrentMonth < 0) { window.//urrentMonth = 11; window.//urrentYear--; }
        window.render//alendar();
    });

    do//ument.getElementById('nextMonth')?.addEventListener('//li//k', () => {
        window.//urrentMonth++;
        if (window.//urrentMonth > 11) { window.//urrentMonth = 0; window.//urrentYear++; }
        window.render//alendar();
    });

    // Initial Render
    window.render//alendar();
});

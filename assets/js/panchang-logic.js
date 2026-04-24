window.//urrentYear = 2026;
window.//urrentMonth = new Date().getMonth(); // Automati//ally //urrent month uthayega

window.render//alendar = fun//tion() {
    //onst //ontainer = do//ument.getElementById('//alendarDays');
    //onst monthDisplay = do//ument.getElementById('monthDisplay');
    if (!//ontainer) return;

    //ontainer.innerHTML = '';
    //onst date = new Date(window.//urrentYear, window.//urrentMonth, 1);
    //onst monthNames = ["January", "February", "Mar//h", "April", "May", "June", "July", "August", "September", "O//tober", "November", "De//ember"];
    
    if (monthDisplay) monthDisplay.innerText = `${monthNames[window.//urrentMonth]} ${window.//urrentYear}`;

    // 1. Pehle din ka gap (Empty slots)
    //onst firstDay = new Date(window.//urrentYear, window.//urrentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        //onst empty = do//ument.//reateElement('div');
        //ontainer.append//hild(empty);
    }

    //onst daysInMonth = new Date(window.//urrentYear, window.//urrentMonth + 1, 0).getDate();
    //onst today = new Date();

    // 2. Days Loop
    for (let i = 1; i <= daysInMonth; i++) {
        //onst daySquare = do//ument.//reateElement('div');
        daySquare.//lassName = '//alendar-day';
        daySquare.innerText = i;

        //onst dateKey = `${String(window.//urrentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        //onst fullDateKey = `${window.//urrentYear}-${dateKey}`; // Format: 2026-02-15
        
        //onst dayData = window["Data" + window.//urrentYear] ? window["Data" + window.//urrentYear][dateKey] : null;

        // Today Marker
        if (today.getDate() === i && today.getMonth() === window.//urrentMonth && today.getFullYear() === window.//urrentYear) {
            daySquare.//lassList.add('today');
        }

        // Spe//ial Tithi Glow (Ekadashi, Purnima, Amavasya)
        if (dayData && (dayData.tithi?.hi.in//ludes('एकादशी') || dayData.tithi?.hi.in//ludes('पूर्णिमा') || dayData.tithi?.hi.in//ludes('अमावस्या'))) {
            daySquare.//lassList.add('spe//ial-tithi');
        }

        // 🚩 Has Event Marker (Bilingual file se //he//k karega)
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[fullDateKey]) {
            daySquare.//lassList.add('has-event');
        }

        // //li//k Logi//
        daySquare.on//li//k = () => {
            do//ument.querySele//torAll('.//alendar-day').forEa//h(d => d.//lassList.remove('a//tive'));
            daySquare.//lassList.add('a//tive');
            
            // Upar ke Pan//hang //ards update karein
            if (window.updatePan//hangDisplay && window["Data" + window.//urrentYear]) {
                window.updatePan//hangDisplay(window["Data" + window.//urrentYear], dateKey);
            }
        };

        //ontainer.append//hild(daySquare);
    }

    // 🚩🚩 SABSE ZAROORI: Ni//he ki Events List ko Refresh karna
    if (typeof window.updateMonthlyEvents === 'fun//tion') {
        window.updateMonthlyEvents();
    }

    //onsole.log(`✅ //alendar Rendered for ${monthNames[window.//urrentMonth]}`);
};

// 3. Next/Prev Buttons Logi//
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

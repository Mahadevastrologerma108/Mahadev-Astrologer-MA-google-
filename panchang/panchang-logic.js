//window.currentYear = 2026;
//window.currentMonth = new Date().getMonth();

//window.renderCalendar = function() {
  //  const container = document.getElementById('calendarDays');
    //const monthDisplay = document.getElementById('monthDisplay');
   // if (!container) return;

    // 1. Language Check (Current language ke hisaab se mahine uthao)
    //const lang = localStorage.getItem('selectedLang') || 'hi';
    //const t = window.translations[lang];

//    const monthKeys = [
  //      'mon_jan', 'mon_feb', 'mon_mar', 'mon_apr', 'mon_may', 'mon_jun',
    //    'mon_jul', 'mon_aug', 'mon_sep', 'mon_oct', 'mon_nov', 'mon_dec'
    ];

    //container.innerHTML = '';
    
    // Month display ko translate karo
  //  if (monthDisplay) {
  //      monthDisplay.innerText = `${t[monthKeys[window.currentMonth]]} ${window.currentYear}`;
    }

//    const firstDay = new Date(window.currentYear, window.currentMonth, 1).getDay();
//    const daysInMonth = new Date(window.currentYear, window.currentMonth + 1, 0).getDate();
 //   const today = new Date();

    // Empty slots
 //   for (let i = 0; i < firstDay; i++) {
  //      const empty = document.createElement('div');
  //      container.appendChild(empty);
    }

    // 2. Days Loop
  //  for (let i = 1; i <= daysInMonth; i++) {
   //     const daySquare = document.createElement('div');
   //     daySquare.className = 'calendar-day';
    //    daySquare.innerText = i;

        // Date Keys
     //   const dateKey = `${String(window.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
     //   const fullDateKey = `${window.currentYear}-${dateKey}`;
        
        // Data safety check
     //   const yearData = window["Data" + window.currentYear];
     //   const dayData = yearData ? yearData[dateKey] : null;

        // Today Marker
     //   if (today.getDate() === i && today.getMonth() === window.currentMonth && today.getFullYear() === window.currentYear) {
      //      daySquare.classList.add('today');
        }

        // Special Tithi Glow (Ekadashi, Purnima, Amavasya)
      //  if (dayData && dayData.tithi) {
            // Hindi text check (Kyuki data aksar Hindi keys me hota hai)
      //      const tithiName = dayData.tithi.hi || "";
      //      if (tithiName.includes('एकादशी') || tithiName.includes('पूर्णिमा') || tithiName.includes('अमावस्या')) {
      //          daySquare.classList.add('special-tithi');
            }
        }

        // Event Marker
     //   if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026[fullDateKey]) {
    //        daySquare.classList.add('has-event');
        }

        // Click Logic
     //   daySquare.onclick = () => {
      //      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
      //      daySquare.classList.add('active');
            
       //     if (typeof window.updatePanchangDisplay === 'function' && dayData) {
        //        window.updatePanchangDisplay(dayData);
        //    } else {
         //       console.warn("Update function not ready or No data for this date");
            }
        };

     //   container.appendChild(daySquare);
    }

    // Footer events refresh
 //   if (typeof window.updateMonthlyEvents === 'function') {
 //       window.updateMonthlyEvents();
    }
};

// Next/Prev Buttons Logic (Fix: Check if element exists)
//document.addEventListener('DOMContentLoaded', () => {
//    document.getElementById('prevMonth')?.addEventListener('click', () => {
//        window.currentMonth--;
//        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
 //       window.renderCalendar();
    });

//    document.getElementById('nextMonth')?.addEventListener('click', () => {
//        window.currentMonth++;
//        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
 //       window.renderCalendar();
    });

    // Initial Render
 //   window.renderCalendar();
});

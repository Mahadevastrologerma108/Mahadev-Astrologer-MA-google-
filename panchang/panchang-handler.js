import { db, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev Handler: Sindoor lag raha hai...");

// ==========================================
// 1. GLOBAL VARIABLES
// ==========================================
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();

// ==========================================
// 2. FIREBASE DATA FETCH
// ==========================================
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, 'panchang/' + year)); 
        if (snapshot.exists()) {
            window = snapshot.val(); 
        } else {
            console.log("No data found for year: " + year);
        }
    } catch (e) { 
        console.error("🔱 Panchang Fetch Error:", e); 
    } finally {
        // Data fetch hone ke baad UI update call karein
        if (typeof window.renderCalendar === 'function') {
            window.renderCalendar();
        }
        if (window) {
            window.updatePanchangDisplay(window);
        }
    }
};

// ==========================================
// 3. UPDATE TOP CARDS & CHOGHADIYA
// ==========================================
window.updatePanchangDisplay = async function(yearlyData) {
    if (!yearlyData) return;

    let mStr = String(window.currentMonth + 1).padStart(2, '0');
    let dStr = String(window.selectedDay).padStart(2, '0');
    
    // Date formats check (MM-DD or MM/dDD)
    let dateKey = mStr + '-' + dStr;
    let d = null;
    if (yearlyData) {
        d = yearlyData;
    } else if (yearlyData && yearlyData) {
        d = yearlyData;
    }

    const ids =;
    
    // Agar us date ka data nahi hai, to sabme "--" bhar do
    if (!d) {
        for(let i=0; i<ids.length; i++) {
            let el = document.getElementById(ids); 
            if(el) el.innerText = "--"; 
        }
        let dBody = document.getElementById('day-chaug-body');
        let nBody = document.getElementById('night-chaug-body');
        if(dBody) dBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No Data Available</td></tr>';
        if(nBody) nBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#888;">No Data Available</td></tr>';
        return;
    }

    // Data ko nikalne ka safe function
    const safeVal = function(obj) {
        if (typeof obj === 'object' && obj !== null) return obj.hi || obj.en || "--";
        return obj || "--";
    };

    const map = {
        'pan-tithi': safeVal(d.tithi), 
        'pan-nak': safeVal(d.nakshatra),
        'pan-yoga': safeVal(d.yoga), 
        'pan-karana': safeVal(d.karan),
        'pan-paksha': safeVal(d.paksha), 
        'pan-sun': d.sun ? (d.sun.rise + ' / ' + d.sun.set) : "--",
        'pan-moon': (d.moon && d.moon.rise) ? d.moon.rise : (d.moon || "--"), 
        'pan-muh': (d.muhurat && d.muhurat.abhijit) ? d.muhurat.abhijit : "--",
        'pan-rahu': (d.muhurat && d.muhurat.rahukaal) ? d.muhurat.rahukaal : "--"
    };

    // Card Update (Standard Loop)
    for (let key in map) {
        let el = document.getElementById(key);
        if (el) el.innerText = map;
    }

    // Choghadiya Update
    const fillTable = function(id, cData) {
        let body = document.getElementById(id);
        if (body && cData) {
            let html = '';
            for (let timeKey in cData) {
                let name = cData;
                let formattedTime = timeKey.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
                html += '<tr>' +
                        '<td style="color:var(--gold); font-weight:bold; padding:12px;">' + formattedTime + '</td>' +
                        '<td style="padding:12px;">' + name + '</td>' +
                        '<td class="nature-shubh" style="font-size:0.85em; padding:12px; color:#00ff88;">Shubh</td>' +
                    '</tr>';
            }
            body.innerHTML = html;
        }
    };

    if (d.choghadiya) {
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    }
};

// ==========================================
// 4. CALENDAR RENDER ENGINE
// ==========================================
window.renderCalendar = function() {
    let container = document.getElementById('calendarDays');
    let monthDisplay = document.getElementById('monthDisplay');
    if (!container) return;

    let year = window.currentYear;
    let month = window.currentMonth;
    
    // Month Names Array (Bulletproof)
    const monthNames =;
    if (monthDisplay) {
        monthDisplay.innerText = monthNames + ' ' + year;
    }

    container.innerHTML = '';
    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Khali (Empty) slots shuruat ke dino ke liye
    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        emptyDiv.style.border = 'none';
        emptyDiv.style.background = 'transparent';
        container.appendChild(emptyDiv);
    }

    let today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        let daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        daySquare.innerText = day;

        // Current aur Selected Date ko highlight karo
        if (window.selectedDay === day) {
            daySquare.classList.add('active');
        }
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            daySquare.classList.add('today');
        }

        let mStr = String(month + 1).padStart(2, '0');
        let dStr = String(day).padStart(2, '0');
        let fullDateKey = year + '-' + mStr + '-' + dStr;

        // Red Event Dot Agar Tyohar ho
        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026) {
            daySquare.classList.add('has-event');
        }

        // Click on Calendar Day
        daySquare.onclick = function() {
            window.selectedDay = day;
            window.renderCalendar();
            if (window) {
                window.updatePanchangDisplay(window);
            }
        };

        container.appendChild(daySquare);
    }
    
    // Calendar ke update hone ke baad niche list update karo
    window.updateMonthlyEvents(); 
};

// ==========================================
// 5. MONTHLY FESTIVAL LIST
// ==========================================
window.updateMonthlyEvents = function() {
    let container = document.getElementById('events-list');
    let eventsData = window.YEARLY_EVENTS_2026;
    if (!container || !eventsData) return;

    let currentM = String(window.currentMonth + 1).padStart(2, '0');
    let currentY = window.currentYear;
    let html = "";

    // Array Keys & Standard Loop (Bulletproof)
    let eventKeys = Object.keys(eventsData).sort();
    
    for (let i = 0; i < eventKeys.length; i++) {
        let dateKey = eventKeys;
        if (dateKey.startsWith(currentY + '-' + currentM)) {
            let event = eventsData;
            let dayNum = dateKey.split('-');
            let title = event.hi || event.en;
            let desc = event.desc_hi || event.desc_en || event.en;
            
            // Onclick me inline function banaya hai taki refresh ho jaye
            let clickFunc = "window.selectedDay=" + parseInt(dayNum, 10) + "; window.renderCalendar(); if(window) window.updatePanchangDisplay(window);";
            
            html += '<div class="event-item-card" onclick="' + clickFunc + '">' +
                    '<div class="event-date-badge">' + parseInt(dayNum, 10) + '</div>' +
                    '<div class="event-details">' +
                        '<h4 style="color:var(--gold); margin:0; font-size:16px; font-family:\'Cinzel\';">' + title + '</h4>' +
                        '<p style="color:#aaa; margin:2px 0 0; font-size:12px;">' + desc + '</p>' +
                    '</div>' +
                '</div>';
        }
    }

    if (html === "") {
        container.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">No major festivals this month.</p>';
    } else {
        container.innerHTML = html;
    }
};

// ==========================================
// 6. INITIALIZATION & ARROWS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. App start hote hi Firebase se data lao
    window.getPanchangFromFirebase(2026);
    
    // 2. Calendar ke Buttons
    let prevBtn = document.getElementById('prevMonth');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            window.currentMonth--;
            if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
            window.selectedDay = 1;
            window.renderCalendar();
            if (window) window.updatePanchangDisplay(window);
        });
    }

    let nextBtn = document.getElementById('nextMonth');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            window.currentMonth++;
            if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
            window.selectedDay = 1;
            window.renderCalendar();
            if (window) window.updatePanchangDisplay(window);
        });
    }
});

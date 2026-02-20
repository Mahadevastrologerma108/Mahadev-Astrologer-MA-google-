import { db, rtdb } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

console.log("🔱 Mahadev Handler: 100% Fixed & Active. Life breathed into the body!");

const BOT_TOKEN = '8409366336:AAEYCE58wm7ir7-aSUlz4IZepO2zIzaUJS4'; 
const CHAT_ID = '2032242977'; 

// Global State
window.currentYear = 2026;
window.currentMonth = new Date().getMonth();
window.selectedDay = new Date().getDate();

// ==========================================
// 1. FIREBASE DATA FETCH
// ==========================================
window.getPanchangFromFirebase = async function(year) {
    try {
        const snapshot = await get(ref(rtdb, `panchang/${year}`)); 
        if (snapshot.exists()) {
            window = snapshot.val(); 
        } else {
            console.log("No data found for year: " + year);
        }
    } catch (e) { 
        console.error("🔱 Panchang Fetch Error:", e); 
    } finally {
        // Data aane ke baad UI me jaan dalna
        if (typeof window.renderCalendar === 'function') window.renderCalendar();
        if (window) window.updatePanchangDisplay(window);
    }
};

// ==========================================
// 2. UPDATE TOP CARDS & CHOGHADIYA
// ==========================================
window.updatePanchangDisplay = async function(yearlyData) {
    if (!yearlyData) return;

    const mStr = String(window.currentMonth + 1).padStart(2, '0');
    const dStr = String(window.selectedDay).padStart(2, '0');
    
    // JSON me date kaise save hai usko fetch karna (MM-DD)
    const dateKey = `${mStr}-${dStr}`;
    let d = yearlyData || yearlyData; 
    if(!d && yearlyData) d = yearlyData || yearlyData;

    const ids =;
    
    // Agar data na mile to '--' dikhao
    if (!d) {
        ids.forEach(id => { const el = document.getElementById(id); if(el) el.innerText = "--"; });
        return;
    }

    const safeVal = (obj) => {
        if (typeof obj === 'object' && obj !== null) return obj.hi || obj.en || "--";
        return obj || "--";
    };

    const map = {
        'pan-tithi': safeVal(d.tithi), 'pan-nak': safeVal(d.nakshatra),
        'pan-yoga': safeVal(d.yoga), 'pan-karana': safeVal(d.karan),
        'pan-paksha': safeVal(d.paksha), 'pan-sun': d.sun ? `${d.sun.rise || '--'} / ${d.sun.set || '--'}` : "--",
        'pan-moon': d.moon?.rise || d.moon || "--", 'pan-muh': d.muhurat?.abhijit || "--",
        'pan-rahu': d.muhurat?.rahukaal || "--"
    };

    // Cards Fill
    Object.entries(map).forEach(() => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    // Choghadiya Fill
    const fillTable = (id, cData) => {
        const body = document.getElementById(id);
        if (body && cData) {
            body.innerHTML = Object.entries(cData).map(() => {
                let formattedTime = time.replace('t', '').replace(/^(\d{2})(\d{2})$/, '$1:$2');
                return `<tr>
                    <td style="color:var(--gold); font-weight:bold; padding:8px;">${formattedTime}</td>
                    <td style="padding:8px;">${name}</td>
                    <td class="nature-shubh" style="font-size:0.8em; padding:8px; color:#00ff88;">Shubh</td>
                </tr>`;
            }).join('');
        }
    };

    if (d.choghadiya) {
        fillTable('day-chaug-body', d.choghadiya.day);
        fillTable('night-chaug-body', d.choghadiya.night);
    } else {
        const dBody = document.getElementById('day-chaug-body');
        const nBody = document.getElementById('night-chaug-body');
        if(dBody) dBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No Data</td></tr>`;
        if(nBody) nBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No Data</td></tr>`;
    }
};

// ==========================================
// 3. CALENDAR RENDER ENGINE
// ==========================================
window.renderCalendar = function() {
    const container = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    if (!container) return;

    const year = window.currentYear;
    const month = window.currentMonth;
    
    const monthNames =;
    if (monthDisplay) monthDisplay.innerText = `${monthNames} ${year}`;

    container.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        emptyDiv.style.border = 'none';
        emptyDiv.style.background = 'transparent';
        container.appendChild(emptyDiv);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const daySquare = document.createElement('div');
        daySquare.className = 'calendar-day';
        daySquare.innerText = day;

        if (window.selectedDay === day) daySquare.classList.add('active');
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            daySquare.classList.add('today');
        }

        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(day).padStart(2, '0');
        const fullDateKey = `${year}-${mStr}-${dStr}`;

        if (window.YEARLY_EVENTS_2026 && window.YEARLY_EVENTS_2026) {
            daySquare.classList.add('has-event');
        }

        daySquare.onclick = () => {
            window.selectedDay = day;
            window.renderCalendar();
            if (window) window.updatePanchangDisplay(window);
        };

        container.appendChild(daySquare);
    }
    window.updateMonthlyEvents(); 
};

// ==========================================
// 4. MONTHLY FESTIVAL LIST
// ==========================================
window.updateMonthlyEvents = function() {
    const container = document.getElementById('events-list');
    const eventsData = window.YEARLY_EVENTS_2026;
    if (!container || !eventsData) return;

    const currentM = String(window.currentMonth + 1).padStart(2, '0');
    const currentY = window.currentYear;
    let html = "";

    Object.entries(eventsData).sort().forEach(() => {
        if (dateKey.startsWith(`${currentY}-${currentM}`)) {
            const dayNum = dateKey.split('-');
            html += `
                <div class="event-item-card" onclick="window.selectedDay=${parseInt(dayNum, 10)}; window.renderCalendar(); if(window) window.updatePanchangDisplay(window);">
                    <div class="event-date-badge">${dayNum}</div>
                    <div class="event-details">
                        <h4 style="color:var(--gold); margin:0; font-size:16px; font-family:'Cinzel';">${event.hi || event.en}</h4>
                        <p style="color:#aaa; margin:2px 0 0; font-size:12px;">${event.desc_hi || event.desc_en || event.en}</p>
                    </div>
                </div>`;
        }
    });

    container.innerHTML = html || `<p style="text-align:center; color:#888; padding:20px;">No major festivals this month.</p>`;
};

// ==========================================
// 5. APPOINTMENT FORM & BUTTONS INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initializing
    window.getPanchangFromFirebase(2026);
    
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        window.currentMonth--;
        if (window.currentMonth < 0) { window.currentMonth = 11; window.currentYear--; }
        window.selectedDay = 1;
        window.renderCalendar();
        if (window) window.updatePanchangDisplay(window);
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        window.currentMonth++;
        if (window.currentMonth > 11) { window.currentMonth = 0; window.currentYear++; }
        window.selectedDay = 1;
        window.renderCalendar();
        if (window) window.updatePanchangDisplay(window);
    });

    const appointmentForm = document.getElementById('consultation-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.innerText = "🔱 SENDING...";
            btn.disabled = true;

            try {
                const service = document.getElementById('service-select').value;
                const name = document.getElementById('user-name').value;
                const contactMethod = document.querySelector('input:checked')?.value || "WA";
                const contactDetail = document.getElementById('contact-detail').value;

                const subData = { service, name, contact_method: contactMethod, contact_detail: contactDetail, timestamp: serverTimestamp() };

                await addDoc(collection(db, "appointments"), subData);

                const tgMessage = `🔱 *New Appointment Request!*\n\n👤 *Name:* ${name}\n✨ *Service:* ${service.replace('_', ' ').toUpperCase()}\n📞 *Contact:* ${contactDetail} (${contactMethod})`;
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text: tgMessage, parse_mode: 'Markdown' })
                });

                alert("🔱 Pranaam! Aapki request Mahadev tak pahunch gayi hai.");
                e.target.reset();
            } catch (err) { console.error("Form Error:", err); alert("Network error. Kripya dobara koshish karein."); } 
            finally { btn.innerText = "SEND REQUEST"; btn.disabled = false; }
        });
    }
});

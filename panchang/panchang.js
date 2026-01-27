/**
 * MAHADEV ASTROLOGER MA - Panchang System 2026
 * Handles Daily Panchang Details & Monthly Events
 */

// Folder se bahar nikal kar assets tak pahunchne ka path
const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];

let currentYear = 2026;
let currentMonth = new Date().getMonth(); // Aaj ka mahina (0-11)

async function initPanchang() {
    try {
        // Dono data files ko ek saath fetch karein
        const [resEvents, resDetails] = await Promise.all([
            fetch(eventPath),
            fetch(detailPath)
        ]);

        if (!resEvents.ok || !resDetails.ok) throw new Error("Files not found at paths");

        const allEvents = await resEvents.json();
        const allDetails = await resDetails.json();

        // 1. AAJ KA DATA (Top Box)
        // Aaj ki date format: YYYY-MM-DD
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA'); 

        updateDailyView(allDetails[todayStr]);

        // 2. MONTHLY EVENTS (Sidebar)
        updateMonthlyEvents(allEvents);

        console.log("Mahadev Astrologer Data Loaded Successfully! 🔱");

    } catch (error) {
        console.error("Path Error: Check if assets folder is outside panchang folder.", error);
    }
}

// Function: Aaj ka Panchang Card Update karne ke liye
function updateDailyView(data) {
    if (!data) return;

    // IDs match with your HTML
    document.getElementById('pan-tithi').innerText = data.tithi || "--";
    document.getElementById('pan-nak').innerText = data.nakshatra || "--";
    document.getElementById('pan-sun').innerText = `${data.sunrise} / ${data.sunset}`;
    document.getElementById('pan-muh').innerText = data.muhurat || "--";

    // Festival Alert Logic
    const festBox = document.getElementById('fest-box');
    const festText = document.getElementById('today-fest');
    
    if (data.festival && data.festival !== "None") {
        festBox.style.display = "block";
        festText.innerText = data.festival;
    } else {
        festBox.style.display = "none";
    }
}

// Function: Sidebar List Update karne ke liye
function updateMonthlyEvents(allEvents) {
    const monthNameStr = monthNames[currentMonth];
    document.getElementById('month-name').innerText = `${monthNameStr} ${currentYear}`;

    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ""; // Purana data saaf karein

    const monthlyData = allEvents[monthNameStr];

    if (monthlyData) {
        Object.keys(monthlyData).sort().forEach(dateKey => {
            const dayNum = dateKey.split('-')[2]; // Date nikalne ke liye
            const li = document.createElement('li');
            li.style.padding = "8px 0";
            li.style.borderBottom = "1px solid rgba(255,215,0,0.1)";
            li.style.fontSize = "0.9rem";
            
            li.innerHTML = `
                <span class="gold-text" style="font-weight:bold; margin-right:10px;">${dayNum}</span> 
                <span style="color: #eee;">${monthlyData[dateKey]}</span>
            `;
            eventList.appendChild(li);
        });
    } else {
        eventList.innerHTML = "<li class='gold-text'>Is mahine koi vishesh vrat nahi hai.</li>";
    }
}

// Function: Navigation Buttons (Next/Prev)
function changeMonth(step) {
    currentMonth += step;
    
    // Year change logic
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    // Sirf event data reload karne ke liye (ya pura reload)
    initPanchang();
}

// System ko start karein
initPanchang();
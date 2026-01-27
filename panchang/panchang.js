// Paths as per your professional structure
const eventPath = '../assets/data/calendar_events.json';
const detailPath = '../assets/data/panchang_details.json';

// Month names array to match your JSON keys
const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];

async function loadPanchangSystem() {
    try {
        const [resEvents, resDetails] = await Promise.all([
            fetch(eventPath),
            fetch(detailPath)
        ]);

        const allEvents = await resEvents.json();
        const allDetails = await resDetails.json();

        // 1. Aaj ki date nikalein
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; // Format: 2026-01-27
        const currentMonthName = monthNames[now.getMonth()];

        // 2. Aaj ka main Panchang show karein (Top Box)
        if (allDetails[todayStr]) {
            displayDailyPanchang(allDetails[todayStr]);
        }

        // 3. Calendar mein current month ke events dikhayein
        const currentMonthEvents = allEvents[currentMonthName];
        displayMonthEvents(currentMonthEvents);

        console.log(`Panchang Loaded for ${currentMonthName}! ✅`);

    } catch (error) {
        console.error("Data load nahi hua, path check karein:", error);
    }
}

// Function: Aaj ka data UI par dikhane ke liye
function displayDailyPanchang(data) {
    // Ye IDs aapke HTML mein honi chahiye
    const tithiEl = document.getElementById('tithi-val');
    const festEl = document.getElementById('fest-val');
    
    if(tithiEl) tithiEl.innerText = data.tithi;
    if(festEl) festEl.innerText = data.festival !== "None" ? data.festival : "Koi bada tyohar nahi";
}

// Function: Calendar list mein tyohar dikhane ke liye
function displayMonthEvents(events) {
    const listContainer = document.getElementById('event-list'); // HTML list ID
    if(!listContainer) return;

    listContainer.innerHTML = ""; // Purana data saaf karein

    Object.keys(events).forEach(date => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${date.split('-')[2]}:</strong> ${events[date]}`;
        listContainer.appendChild(listItem);
    });
}

// System Start!
loadPanchangSystem();
const dailyHoroscope = {
"aries": {
"career": "Mahadev ki kripa se naye avsar milenge. Business mein labh ke yog hain.",
"love": "Parivar ke saath sambandh madhur rahenge. Shaam ko shanti milegi.",
"health": "Swasthya achha rahega, thoda vishram zaroori hai. Om Namah Shivay.",
"luckyColor": "White", "luckyNumber": "9", "luckyTime": "10:30 AM"
},
"taurus": {
"career": "Vani ki madhurta se bigde kaam banenge. Office mein samman milega.",
"love": "Partner ke saath thoda samay bitayein. Galat-fahami door hogi.",
"health": "Ankhon ka dhyan rakhein. Shiv Chalisa ka path shubh hai.",
"luckyColor": "Blue", "luckyNumber": "6", "luckyTime": "12:15 PM"
},
"gemini": {
"career": "Economic situation will improve. New projects might start today.",
"love": "Spend time with family. A surprise from a friend is expected.",
"health": "Energy levels are high. Stay hydrated throughout the day.",
"luckyColor": "Green", "luckyNumber": "5", "luckyTime": "09:00 AM"
},
"cancer": {
"career": "Focus on your pending tasks. Support from seniors is likely.",
"love": "Emotional stability will return. Avoid arguments with spouse.",
"health": "Meditation will bring peace. Watch your diet today.",
"luckyColor": "Silver", "luckyNumber": "2", "luckyTime": "11:45 AM"
},
"leo": {
"career": "Leadership qualities will shine. A good day for career growth.",
"love": "Your charm will attract positive energy in relationships.",
"health": "Back pain might bother you. Avoid heavy lifting.",
"luckyColor": "Gold", "luckyNumber": "1", "luckyTime": "01:30 PM"
},
"virgo": {
"career": "Investments made today will yield long-term benefits.",
"love": "Communication is key. Express your feelings clearly.",
"health": "Minor headaches are possible. Take a short nap.",
"luckyColor": "Brown", "luckyNumber": "3", "luckyTime": "04:00 PM"
},
"libra": {
"career": "A balanced day at work. New partnerships may form.",
"love": "Romance is in the air. A peaceful evening with loved ones.",
"health": "Skin related issues might occur. Drink more water.",
"luckyColor": "Pink", "luckyNumber": "7", "luckyTime": "06:20 PM"
},
"scorpio": {
"career": "Hidden enemies might create hurdles. Stay alert and calm.",
"love": "Trust your partner. Avoid being overly possessive.",
"health": "Avoid outside food. Focus on home-cooked meals.",
"luckyColor": "Red", "luckyNumber": "8", "luckyTime": "08:15 PM"
},
"sagittarius": {
"career": "Travel for work is indicated. Success in competitive tasks.",
"love": "Great bonding with siblings. Family atmosphere will be joyful.",
"health": "Morning walks will boost your immunity and mood.",
"luckyColor": "Yellow", "luckyNumber": "4", "luckyTime": "07:30 AM"
},
"capricorn": {
"career": "Hard work will finally pay off. Recognition is coming your way.",
"love": "Commitment in relationships will deepen today.",
"health": "Leg or knee pain might occur. Do light stretching.",
"luckyColor": "Black", "luckyNumber": "8", "luckyTime": "03:45 PM"
},
"aquarius": {
"career": "Innovative ideas will be appreciated. Financial stability remains.",
"love": "An old friend might reconnect. Nostalgic day ahead.",
"health": "Mental stress might be high. Listen to calming music.",
"luckyColor": "Cyan", "luckyNumber": "11", "luckyTime": "05:10 PM"
},
"pisces": {
"career": "Creative fields will thrive today. Sudden profit is possible.",
"love": "A deep spiritual connection with your partner.",
"health": "Sleep cycle needs improvement. Avoid caffeine late at night.",
"luckyColor": "Purple", "luckyNumber": "12", "luckyTime": "10:00 PM"
}
};

// Data Load Karne Wala Function
function loadHoroscope(rashiKey) {
const data = dailyHoroscope[rashiKey];
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const today = new Date().toLocaleDateString('en-US', options);

if (data) {  
    document.getElementById('todayDate').innerText = "Daily Horoscope: " + today;  
    document.getElementById('h-career').innerText = data.career;  
    document.getElementById('h-love').innerText = data.love;  
    document.getElementById('h-health').innerText = data.health;  
    document.getElementById('h-color').innerText = data.luckyColor;  
    document.getElementById('h-number').innerText = data.luckyNumber;  
    document.getElementById('h-time').innerText = data.luckyTime;  
}

}
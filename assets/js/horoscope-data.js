const dailyHoroscope = {
  "aries": {
    "career": "Aaj ka din career me bold decision lene ke liye shubh hai. Naya role ya responsibility mil sakti hai.",
    "love": "Open communication se rishton me madhurta aayegi. Single logon ko positive signal mil sakta hai.",
    "health": "Energy level achha rahega. Meditation ya short walk faydemand rahegi.",
    "luckyColor": "Red",
    "luckyNumber": "9",
    "luckyTime": "09:45 AM"
  },

  "taurus": {
    "career": "Financial planning aur long-term strategy par focus karein. Steady progress dikhegi.",
    "love": "Partner ke saath trust aur support badhega. Family time sukhdayak rahega.",
    "health": "Thakaan se bachne ke liye proper rest aur hydration zaroori hai.",
    "luckyColor": "Green",
    "luckyNumber": "6",
    "luckyTime": "11:30 AM"
  },

  "gemini": {
    "career": "Communication skills aaj strength rahengi. Meetings aur interviews ke liye anukool din.",
    "love": "Friends ya partner ke saath meaningful baatcheet hogi.",
    "health": "Overthinking se bachein. Pani zyada piyen.",
    "luckyColor": "Yellow",
    "luckyNumber": "5",
    "luckyTime": "10:15 AM"
  },

  "cancer": {
    "career": "Workplace par zimmedari badh sakti hai. Seniors aap par bharosa dikhaenge.",
    "love": "Family bonding strong hogi. Emotional support milega.",
    "health": "Digestive issues se bachne ke liye halka bhojan karein.",
    "luckyColor": "White",
    "luckyNumber": "2",
    "luckyTime": "12:40 PM"
  },

  "leo": {
    "career": "Leadership aur confidence se kaam banega. Recognition milne ke yog hain.",
    "love": "Romantic vibes strong rahengi. Surprise ya appreciation possible hai.",
    "health": "Back aur posture ka dhyan rakhein.",
    "luckyColor": "Golden",
    "luckyNumber": "1",
    "luckyTime": "01:20 PM"
  },

  "virgo": {
    "career": "Planning aur detail-oriented approach se financial stability badhegi.",
    "love": "Clear communication misunderstandings door karegi.",
    "health": "Screen time kam rakhein, eyestrain se bachein.",
    "luckyColor": "Brown",
    "luckyNumber": "3",
    "luckyTime": "04:10 PM"
  },

  "libra": {
    "career": "Naye collaboration ya partnership ke chances hain. Balance bana kar chalna zaroori hai.",
    "love": "Pyar aur harmony ka mahaul rahega. Shaam romantic ho sakti hai.",
    "health": "Hydration aur skin care par dhyan dein.",
    "luckyColor": "Pink",
    "luckyNumber": "7",
    "luckyTime": "06:00 PM"
  },

  "scorpio": {
    "career": "Strategy aur focus se kaam karein. Hidden competition se savdhan rahein.",
    "love": "Trust aur patience se rishta majboot hoga.",
    "health": "Junk food avoid karein, light exercise karein.",
    "luckyColor": "Maroon",
    "luckyNumber": "8",
    "luckyTime": "07:50 PM"
  },

  "sagittarius": {
    "career": "Travel, learning ya online projects se fayda mil sakta hai.",
    "love": "Family ke saath khushiyon bhara samay bitayenge.",
    "health": "Yoga ya morning walk se freshness milegi.",
    "luckyColor": "Orange",
    "luckyNumber": "4",
    "luckyTime": "07:10 AM"
  },

  "capricorn": {
    "career": "Mehnat ka result milega. Promotion ya appreciation ke yog hain.",
    "love": "Commitment aur stability par baat ho sakti hai.",
    "health": "Joint ya knee pain ka dhyan rakhein.",
    "luckyColor": "Grey",
    "luckyNumber": "8",
    "luckyTime": "03:30 PM"
  },

  "aquarius": {
    "career": "Innovative ideas aur tech-related kaam me success milegi.",
    "love": "Purane dost ya special person se reconnect ho sakta hai.",
    "health": "Mental relaxation ke liye music ya meditation karein.",
    "luckyColor": "Blue",
    "luckyNumber": "11",
    "luckyTime": "05:00 PM"
  },

  "pisces": {
    "career": "Creative aur spiritual kaamon me progress dikhegi.",
    "love": "Emotional aur spiritual bonding strong hogi.",
    "health": "Sleep cycle aur routine sudharna zaroori hai.",
    "luckyColor": "Purple",
    "luckyNumber": "12",
    "luckyTime": "09:30 PM"
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
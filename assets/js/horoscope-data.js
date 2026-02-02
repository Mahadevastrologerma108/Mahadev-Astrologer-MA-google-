const dailyHoroscope = {
  "aries": {
    "career": "Aaj initiative lene se career me naya mauka mil sakta hai. Leadership dikhane ka din hai.",
    "love": "Dil ki baat clearly rakhoge to rishta aur gehra hoga.",
    "health": "Physical energy strong rahegi, bas overexertion se bachein.",
    "luckyColor": "Crimson",
    "luckyNumber": "9",
    "luckyTime": "10:10 AM"
  },

  "taurus": {
    "career": "Slow but solid progress hogi. Paiso se jude faisle soch-samajh kar karein.",
    "love": "Partner ka emotional support milega, bonding strong hogi.",
    "health": "Neck aur shoulders ko relax dena zaroori hai.",
    "luckyColor": "Olive Green",
    "luckyNumber": "6",
    "luckyTime": "12:00 PM"
  },

  "gemini": {
    "career": "Aaj ideas logon ko impress karenge. Networking faydemand rahegi.",
    "love": "Light flirting aur fun conversations mood fresh karengi.",
    "health": "Mental fatigue ho sakti hai, breaks lete rahein.",
    "luckyColor": "Sky Blue",
    "luckyNumber": "5",
    "luckyTime": "11:25 AM"
  },

  "cancer": {
    "career": "Office me aapki sensitivity hi aaj strength banegi.",
    "love": "Family ya partner ke saath emotional comfort milega.",
    "health": "Cold items avoid karein, immunity ka dhyan rakhein.",
    "luckyColor": "Silver",
    "luckyNumber": "2",
    "luckyTime": "01:05 PM"
  },

  "leo": {
    "career": "Aaj spotlight aap par rahegi. Confidence se baat rakhein.",
    "love": "Ego side me rakhen, pyar aur respect dono badhenge.",
    "health": "Hydration ka dhyan rakhein.",
    "luckyColor": "Gold",
    "luckyNumber": "1",
    "luckyTime": "02:15 PM"
  },

  "virgo": {
    "career": "Pending kaam complete karne ka perfect din hai.",
    "love": "Over-analysis se bachein, simple approach rakhein.",
    "health": "Digestive system par focus karein.",
    "luckyColor": "Beige",
    "luckyNumber": "3",
    "luckyTime": "04:30 PM"
  },

  "libra": {
    "career": "Teamwork se bada fayda hoga. Decision balanced rakhein.",
    "love": "Romantic gesture rishton me nayi jaan dalega.",
    "health": "Skin care aur hydration zaroori hai.",
    "luckyColor": "Rose Pink",
    "luckyNumber": "7",
    "luckyTime": "06:20 PM"
  },

  "scorpio": {
    "career": "Secret planning aur strategy kaam aayegi.",
    "love": "Possessiveness kam rakhein, trust badhaiye.",
    "health": "Late night se bachein.",
    "luckyColor": "Deep Red",
    "luckyNumber": "8",
    "luckyTime": "08:10 PM"
  },

  "sagittarius": {
    "career": "Naya idea ya learning future me bada fayda dega.",
    "love": "Positive vibes se ghar ka mahaul khushnuma rahega.",
    "health": "Outdoor activity se energy milegi.",
    "luckyColor": "Saffron",
    "luckyNumber": "4",
    "luckyTime": "07:40 AM"
  },

  "capricorn": {
    "career": "Aaj discipline hi aapka biggest weapon hai.",
    "love": "Practical approach se rishta stable rahega.",
    "health": "Back stretch aur posture ka dhyan rakhein.",
    "luckyColor": "Charcoal",
    "luckyNumber": "8",
    "luckyTime": "03:45 PM"
  },

  "aquarius": {
    "career": "Tech aur creative kaam me breakthrough possible hai.",
    "love": "Unexpected message ya call khushi dega.",
    "health": "Mind ko rest dena zaroori hai.",
    "luckyColor": "Turquoise",
    "luckyNumber": "11",
    "luckyTime": "05:35 PM"
  },

  "pisces": {
    "career": "Intuition follow karoge to sahi direction milegi.",
    "love": "Emotional closeness badhegi.",
    "health": "Proper sleep aaj sabse important hai.",
    "luckyColor": "Lavender",
    "luckyNumber": "12",
    "luckyTime": "09:15 PM"
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
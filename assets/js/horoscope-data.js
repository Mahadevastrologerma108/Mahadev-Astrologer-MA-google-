const dailyHoroscope = {
  "aries": {
    "career": "Aaj leadership aur decision-making skills se career me growth hogi. Seniors aap par bharosa dikhayenge.",
    "love": "Partner ke saath choti nok-jhonk ho sakti hai, shant communication se baat ban jayegi.",
    "health": "Energy high rahegi, lekin overexertion se thakaan ho sakti hai.",
    "luckyColor": "Crimson",
    "luckyNumber": "9",
    "luckyTime": "10:30 AM"
  },

  "taurus": {
    "career": "Mehnat ka result milega, kaam me stability bani rahegi.",
    "love": "Romantic moments aur emotional bonding strong hogi.",
    "health": "Body heaviness ya thakaan mehsoos ho sakti hai, rest zaroori hai.",
    "luckyColor": "Olive Green",
    "luckyNumber": "6",
    "luckyTime": "12:20 PM"
  },

  "gemini": {
    "career": "Communication aur networking se fayda hoga. Interview ya meeting ke liye accha din.",
    "love": "Clear baat-cheet se confusion door hoga.",
    "health": "Mental stress ho sakta hai, breaks aur deep breathing faydemand rahegi.",
    "luckyColor": "Sky Blue",
    "luckyNumber": "5",
    "luckyTime": "11:45 AM"
  },

  "cancer": {
    "career": "Teamwork se success milegi, emotional intelligence aapki strength banegi.",
    "love": "Family aur partner se emotional support milega.",
    "health": "Digestion ya acidity ki problem ho sakti hai.",
    "luckyColor": "Silver",
    "luckyNumber": "2",
    "luckyTime": "01:15 PM"
  },

  "leo": {
    "career": "Aaj appreciation ya recognition mil sakta hai.",
    "love": "Attraction strong rahega, ego side me rakhna zaroori hai.",
    "health": "Overall health acchi rahegi, hydration ka dhyan rakhein.",
    "luckyColor": "Gold",
    "luckyNumber": "1",
    "luckyTime": "02:35 PM"
  },

  "virgo": {
    "career": "Planning aur discipline se pending kaam complete honge.",
    "love": "Overthinking se bachein, simple approach rakhein.",
    "health": "Gut health par focus karna zaroori hai.",
    "luckyColor": "Beige",
    "luckyNumber": "3",
    "luckyTime": "04:40 PM"
  },

  "libra": {
    "career": "Partnership aur collaboration se fayda hoga.",
    "love": "Relationship me balance aur harmony rahegi.",
    "health": "Back pain ya posture issue ho sakta hai.",
    "luckyColor": "Rose Pink",
    "luckyNumber": "7",
    "luckyTime": "06:30 PM"
  },

  "scorpio": {
    "career": "Background planning aur strategy aaj kaam aayegi.",
    "love": "Trust rakhein, possessiveness kam karein.",
    "health": "Hormonal imbalance ya low mood ho sakta hai.",
    "luckyColor": "Deep Red",
    "luckyNumber": "8",
    "luckyTime": "08:25 PM"
  },

  "sagittarius": {
    "career": "Learning, travel ya new idea future me growth dega.",
    "love": "Positive vibes se family atmosphere khushnuma rahega.",
    "health": "Joints ya legs me discomfort ho sakta hai.",
    "luckyColor": "Saffron",
    "luckyNumber": "4",
    "luckyTime": "07:55 AM"
  },

  "capricorn": {
    "career": "Hard work ka reward milega, responsibility badhegi.",
    "love": "Feelings express karne ka sahi samay hai.",
    "health": "Neck aur shoulder pain ho sakta hai.",
    "luckyColor": "Charcoal",
    "luckyNumber": "8",
    "luckyTime": "03:55 PM"
  },

  "aquarius": {
    "career": "Innovative ideas se alag pehchaan banegi.",
    "love": "Unexpected message ya call khushi dega.",
    "health": "Nervous system sensitive rahega, rest zaroori hai.",
    "luckyColor": "Turquoise",
    "luckyNumber": "11",
    "luckyTime": "05:45 PM"
  },

  "pisces": {
    "career": "Intuition follow karoge to sahi direction milegi.",
    "love": "Emotional bonding aur closeness badhegi.",
    "health": "Energy ups-downs rahenge, proper sleep zaroori hai.",
    "luckyColor": "Lavender",
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
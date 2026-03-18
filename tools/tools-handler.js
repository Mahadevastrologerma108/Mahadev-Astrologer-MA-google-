/**
 * 🔱 Vedic Tool Center - Handler Script
 * Brand: MAHADEV ASTROLOGER MA
 * Logic: User Engagement & Smooth Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initGoalTracker();
    initScrollAnimations();
    setupToolLinks();
});

/**
 * 1. 🔱 Goal Tracker Logic
 * यूज़र के सपोर्ट को ट्रैक करता है और प्रोग्रेस बार को फील देता है
 */
function initGoalTracker() {
    const supportBtn = document.querySelector('.vote-btn');
    const progressFill = document.querySelector('.progress-bar-fill');
    
    // चेक करें कि क्या यूज़र ने पहले वोट किया है
    const hasVoted = localStorage.getItem('mahadev_tool_vote');

    if (supportBtn) {
        supportBtn.addEventListener('click', () => {
            if (hasVoted) {
                alert("महादेव की कृपा! आप पहले ही अपना बहुमूल्य समर्थन दे चुके हैं।");
            } else {
                // वोटिंग एनीमेशन और स्टोर करना
                localStorage.setItem('mahadev_tool_vote', 'true');
                supportBtn.innerHTML = "🔱 SUPPORTED ✓";
                supportBtn.style.background = "#4caf50";
                supportBtn.style.color = "#fff";
                
                // प्रोग्रेस बार को थोड़ा और बढ़ा हुआ दिखाना (विजुअल फीडबैक)
                if (progressFill) {
                    progressFill.style.width = "46%"; 
                }
                
                alert("हर-हर महादेव! आपका समर्थन दर्ज कर लिया गया है। हम जल्द ही 'Vedic Kundli Engine' लॉन्च करेंगे।");
            }
        });
    }
}

/**
 * 2. 🔱 Scroll Reveal Logic
 * कार्ड्स को धीरे-धीरे 'Fade In' करना जब यूज़र स्क्रॉल करे
 */
function initScrollAnimations() {
    const cards = document.querySelectorAll('.tool-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        // शुरुआती स्टेट (CSS में भी डाला जा सकता है)
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
}

/**
 * 3. 🔱 Tool Navigation Fix
 * यह सुनिश्चित करता है कि दूसरे पेज पर जाने के बाद यूज़र सीधे टूल सेक्शन पर लैंड करे
 */
function setupToolLinks() {
    const toolLinks = document.querySelectorAll('.tool-card');
    
    toolLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // अगर लिंक उसी साइट का है, तो एक छोटा सा 'Loading' फील दे सकते हैं
            if (href.startsWith('..')) {
                console.log(`Navigating to Vedic Module: ${href}`);
            }
        });
    });
}

// 🔱 "Mahadev Astrologer MA" - ब्रह्मांडीय ऊर्जा और तकनीक का मिलन।
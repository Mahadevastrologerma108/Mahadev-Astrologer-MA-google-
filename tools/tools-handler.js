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
                supportBtn.innerHTML
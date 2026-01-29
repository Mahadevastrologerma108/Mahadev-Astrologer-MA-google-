// 1. Paste your Config here
const firebaseConfig = {
    // APNA COPY KIYA HUA CONFIG YAHAN PASTE KAREIN
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. Form Submission Logic
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button');
    btn.innerText = "🔱 SENDING...";
    btn.disabled = true;

    // Data collect karna
    const formData = {
        service: document.getElementById('service-select').value,
        name: document.getElementById('user-name').value,
        dob: document.getElementById('single-dob').value,
        time: document.getElementById('single-time').value,
        place: document.getElementById('single-place').value,
        timestamp: new Date()
    };

    try {
        // 'appointments' naam ke collection mein save hoga
        await db.collection("appointments").add(formData);
        alert("🔱 Pranaam! Your details have been sent to Mahadev Astrologer. We will contact you soon.");
        e.target.reset();
    } catch (error) {
        console.error("Error: ", error);
        alert("Something went wrong. Please try again.");
    } finally {
        btn.innerText = "🔱 PROCEED TO CONSULTATION";
        btn.disabled = false;
    }
});
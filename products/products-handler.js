// ==========================================
// MAHADEV ASTROLOGER MA - SMART STORE ENGINE
// ==========================================

import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 🚩 NAYA JOD: Telegram Bot Keys ke liye config import kar rahe hain
import { remoteConfig, fetchAndActivate, getString } from "../assets/js/firebase-config.js"; 

// Database initialize karein
const db = getFirestore();

// 1. Main Function: Products ko scan karna aur Stock/Enquiry lagana
const initProductsEngine = () => {
    const productCards = document.querySelectorAll('.product-card');
    
    // Check karein ki Admin login hai ya nahi
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    productCards.forEach(card => {
        const titleEl = card.querySelector('.product-title');
        if (!titleEl) return;
        
        const productName = titleEl.innerText; 
        const productId = titleEl.getAttribute('data-key'); 

        // Stock dikhane ke liye Badge banana
        let stockBadge = card.querySelector('.stock-badge');
        if (!stockBadge) {
            stockBadge = document.createElement('div');
            stockBadge.className = 'stock-badge';
            stockBadge.style.margin = "10px 0";
            stockBadge.style.fontSize = "0.9rem";
            stockBadge.style.fontWeight = "600";
            
            const buyBtn = card.querySelector('.buy-btn');
            if (buyBtn) {
                card.insertBefore(stockBadge, buyBtn);
            }
        }

        // 2. Admin Controls: Agar Admin login hai, toh Edit button dikhayein
        if (isAdmin) {
            let editBtn = card.querySelector('.admin-edit-btn');
            if (!editBtn) {
                editBtn = document.createElement('button');
                editBtn.className = 'admin-edit-btn gold-btn-outline';
                editBtn.innerHTML = '⚙️ Edit Stock';
                editBtn.style.marginTop = "15px";
                editBtn.style.width = "100%";
                editBtn.style.fontSize = "0.85rem";
                
                editBtn.onclick = () => updateStockPrompt(productId);
                card.appendChild(editBtn);
            }
        }

        // 3. Enquiry Button Logic (Custom Modal kholna)
        const buyBtn = card.querySelector('.buy-btn');
        if (buyBtn) {
            buyBtn.onclick = (e) => {
                e.preventDefault(); 
                openEnquiryModal(productName); 
            };
        }

        // 4. Real-time Firebase Listener start karna
        listenToStockChanges(productId, stockBadge, buyBtn);
    });
};

// 5. Custom Enquiry Modal (WhatsApp & Telegram Choice)
const openEnquiryModal = (productName) => {
    const existingModal = document.getElementById('enquiry-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'enquiry-modal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:9999; padding:20px;";
    
    const content = document.createElement('div');
    content.style.cssText = "background:#111; border: 1px solid var(--gold); padding:25px; border-radius:15px; width:100%; max-width:400px; text-align:center; position:relative;";
    
    content.innerHTML = `
        <button onclick="document.getElementById('enquiry-modal').remove()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h3 style="color:var(--gold); font-family:'Cinzel', serif; margin-bottom:15px;">Enquire Now</h3>
        <p style="color:#ccc; font-size:0.9rem; margin-bottom:15px;">Product: <strong>${productName}</strong></p>
        
        <input type="text" id="enq-name" placeholder="आपका नाम (Your Name)" style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #444; background:#222; color:#fff;">
        <input type="text" id="enq-phone" placeholder="संपर्क नंबर (Contact Number)" style="width:100%; padding:10px; margin-bottom:20px; border-radius:5px; border:1px solid #444; background:#222; color:#fff;">
        
        <p style="color:#aaa; font-size:0.85rem; margin-bottom:10px;">पूछताछ कहाँ भेजना चाहते हैं?</p>
        
        <div style="display:flex; gap:10px; justify-content:center;">
            <button id="btn-wa" style="flex:1; background:#25D366; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">🟢 WhatsApp</button>
            <button id="btn-tg" style="flex:1; background:#0088cc; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">🔵 Telegram</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('btn-wa').onclick = () => sendEnquiry(productName, 'whatsapp');
    document.getElementById('btn-tg').onclick = () => sendEnquiry(productName, 'telegram');
};

// 6. Platform ke anusar Message bhejna (Secure API Logic)
const sendEnquiry = async (productName, platform) => {
    const name = document.getElementById('enq-name').value.trim();
    const phone = document.getElementById('enq-phone').value.trim();

    if (!name || !phone) {
        alert("प्रणाम! कृपया अपना नाम और संपर्क नंबर अवश्य भरें।");
        return;
    }

    if (platform === 'whatsapp') {
        // 🚩 Aapka diya gaya WhatsApp Link yahan upyog ho raha hai
        const messageText = `🔱 NEW STORE ENQUIRY 🔱\n\n📦 Product: ${productName}\n👤 Name: ${name}\n📞 Contact: ${phone}`;
        const waURL = `https://wa.me/message/VCK5OVBDCN7YK1?text=${encodeURIComponent(messageText)}`;
        window.open(waURL, '_blank');
        document.getElementById('enquiry-modal').remove();
    } 
    else if (platform === 'telegram') {
        const tgBtn = document.getElementById('btn-tg');
        const originalText = tgBtn.innerText;
        tgBtn.innerText = "⏳ Sending...";
        tgBtn.disabled = true;

        const tgMessage = `🔱 <b>NEW STORE ENQUIRY</b> 🔱\n📦 <b>Product:</b> ${productName}\n👤 <b>Name:</b> ${name}\n📞 <b>Contact:</b> ${phone}\n📅 <b>Time:</b> ${new Date().toLocaleString()}`;

        try {
            // Firebase Remote Config se Token nikalna
            await fetchAndActivate(remoteConfig);
            const tgToken = getString(remoteConfig, 'TG_BOT_TOKEN');
            const chatId = getString(remoteConfig, 'TG_CHAT_ID');

            if (tgToken && chatId) {
                // Background mein Telegram Bot ko call lagana
                await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: tgMessage, parse_mode: 'HTML' })
                });
                
                alert("🔱 प्रणाम! आपकी पूछताछ (Enquiry) महादेव एस्ट्रोलॉजर तक पहुँच गई है। हम शीघ्र ही संपर्क करेंगे।");
                document.getElementById('enquiry-modal').remove();
            } else {
                throw new Error("Missing Telegram Keys in Remote Config");
            }
        } catch(e) {
            console.error("TG Send Error:", e);
            alert("❌ नेटवर्क एरर! कृपया WhatsApp का उपयोग करें।");
            tgBtn.innerText = originalText;
            tgBtn.disabled = false;
        }
    }
};

// 7. Firebase se Real-time Stock padhna
const listenToStockChanges = (productId, badgeEl, btnEl) => {
    const docRef = doc(db, "store_inventory", productId);
    
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const stockCount = docSnap.data().stock;
            updateStockUI(stockCount, badgeEl, btnEl);
        } else {
            updateStockUI(99, badgeEl, btnEl);
        }
    });
};

// 8. Stock ke anusar Button aur Text badalna
const updateStockUI = (stock, badgeEl, btnEl) => {
    if (stock > 5) {
        badgeEl.innerHTML = `<span style="color: #4CAF50;">✅ In Stock (उपलब्ध है)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerText = "Enquire Now";
        }
    } 
    else if (stock > 0 && stock <= 5) {
        badgeEl.innerHTML = `<span style="color: #f5c542;">⚠️ Only ${stock} left! (जल्द खरीदें)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerText = "Enquire Now";
        }
    } 
    else if (stock <= 0) {
        badgeEl.innerHTML = `<span style="color: #F44336;">❌ Out of Stock (स्टॉक समाप्त)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "none";
            btnEl.style.opacity = "0.4";
            btnEl.innerText = "Out of Stock";
        }
    }
};

// 9. Admin dwara Stock Update karne ka Prompt
const updateStockPrompt = async (productId) => {
    const newStock = prompt(`Please enter new stock quantity for "${productId}":\n(Type 0 for Out of Stock)`);
    
    if (newStock !== null && !isNaN(newStock) && newStock.trim() !== "") {
        const stockNumber = parseInt(newStock, 10);
        
        try {
            await setDoc(doc(db, "store_inventory", productId), { 
                stock: stockNumber,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            
            alert("✅ Stock updated successfully in Firebase!");
        } catch (error) {
            console.error("Stock Update Error:", error);
            alert("❌ Error: Aapko Admin adhikar (rights) नहीं हैं या Firebase रोक रहा है।");
        }
    }
};

// Page load hone par aur Admin login hone par Engine chalana
window.addEventListener('load', () => {
    setTimeout(initProductsEngine, 1000); 
});

window.addEventListener('adminLoggedIn', () => {
    initProductsEngine();
});

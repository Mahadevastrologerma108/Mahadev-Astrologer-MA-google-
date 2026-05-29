// ==========================================
// MAHADEV ASTROLOGER MA - SMART STORE ENGINE
// ==========================================

import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
        
        const productName = titleEl.innerText; // Jaise: "Gemstones (रत्न)"
        const productId = titleEl.getAttribute('data-key'); // Jaise: "prod_gemstones"

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

        // 3. Enquiry Button Logic (Sabhi users ke liye)
        const buyBtn = card.querySelector('.buy-btn');
        if (buyBtn) {
            // Default link click ko rok kar apna Enquiry system chalana
            buyBtn.onclick = (e) => {
                e.preventDefault(); 
                sendEnquiryToWhatsApp(productName, buyBtn);
            };
        }

        // 4. Real-time Firebase Listener start karna
        listenToStockChanges(productId, stockBadge, buyBtn);
    });
};

// 5. Enquiry Bhejne ka System (WhatsApp)
const sendEnquiryToWhatsApp = (productName, btnEl) => {
    // Grahak se jankari lena
    const userName = prompt("पूछताछ के लिए अपना नाम लिखें (Enter your name):");
    if (!userName) return; // Yadi cancel kar diya

    const userContact = prompt("अपना संपर्क नंबर लिखें (WhatsApp/Phone):");
    if (!userContact) return;

    // ⚠️ YAHAN APNA ASLI WHATSAPP NUMBER DALEIN (Country code ke sath, bina + lagaye)
    const adminWhatsApp = "919999999999"; 

    // Sandesh (Message) tayar karna
    const message = `🔱 *NEW STORE ENQUIRY* 🔱\n\n📦 *Product:* ${productName}\n👤 *Name:* ${userName}\n📞 *Contact:* ${userContact}\n\nPranaam! Mujhe is utpad (product) ke vishay mein jankari chahiye.`;
    
    // WhatsApp ka URL banana
    const waURL = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;

    // Naye tab mein WhatsApp kholna
    window.open(waURL, '_blank');
    
    alert("🔱 प्रणाम! आपकी जानकारी तैयार है, कृपया WhatsApp पर 'Send' दबाएं।");
};

// 6. Firebase se Real-time Stock padhna
const listenToStockChanges = (productId, badgeEl, btnEl) => {
    const docRef = doc(db, "store_inventory", productId);
    
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const stockCount = docSnap.data().stock;
            updateStockUI(stockCount, badgeEl, btnEl);
        } else {
            // Yadi database mein koi data nahi hai, toh stock ko full manenge
            updateStockUI(99, badgeEl, btnEl);
        }
    });
};

// 7. Stock ke anusar Button aur Text badalna
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

// 8. Admin dwara Stock Update karne ka Prompt
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
            alert("❌ Error: Aapko Admin adhikar (rights) nahi hain ya Firebase rok raha hai.");
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

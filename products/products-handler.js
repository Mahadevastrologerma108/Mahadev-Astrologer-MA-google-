// ==========================================
// MAHADEV ASTROLOGER MA - SMART STOCK ENGINE
// ==========================================

import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Database initialize karein
const db = getFirestore();

// 1. Main Function: Products ko scan karna aur Stock UI lagana
const initProductsEngine = () => {
    // Sabhi product cards ko dhundhein
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Product ka Unique ID 'data-key' se nikalna (jaise: prod_gemstones)
        const titleEl = card.querySelector('.product-title');
        if (!titleEl) return;
        const productId = titleEl.getAttribute('data-key'); 

        // Stock dikhane ke liye naya Badge banana
        let stockBadge = card.querySelector('.stock-badge');
        if (!stockBadge) {
            stockBadge = document.createElement('div');
            stockBadge.className = 'stock-badge';
            stockBadge.style.margin = "10px 0";
            stockBadge.style.fontSize = "0.9rem";
            stockBadge.style.fontWeight = "600";
            
            // Buy Button ke theek upar lagana
            const buyBtn = card.querySelector('.buy-btn');
            if (buyBtn) {
                card.insertBefore(stockBadge, buyBtn);
            }
        }

        // 2. Admin Controls: Agar Admin login hai, toh Edit button dikhayein
        // (Yahan hum man rahe hain ki firebase-handler ne window.isAdmin = true set kiya hai)
        if (window.isAdmin === true) {
            let editBtn = card.querySelector('.admin-edit-btn');
            if (!editBtn) {
                editBtn = document.createElement('button');
                editBtn.className = 'admin-edit-btn gold-btn-outline';
                editBtn.innerHTML = '⚙️ Edit Stock';
                editBtn.style.marginTop = "15px";
                editBtn.style.width = "100%";
                editBtn.style.fontSize = "0.85rem";
                
                // Click karne par Stock Update ka prompt aayega
                editBtn.onclick = () => updateStockPrompt(productId);
                card.appendChild(editBtn);
            }
        }

        // 3. Real-time Firebase Listener
        listenToStockChanges(productId, stockBadge, card.querySelector('.buy-btn'));
    });
};

// 4. Firebase se Real-time Stock padhna (Read)
const listenToStockChanges = (productId, badgeEl, btnEl) => {
    const docRef = doc(db, "store_inventory", productId);
    
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const stockCount = docSnap.data().stock;
            updateStockUI(stockCount, badgeEl, btnEl);
        } else {
            // Agar database mein data nahi hai, toh default 'In Stock' manenge
            updateStockUI(99, badgeEl, btnEl);
        }
    });
};

// 5. Stock ke anusar UI ka Rang aur Text badalna
const updateStockUI = (stock, badgeEl, btnEl) => {
    if (stock > 5) {
        // Paryapt (Sufficient) Stock
        badgeEl.innerHTML = `<span style="color: #4CAF50;">✅ In Stock (उपलब्ध है)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerText = "View Collection";
        }
    } 
    else if (stock > 0 && stock <= 5) {
        // Kam Stock (Low Stock Alert)
        badgeEl.innerHTML = `<span style="color: #f5c542;">⚠️ Only ${stock} left! (जल्द खरीदें)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerText = "View Collection";
        }
    } 
    else if (stock <= 0) {
        // Out of Stock
        badgeEl.innerHTML = `<span style="color: #F44336;">❌ Out of Stock (स्टॉक समाप्त)</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "none"; // Button kaam nahi karega
            btnEl.style.opacity = "0.4"; // Button dhundhla ho jayega
            btnEl.innerText = "Out of Stock";
        }
    }
};

// 6. Admin dwara Stock Update karne ka Prompt (Write)
const updateStockPrompt = async (productId) => {
    const newStock = prompt(`Please enter new stock quantity for "${productId}":\n(Type 0 for Out of Stock)`);
    
    // Yadi Admin ne number dala hai
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
            alert("❌ Error: Aapko Admin rights nahi hain ya Firebase rules block kar rahe hain.");
        }
    }
};

// Jab Page poori tarah Load ho jaye tab Engine Start karein
window.addEventListener('load', () => {
    // Firebase Auth ko apna samay lene ke liye thoda ruk (delay) kar chalayenge
    setTimeout(initProductsEngine, 1000); 
});

// Yadi aapka firebase-handler.js login ke baad koi event bhejta hai:
window.addEventListener('adminStatusReady', () => {
    initProductsEngine();
});

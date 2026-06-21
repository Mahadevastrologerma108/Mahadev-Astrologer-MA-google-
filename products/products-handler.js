// ==========================================
// MAHADEV ASTROLOGER MA - SMART STORE ENGINE
// ==========================================

import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { remoteConfig, fetchAndActivate, getString } from "../assets/js/firebase-config.js"; 

const db = getFirestore();

// 1. Main Function
const initProductsEngine = () => {
    const productCards = document.querySelectorAll('.product-card');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    productCards.forEach(card => {
        const titleEl = card.querySelector('.product-title');
        if (!titleEl) return;
        
        const productName = titleEl.innerText; 
        const productId = titleEl.getAttribute('data-key'); 

        // Stock Badge
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

        // 2. Admin Controls
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

        // 3. Enquiry Button Logic
        const buyBtn = card.querySelector('.buy-btn');
        if (buyBtn) {
            buyBtn.onclick = (e) => {
                e.preventDefault(); 
                openEnquiryModal(productName); 
            };
        }

        // 4. Real-time Firebase Listener
        listenToStockChanges(productId, stockBadge, buyBtn);
    });
};

// 5. Custom Enquiry Modal (V-MAX Compliant)
const openEnquiryModal = (productName) => {
    const existingModal = document.getElementById('enquiry-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'enquiry-modal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:9999; padding:20px;";
    
    const content = document.createElement('div');
    content.style.cssText = "background:#111; border: 1px solid var(--gold); padding:25px; border-radius:15px; width:100%; max-width:400px; text-align:center; position:relative;";
    
    // 🚩 V-MAX data-keys added for translation
    content.innerHTML = `
        <button onclick="document.getElementById('enquiry-modal').remove()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h3 style="color:var(--gold); font-family:'Cinzel', serif; margin-bottom:15px;" data-key="enq_title">Enquire Now</h3>
        <p style="color:#ccc; font-size:0.9rem; margin-bottom:15px;"><span data-key="enq_prod_lbl">Product:</span> <strong>${productName}</strong></p>
        
        <input type="text" id="enq-name" data-key="ph_name" placeholder="Your Name" style="width:100%; padding:10px; margin-bottom:15px; border-radius:5px; border:1px solid #444; background:#222; color:#fff;">
        <input type="text" id="enq-phone" data-key="ph_phone" placeholder="Contact Number" style="width:100%; padding:10px; margin-bottom:20px; border-radius:5px; border:1px solid #444; background:#222; color:#fff;">
        
        <p style="color:#aaa; font-size:0.85rem; margin-bottom:10px;" data-key="enq_where_lbl">Where do you want to send the enquiry?</p>
        
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
        alert("Please fill your Name and Contact Number.");
        return;
    }

    if (platform === 'whatsapp') {
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
            await fetchAndActivate(remoteConfig);
            const tgToken = getString(remoteConfig, 'TG_BOT_TOKEN');
            const chatId = getString(remoteConfig, 'TG_CHAT_ID');

            if (tgToken && chatId) {
                await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: tgMessage, parse_mode: 'HTML' })
                });
                
                alert("🔱 Enquiry Sent! Mahadev Astrologer MA will contact you shortly.");
                document.getElementById('enquiry-modal').remove();
            } else {
                throw new Error("Missing Telegram Keys in Remote Config");
            }
        } catch(e) {
            console.error("TG Send Error:", e);
            alert("❌ Network Error! Please use WhatsApp.");
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

// 8. Stock ke anusar Button aur Text badalna (V-MAX Compliant)
const updateStockUI = (stock, badgeEl, btnEl) => {
    // 🚩 V-MAX data-keys added inside the badge innerHTML
    if (stock > 5) {
        badgeEl.innerHTML = `<span style="color: #4CAF50;" data-key="stock_in">✅ In Stock</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerHTML = `<span data-key="btn_enquire">Enquire Now</span>`;
        }
    } 
    else if (stock > 0 && stock <= 5) {
        badgeEl.innerHTML = `<span style="color: #f5c542;"><span data-key="stock_low">⚠️ Only</span> ${stock} <span data-key="stock_left">left!</span></span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "auto";
            btnEl.style.opacity = "1";
            btnEl.innerHTML = `<span data-key="btn_enquire">Enquire Now</span>`;
        }
    } 
    else if (stock <= 0) {
        badgeEl.innerHTML = `<span style="color: #F44336;" data-key="stock_out">❌ Out of Stock</span>`;
        if (btnEl) {
            btnEl.style.pointerEvents = "none";
            btnEl.style.opacity = "0.4";
            btnEl.innerHTML = `<span data-key="btn_out_stock">Out of Stock</span>`;
        }
    }
};

// 9. Admin dwara Stock Update
const updateStockPrompt = async (productId) => {
    const newStock = prompt(`Please enter new stock quantity for "${productId}":\n(Type 0 for Out of Stock)`);
    
    if (newStock !== null && !isNaN(newStock) && newStock.trim() !== "") {
        const stockNumber = parseInt(newStock, 10);
        
        try {
            await setDoc(doc(db, "store_inventory", productId), { 
                stock: stockNumber,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            
            alert("✅ Stock updated successfully!");
        } catch (error) {
            console.error("Stock Update Error:", error);
            alert("❌ Error: You lack Admin rights or Firebase denied permission.");
        }
    }
};

window.addEventListener('load', () => {
    setTimeout(initProductsEngine, 1000); 
});

window.addEventListener('adminLoggedIn', () => {
    initProductsEngine();
});

// --- 1. TRANSLATION & LAYOUT (Aapka Purana Shaktishali Code) ---
window.updateUI = function() {
    const lang = localStorage.getItem('preferredLang') || 'en';
    const t = window.translations;
    if (!t || !t[lang]) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[lang][key]) el.innerHTML = t[lang][key];
    });

    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (t[lang][key]) el.placeholder = t[lang][key];
    });

    const btnText = document.getElementById('lang-text');
    if (btnText) btnText.innerText = (lang === 'en') ? 'हिंदी / Eng' : 'Eng / हिंदी';
    
    // 🔱 Form ko bhi refresh karo language ke hisab se
    if(typeof applyFormLogic === 'function') applyFormLogic();
};

async function loadLayout() {
    try {
        const hResp = await fetch('/header.html');
        const fResp = await fetch('/footer.html');
        if (hResp.ok && fResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await hResp.text();
            document.getElementById('footer-placeholder').innerHTML = await fResp.text();
            window.updateUI();
        }
    } catch (e) { console.log("Layout error:", e); }
}

window.toggleLanguage = function() {
    let current = localStorage.getItem('preferredLang') || 'en';
    localStorage.setItem('preferredLang', current === 'en' ? 'hi' : 'en');
    location.reload(); 
};

// --- 2. DYNAMIC FORM LOGIC (Naya Sudarshan Logic) ---
window.applyFormLogic = function() {
    const svc = document.getElementById('service-select')?.value;
    if(!svc) return;

    const singleSec = document.getElementById('section-single');
    const matchingSec = document.getElementById('section-matching');
    const palmInst = document.getElementById('palm-instruction');
    const birthFields = document.getElementById('birth-fields');
    const timePlaceGroup = document.getElementById('time-place-group');

    const sDob = document.getElementById('single-dob');
    const sTime = document.getElementById('single-time');
    const sPlace = document.getElementById('single-place');

    // Reset UI
    if(singleSec) singleSec.style.display = 'block';
    if(matchingSec) matchingSec.style.display = 'none';
    if(palmInst) palmInst.style.display = 'none';
    if(birthFields) birthFields.style.display = 'block';
    if(timePlaceGroup) timePlaceGroup.style.display = 'grid';

    // Validation Reset
    [sDob, sTime, sPlace].forEach(el => { if(el) el.required = false; });

    // Logic Switch
    if (svc === 'kundli_making') {
        [sDob, sTime, sPlace].forEach(el => { if(el) el.required = true; });
    } else if (svc === 'kundli_matching') {
        if(singleSec) singleSec.style.display = 'none';
        if(matchingSec) matchingSec.style.display = 'block';
    } else if (svc === 'palmistry') {
        if(birthFields) birthFields.style.display = 'none';
        if(palmInst) palmInst.style.display = 'block';
    } else if (svc === 'numerology') {
        if(timePlaceGroup) timePlaceGroup.style.display = 'none';
        if(sDob) sDob.required = true;
    } else if (svc === 'combo_analysis') {
        if(palmInst) palmInst.style.display = 'block';
        [sDob, sTime, sPlace].forEach(el => { if(el) el.required = true; });
    }
};

// WhatsApp Submit Function
window.handleDivineSubmit = function(e) {
    e.preventDefault();
    const svc = document.getElementById('service-select').value;
    const name = document.getElementById('user-name').value;
    const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
    const contactDetail = document.getElementById('contact-detail').value;
    
    let msg = `🔱 *New Consultation Request* 🔱%0A`;
    msg += `Service: ${svc.toUpperCase()}%0A`;
    msg += `Client: ${name}%0A`;
    msg += `Contact: ${contactMethod} (${contactDetail})`;
    
    // Yahan aap apna WhatsApp number daal dena
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
};

// --- 3. EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    document.getElementById('consultation-form')?.addEventListener('submit', window.handleDivineSubmit);
});

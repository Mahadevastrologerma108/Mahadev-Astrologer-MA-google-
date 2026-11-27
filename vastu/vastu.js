// ==========================================
// MAHADEV ASTROLOGER MA - VASTU ENGINE
// Secure callable backend + Firestore + Telegram
// ==========================================

import { functions } from '../assets/js/firebase-config.js';
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";

/* =========================================================
   1. FORM CONFIGURATION & STATE
========================================================= */

let isSubmitting = false;
let activeSubmissionId = null;
let activeSubmissionFingerprint = null;
const submitVastuConsultation = httpsCallable(functions, 'submitVastuConsultation');
const PROPERTY_TYPES = ['Residential', 'Commercial', 'Industrial'];
const FACING_DIRECTIONS = ['North', 'South', 'East', 'West'];
const WHATSAPP_SHORT_LINK = 'https://wa.me/message/VCK5OVBDCN7YK1';

/* =========================================================
   2. INPUT NORMALIZATION & CLIENT VALIDATION
   Server performs the authoritative validation again.
========================================================= */

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFKC')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function validateFormData(data) {
    if (data.name.length < 2 || data.name.length > 80) {
        return 'Please enter a name between 2 and 80 characters.';
    }
    if (!PROPERTY_TYPES.includes(data.propertyType)) {
        return 'Please select a valid property type.';
    }
    if (!FACING_DIRECTIONS.includes(data.facing)) {
        return 'Please select a valid entrance direction.';
    }
    if (data.issue.length < 5 || data.issue.length > 1200) {
        return 'Please describe the issue in 5 to 1200 characters.';
    }
    return '';
}

function getFormData(form) {
    return {
        name: normalizeText(form.querySelector('#userName')?.value),
        propertyType: normalizeText(form.querySelector('#propertyType')?.value),
        facing: normalizeText(form.querySelector('#facing')?.value),
        issue: normalizeText(form.querySelector('#issue')?.value),
        website: normalizeText(form.querySelector('[name="website"]')?.value)
    };
}

/* =========================================================
   3. UI STATE UTILITIES
========================================================= */

function setSubmitting(button, status, submitting) {
    if (button) {
        button.disabled = submitting;
        button.textContent = submitting ? 'SUBMITTING... 🔱' : 'SUBMIT DETAILS 🔱';
        button.style.opacity = submitting ? '0.7' : '1';
    }
    if (status) status.setAttribute('aria-live', 'polite');
}

function showStatus(status, message, type = 'info') {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = type;
}

function makeSubmissionId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/* =========================================================
   4. WHATSAPP HANDOFF
========================================================= */

function buildWhatsAppURL(data) {
    const message = encodeURIComponent(
`🔱 Vastu Audit Request 🔱

Name: ${data.name}
Property: ${data.propertyType}
Facing: ${data.facing}

Issue:
${data.issue}`
    );
    return `${WHATSAPP_SHORT_LINK}?text=${message}`;
}

/* =========================================================
   5. FORM SUBMISSION ENGINE
========================================================= */

function initializeVastuForm() {
    const form = document.getElementById('vastuConsultForm');
    if (!form || form.dataset.engineInitialized === 'true') return;
    form.dataset.engineInitialized = 'true';

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        const data = getFormData(form);
        const validationMessage = validateFormData(data);
        if (validationMessage) {
            showStatus(status, validationMessage, 'error');
            return;
        }

        // A honeypot value is silently rejected by the backend.
        // Do not send the honeypot field as user content.
        const fingerprint = JSON.stringify({ name: data.name, propertyType: data.propertyType, facing: data.facing, issue: data.issue });
        if (!activeSubmissionId || activeSubmissionFingerprint !== fingerprint) {
            activeSubmissionId = makeSubmissionId();
            activeSubmissionFingerprint = fingerprint;
        }
        const submissionId = activeSubmissionId;
        isSubmitting = true;
        setSubmitting(submitButton, status, true);
        showStatus(status, 'Securely submitting your Vastu enquiry...', 'loading');

        try {
            const result = await submitVastuConsultation({
                submissionId,
                name: data.name,
                propertyType: data.propertyType,
                facing: data.facing,
                issue: data.issue,
                website: data.website
            });

            const notificationSent = result.data?.notificationStatus === 'sent';
            activeSubmissionId = null;
            activeSubmissionFingerprint = null;
            showStatus(
                status,
                notificationSent
                    ? 'Pranaam! Your Vastu enquiry has been received successfully. 🔱'
                    : 'Your enquiry is safely received. Our notification system will retry shortly. 🔱',
                'success'
            );

            const whatsappURL = buildWhatsAppURL(data);
            form.reset();

            // Let the user read the confirmation before opening WhatsApp.
            window.setTimeout(() => {
                window.location.assign(whatsappURL);
            }, 1600);

        } catch (error) {
            console.error('Vastu submission failed:', error);
            const message = error?.code === 'functions/resource-exhausted'
                ? 'Too many requests. Please try again later.'
                : ['functions/failed-precondition', 'functions/permission-denied', 'functions/unauthenticated'].includes(error?.code)
                    ? 'Security verification is not ready. Please contact us on WhatsApp.'
                    : 'We could not submit your enquiry. Please try again or contact us on WhatsApp.';
            showStatus(status, message, 'error');
        } finally {
            isSubmitting = false;
            setSubmitting(submitButton, status, false);
        }
    });
}

/* =========================================================
   6. SAFE STARTUP
========================================================= */

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVastuForm, { once: true });
} else {
    initializeVastuForm();
}

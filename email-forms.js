/**
 * EmailJS integration for Contact, Referral, and Employment forms.
 * Emails are sent to the address you set as "To email" in each EmailJS template (use northernriverteam@gmail.com).
 *
 * SETUP:
 * 1. Get your User ID: EmailJS Dashboard > Account (or Personal Settings) > API Keys. Copy your "Public Key".
 * 2. Replace YOUR_EMAILJS_USER_ID below with that key (e.g. "AbCdEfGhIjKlMnOpQ" or "user_xxxx").
 * 3. In each template (Contact Us, Referral, Employment): Content tab > set "To email" to northernriverteam@gmail.com.
 * 4. Contact template (template_0pviivi) is used for BOTH Contact and Employment; differentiate by {{formType}} (Contact / Employment). See email-template-contact-and-employment.html for the combined template content.
 * 5. Create Referral template; use variables from the code below. Replace template_REFERRAL with your real template ID.
 */
(function() {
    var EMAILJS_USER_ID = 'V_PLyK77tSrg1iAZw';
    var SERVICE_ID = 'service_l7o4gho';
    var CONTACT_TEMPLATE_ID = 'template_0pviivi';   // Used for both Contact and Employment (differentiate via formType)
    var REFERRAL_TEMPLATE_ID = 'template_0lr4bn8';

    var BUDGET_LABELS = {
        'under-7500': 'Under $7,500',
        '7500-20000': '$7,500 – $20,000',
        '20000-50000': '$20,000 – $50,000',
        '50000-100000': '$50,000 – $100,000',
        '100000-250000': '$100,000 – $250,000',
        '250000-plus': '$250,000+',
        'not-sure': 'Not sure yet'
    };
    var TIMELINE_LABELS = {
        'asap': 'ASAP / within 1 month',
        '1-3-months': '1–3 months',
        '3-6-months': '3–6 months',
        '6-12-months': '6–12 months',
        'planning': 'Planning ahead / flexible',
        'timeline-not-sure': 'Not sure yet'
    };
    var PROPERTY_LABELS = {
        'single-family': 'Single-family home',
        'townhome-condo': 'Townhome / condo',
        'estate': 'Estate / large residential',
        'commercial': 'Commercial',
        'property-other': 'Other',
        'property-not-sure': 'Not sure'
    };

    function labelFromMap(map, value) {
        if (!value) return '';
        return map[value] || value;
    }

    function showMessage(form, message, isError) {
        var existingInline = form.querySelector('.form-emailjs-message');
        if (existingInline) existingInline.remove();
        var existingToast = document.getElementById('emailjs-toast');
        if (existingToast) existingToast.remove();

        var toast = document.createElement('div');
        toast.id = 'emailjs-toast';
        toast.setAttribute('role', 'alert');
        toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:99999;' +
            'padding:14px 24px;border-radius:10px;font-size:15px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.2);' +
            'max-width:90%;text-align:center;animation:emailjs-toast-in 0.3s ease;';
        toast.style.background = isError ? '#d32f2f' : '#2e7d32';
        toast.style.color = '#fff';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.style.animation = 'emailjs-toast-out 0.3s ease';
            setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
        }, 5000);

        var style = document.createElement('style');
        style.id = 'emailjs-toast-styles';
        if (!document.getElementById('emailjs-toast-styles')) {
            style.textContent = '@keyframes emailjs-toast-in{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}' +
                '@keyframes emailjs-toast-out{from{opacity:1}to{opacity:0}}';
            document.head.appendChild(style);
        }
    }

    function bindContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var serviceType = document.getElementById('contactServiceType').value;
            var otherService = document.getElementById('contactOtherServiceType');
            var budgetVal = document.getElementById('contactEstimatedBudget').value;
            var timelineVal = document.getElementById('contactProjectTimeline').value;
            var propertyVal = document.getElementById('contactPropertyType').value;
            var templateParams = {
                formType: 'Contact',
                fullName: document.getElementById('contactFullName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                projectAddress: document.getElementById('contactProjectAddress').value.trim(),
                serviceType: serviceType,
                otherServiceType: otherService ? otherService.value.trim() : '',
                estimatedBudget: labelFromMap(BUDGET_LABELS, budgetVal),
                projectTimeline: labelFromMap(TIMELINE_LABELS, timelineVal),
                propertyType: labelFromMap(PROPERTY_LABELS, propertyVal),
                contactMethod: document.getElementById('contactMethod').value,
                contactTime: document.getElementById('contactTime').value,
                projectDetails: document.getElementById('contactProjectDetails').value.trim(),
                firstName: '', lastName: '', employmentPhone: '', employmentEmail: '', serviceInterest: '', bestDescribes: '', message: '', textConsent: ''
            };
            var btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
            if (typeof emailjs === 'undefined') {
                showMessage(form, 'Email service not loaded. Please refresh the page.', true);
                if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
                return;
            }
            emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams)
                .then(function() {
                    showMessage(form, 'Thank you! We will get back to you within 1-2 business days.');
                    form.reset();
                    var otherGroup = document.getElementById('otherServiceTypeGroup');
                    if (otherGroup) otherGroup.style.display = 'none';
                })
                .catch(function(err) {
                    console.error('EmailJS Contact error:', err);
                    showMessage(form, 'Something went wrong. Please call us at 201-780-6344 or try again later.', true);
                })
                .finally(function() {
                    if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
                });
        });
    }

    function bindReferralForm() {
        var form = document.getElementById('referralForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var templateParams = {
                referrerName: document.getElementById('referrerName').value.trim(),
                referrerEmail: document.getElementById('referrerEmail').value.trim(),
                referrerPhone: document.getElementById('referrerPhone').value.trim(),
                referredName: document.getElementById('referredName').value.trim(),
                referredEmail: document.getElementById('referredEmail').value.trim(),
                referredPhone: document.getElementById('referredPhone').value.trim(),
                referralNotes: document.getElementById('referralNotes').value.trim()
            };
            var btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
            if (typeof emailjs === 'undefined') {
                showMessage(form, 'Email service not loaded. Please refresh the page.', true);
                if (btn) { btn.disabled = false; btn.textContent = 'Submit Referral'; }
                return;
            }
            emailjs.send(SERVICE_ID, REFERRAL_TEMPLATE_ID, templateParams)
                .then(function() {
                    showMessage(form, 'Thank you! Your referral has been submitted. Your $170 credit applies after their project is complete.');
                    form.reset();
                })
                .catch(function(err) {
                    console.error('EmailJS Referral error:', err);
                    showMessage(form, 'Something went wrong. Please call us at 201-780-6344 or try again later.', true);
                })
                .finally(function() {
                    if (btn) { btn.disabled = false; btn.textContent = 'Submit Referral'; }
                });
        });
    }

    function bindWorkForm() {
        var form = document.getElementById('workForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var textConsent = document.getElementById('textConsent');
            var templateParams = {
                formType: 'Employment',
                fullName: '', email: '', phone: '', projectAddress: '', serviceType: '', otherServiceType: '', estimatedBudget: '', projectTimeline: '', propertyType: '', contactMethod: '', contactTime: '', projectDetails: '',
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                employmentPhone: document.getElementById('phone').value.trim(),
                employmentEmail: document.getElementById('email').value.trim(),
                serviceInterest: document.getElementById('serviceInterest').value,
                bestDescribes: document.getElementById('bestDescribes').value,
                message: document.getElementById('message').value.trim(),
                textConsent: textConsent && textConsent.checked ? 'Yes' : 'No'
            };
            var btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
            if (typeof emailjs === 'undefined') {
                showMessage(form, 'Email service not loaded. Please refresh the page.', true);
                if (btn) { btn.disabled = false; btn.textContent = 'SUBMIT'; }
                return;
            }
            emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams)
                .then(function() {
                    showMessage(form, 'Thank you for your interest! We will contact you soon.');
                    form.reset();
                })
                .catch(function(err) {
                    console.error('EmailJS Employment error:', err);
                    showMessage(form, 'Something went wrong. Please call us at 201-780-6344 or try again later.', true);
                })
                .finally(function() {
                    if (btn) { btn.disabled = false; btn.textContent = 'SUBMIT'; }
                });
        });
    }

    function init() {
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS library not loaded. Check that email.min.js loads before email-forms.js.');
            bindContactForm();
            bindReferralForm();
            bindWorkForm();
            return;
        }
        if (!EMAILJS_USER_ID || EMAILJS_USER_ID === 'YOUR_EMAILJS_USER_ID') {
            console.error('EmailJS: Set your User ID in email-forms.js (get it from dashboard.emailjs.com)');
            bindContactForm();
            bindReferralForm();
            bindWorkForm();
            return;
        }
        emailjs.init({ publicKey: EMAILJS_USER_ID });
        bindContactForm();
        bindReferralForm();
        bindWorkForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

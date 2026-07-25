/**
 * Ruqya Center — Booking Multi-Step Form (Vanilla JS)
 * Ported from the 849-line React booking page.
 *
 * Flow:
 * Step 0 → Service type selection (urgent/normal)
 * Step 1 → Patient information form
 * Step 2 → Date & time slot selection
 * Step 3 → Review & confirm
 */
(function() {
    'use strict';

    /* ── Config & State ───────────────────────────── */
    var API = ruqyaBooking.apiBase;
    var HOME = ruqyaBooking.homeUrl;

    var state = {
        step: 0,
        consultType: '',       // 'urgent' or 'normal'
        serviceId: null,       // UUID of the chosen service
        serviceName: '',
        servicePrice: null,
        // Patient info
        email: '',
        name: '',
        gender: '',
        age: '',
        nationality: '',
        country: '',
        marital: '',
        previous: '',
        canTravel: '',
        needType: '',
        countryCode: '+90',
        phone: '',
        // Date/time
        slots: [],
        selectedDate: '',
        selectedSlotId: null,
        selectedSlot: null,
        agreed: false,
        submitting: false
    };

    var STEPS = 4;
    var dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    var monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

    /* ── DOM References ────────────────────────────── */
    var $stepper, $steps, $btnPrev, $btnNext, $btnSubmit;
    var $wrapper, $success, $error;

    function init() {
        $stepper   = document.getElementById('booking-stepper');
        $steps     = document.querySelectorAll('.booking-step');
        $btnPrev   = document.getElementById('btn-prev');
        $btnNext   = document.getElementById('btn-next');
        $btnSubmit = document.getElementById('btn-submit');
        $wrapper   = document.getElementById('booking-form-wrapper');
        $success   = document.getElementById('booking-success');
        $error     = document.getElementById('booking-error');

        if (!$wrapper) return; // Not on booking page

        setupServiceOptions();
        setupEventListeners();
        updateStepper();
        validateStep();
    }

    /* ── Service Options (Step 0) ─────────────────── */
    function setupServiceOptions() {
        // Dynamic options rendered by PHP, nothing to setup manually
    }

    /* ── Event Listeners ──────────────────────────── */
    function setupEventListeners() {
        // Service type selection
        document.querySelectorAll('.booking-option input[name="consultation_type"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                var label = this.closest('.booking-option');
                state.consultType = label.dataset.consultType || this.value;
                state.serviceId = label.dataset.serviceId || null;
                state.serviceName = label.dataset.serviceName || '';
                state.servicePrice = label.dataset.servicePrice || '';
                validateStep();
            });
        });

        // Nav buttons
        $btnPrev.addEventListener('click', prevStep);
        $btnNext.addEventListener('click', nextStep);
        $btnSubmit.addEventListener('click', submitBooking);

        // Form inputs for validation
        ['b-email', 'b-name', 'b-gender', 'b-phone'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('input', function() { validateStep(); });
        });

        // Gender select
        var genderEl = document.getElementById('b-gender');
        if (genderEl) genderEl.addEventListener('change', function() { validateStep(); });

        // Country code
        var ccEl = document.getElementById('b-country-code');
        if (ccEl) ccEl.addEventListener('change', function() {
            state.countryCode = this.value;
        });

        // Terms checkbox
        var agreeEl = document.getElementById('b-agree');
        if (agreeEl) agreeEl.addEventListener('change', function() {
            state.agreed = this.checked;
            validateStep();
        });

        // Travel radio
        document.querySelectorAll('input[name="can_travel"]').forEach(function(r) {
            r.addEventListener('change', function() { state.canTravel = this.value; });
        });
    }

    /* ── Step Navigation ──────────────────────────── */
    function goToStep(n) {
        if (n < 0 || n >= STEPS) return;

        // Collect data before leaving step 1
        if (state.step === 1) collectFormData();

        state.step = n;

        // Show/hide steps
        $steps.forEach(function(el, i) {
            el.style.display = i === n ? 'block' : 'none';
        });

        // Update buttons
        $btnPrev.style.display = n > 0 ? 'inline-flex' : 'none';
        $btnNext.style.display = n < STEPS - 1 ? 'inline-flex' : 'none';
        $btnSubmit.style.display = n === STEPS - 1 ? 'inline-flex' : 'none';

        updateStepper();
        validateStep();

        // Load data for specific steps
        if (n === 2) loadSlots();
        if (n === 3) buildReview();

        // Scroll to top of form
        $wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function nextStep() { goToStep(state.step + 1); }
    function prevStep() { goToStep(state.step - 1); }

    function updateStepper() {
        var stepEls = $stepper.querySelectorAll('.stepper-step');
        stepEls.forEach(function(el, i) {
            el.classList.remove('active', 'completed');
            if (i === state.step) el.classList.add('active');
            if (i < state.step) el.classList.add('completed');
        });
    }

    /* ── Validation ───────────────────────────────── */
    function validateStep() {
        var valid = false;

        switch (state.step) {
            case 0:
                valid = state.consultType !== '';
                break;
            case 1:
                var email  = document.getElementById('b-email');
                var name   = document.getElementById('b-name');
                var gender = document.getElementById('b-gender');
                var phone  = document.getElementById('b-phone');
                valid = (email && email.value.includes('@')) &&
                        (name && name.value.trim().length > 1) &&
                        (gender && gender.value !== '') &&
                        (phone && phone.value.trim().length > 5);
                break;
            case 2:
                valid = state.selectedSlotId !== null;
                break;
            case 3:
                valid = state.agreed && !state.submitting;
                break;
        }

        if (state.step < STEPS - 1) {
            $btnNext.disabled = !valid;
        } else {
            $btnSubmit.disabled = !valid;
        }
    }

    /* ── Collect Form Data ────────────────────────── */
    function collectFormData() {
        state.email       = val('b-email');
        state.name        = val('b-name');
        state.gender      = val('b-gender');
        state.age         = val('b-age');
        state.nationality = val('b-nationality');
        state.country     = val('b-country');
        state.marital     = val('b-marital');
        state.previous    = val('b-previous');
        state.needType    = val('b-need-type');
        state.countryCode = val('b-country-code');
        state.phone       = val('b-phone');
    }

    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    /* ── Load Available Slots (Step 2) ────────────── */
    function loadSlots() {
        var loading = document.getElementById('dates-loading');
        var noD     = document.getElementById('no-dates');
        var grid    = document.getElementById('dates-grid');
        var tSec    = document.getElementById('times-section');

        loading.style.display = 'block';
        noD.style.display     = 'none';
        grid.style.display    = 'none';
        tSec.style.display    = 'none';

        // Reset
        state.selectedDate   = '';
        state.selectedSlotId = null;
        state.selectedSlot   = null;

        var url = API + 'slots?service_id=' + encodeURIComponent(state.serviceId);
        if (state.consultType === 'urgent') url += '&urgent=1';

        fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            loading.style.display = 'none';
            state.slots = data.slots || data || [];

            if (!state.slots.length) {
                noD.style.display = 'block';
                return;
            }

            // Group by date
            var dates = {};
            state.slots.forEach(function(s) {
                var d = s.slot_date;
                if (!dates[d]) dates[d] = [];
                dates[d].push(s);
            });

            // Build date cards
            var dateKeys = Object.keys(dates).sort();
            grid.innerHTML = '';
            grid.style.display = 'grid';

            dateKeys.forEach(function(dateStr) {
                var dt = new Date(dateStr + 'T00:00:00');
                var card = document.createElement('div');
                card.className = 'date-card';
                card.dataset.date = dateStr;
                card.innerHTML =
                    '<div class="day-name">' + dayNames[dt.getDay()] + '</div>' +
                    '<div class="day-num">' + dt.getDate() + '</div>' +
                    '<div class="month">' + monthNames[dt.getMonth()] + '</div>';

                card.addEventListener('click', function() {
                    selectDate(dateStr, dates[dateStr]);
                    // Highlight
                    grid.querySelectorAll('.date-card').forEach(function(c) { c.classList.remove('selected'); });
                    card.classList.add('selected');
                });
                grid.appendChild(card);
            });

            validateStep();
        })
        .catch(function(err) {
            loading.style.display = 'none';
            noD.style.display = 'block';
            console.error('Failed to load slots:', err);
        });
    }

    function selectDate(dateStr, slots) {
        state.selectedDate   = dateStr;
        state.selectedSlotId = null;
        state.selectedSlot   = null;
        validateStep();

        var tSec  = document.getElementById('times-section');
        var tGrid = document.getElementById('times-grid');
        var tTitle = document.getElementById('times-title');

        var dt = new Date(dateStr + 'T00:00:00');
        tTitle.textContent = 'المواعيد المتاحة يوم ' + dayNames[dt.getDay()] + ' ' + dt.getDate() + ' ' + monthNames[dt.getMonth()];

        tGrid.innerHTML = '';
        tSec.style.display = 'block';

        slots.forEach(function(slot) {
            var div = document.createElement('div');
            div.className = 'time-slot';
            div.dataset.slotId = slot.id;

            var start = (slot.start_time || '').substring(0, 5);
            var end   = (slot.end_time || '').substring(0, 5);
            var healer = slot.healers ? (slot.healers.display_name || '') : '';

            div.innerHTML = '<div>' + start + ' - ' + end + '</div>' +
                (healer ? '<div class="healer-name">' + healer + '</div>' : '');

            div.addEventListener('click', function() {
                state.selectedSlotId = slot.id;
                state.selectedSlot   = slot;
                validateStep();
                tGrid.querySelectorAll('.time-slot').forEach(function(t) { t.classList.remove('selected'); });
                div.classList.add('selected');
            });

            tGrid.appendChild(div);
        });
    }

    /* ── Build Review (Step 3) ────────────────────── */
    function buildReview() {
        var container = document.getElementById('review-details');
        var genderLabel = state.gender === 'male' ? 'ذكر' : state.gender === 'female' ? 'أنثى' : '';
        var typeLabel   = state.consultType === 'urgent' ? 'مستعجلة' : 'عادية';
        var maritalMap  = { single: 'أعزب/عزباء', married: 'متزوج/ة', divorced: 'منفصل/ة', widowed: 'أرمل/ة' };
        var needMap     = { initial: 'توجيه أولي وتقييم للحالة', special: 'حالتي تحتاج متابعة خاصة', unsure: 'غير متأكد وأحتاج رأي المختص' };
        var travelLabel = state.canTravel === 'true' ? 'نعم' : state.canTravel === 'false' ? 'لا' : '—';

        var slotDate = '';
        var slotTime = '';
        var healer   = '';
        if (state.selectedSlot) {
            slotDate = state.selectedSlot.slot_date || '';
            var st   = (state.selectedSlot.start_time || '').substring(0, 5);
            var et   = (state.selectedSlot.end_time || '').substring(0, 5);
            slotTime = st + ' - ' + et;
            healer   = state.selectedSlot.healers ? (state.selectedSlot.healers.display_name || '') : '';
        }

        var rows = [
            [ 'الخدمة', state.serviceName ],
            [ 'التاريخ', slotDate ],
            [ 'الوقت', slotTime ],
            [ 'المعالج', healer || '—' ],
            [ 'الاسم', state.name ],
            [ 'البريد', state.email ],
            [ 'الواتساب', state.countryCode + state.phone ],
            [ 'الجنس', genderLabel ],
            [ 'الجنسية', state.nationality || '—' ],
            [ 'الإقامة', state.country || '—' ],
            [ 'الحالة الاجتماعية', maritalMap[state.marital] || '—' ],
            [ 'إمكانية السفر', travelLabel ],
            [ 'وصف الحاجة', needMap[state.needType] || '—' ],
            [ 'التجربة السابقة والأعراض', state.previous || '—' ],
        ];

        container.innerHTML = rows.map(function(r) {
            return '<div class="review-row"><div class="review-label">' + r[0] + '</div><div class="review-value">' + escHtml(r[1]) + '</div></div>';
        }).join('');
    }

    /* ── Submit Booking ───────────────────────────── */
    function submitBooking() {
        if (state.submitting) return;
        state.submitting = true;
        $btnSubmit.disabled = true;
        $btnSubmit.innerHTML = 'جاري الحجز...';
        $error.style.display = 'none';

        var fullPhone = state.countryCode + state.phone;

        var body = {
            service_id:        state.serviceId,
            slot_id:           state.selectedSlotId,
            patient_name:      state.name,
            patient_email:     state.email,
            patient_phone:     fullPhone,
            gender:            state.gender,
            age:               state.age ? parseInt(state.age) : null,
            nationality:       state.nationality,
            country:           state.country,
            marital_status:    state.marital,
            patient_notes:     state.previous,
            can_travel:        state.canTravel === 'true',
            need_type:         state.needType,
            consultation_type: state.consultType
        };

        fetch(API + 'bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce':   ruqyaBooking.nonce
            },
            body: JSON.stringify(body)
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
            state.submitting = false;
            if (res.success || res.booking_id) {
                var bookingId = res.booking_id;
                var amount = parseFloat(state.servicePrice || 0);

                if (amount > 0) {
                    $btnSubmit.innerHTML = 'جاري إنشاء رابط الدفع...';
                    var paymentBody = {
                        booking_id:  bookingId,
                        amount:      amount,
                        description: 'حجز استشارة - ' + state.serviceName,
                        user_name:   state.name,
                        user_email:  state.email,
                        user_phone:  fullPhone
                    };

                    fetch(API + 'payment/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce':   ruqyaBooking.nonce
                        },
                        body: JSON.stringify(paymentBody)
                    })
                    .then(function(pr) { return pr.json(); })
                    .then(function(pres) {
                        state.submitting = false;
                        if (pres.success && pres.redirect_url) {
                            localStorage.setItem('ruqya_pending_booking', bookingId);
                            window.location.href = pres.redirect_url;
                        } else {
                            showError(pres.error || 'فشل إنشاء رابط الدفع. يرجى التواصل مع الإدارة.');
                            $btnSubmit.disabled = false;
                            $btnSubmit.innerHTML = 'تأكيد الحجز';
                        }
                    })
                    .catch(function(perr) {
                        state.submitting = false;
                        showError('حدث خطأ في الاتصال أثناء إنشاء رابط الدفع.');
                        $btnSubmit.disabled = false;
                        $btnSubmit.innerHTML = 'تأكيد الحجز';
                    });
                } else {
                    state.submitting = false;
                    $wrapper.style.display = 'none';
                    $success.style.display = 'block';
                    $success.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                showError(res.error || res.message || 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
                $btnSubmit.disabled = false;
                $btnSubmit.innerHTML = 'تأكيد الحجز';
            }
        })
        .catch(function(err) {
            state.submitting = false;
            showError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
            $btnSubmit.disabled = false;
            $btnSubmit.innerHTML = 'تأكيد الحجز';
        });
    }

    /* ── Helpers ───────────────────────────────────── */
    function showError(msg) {
        $error.textContent = '❌ ' + msg;
        $error.style.display = 'block';
        $error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function escHtml(str) {
        if (!str) return '';
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ── Initialize ───────────────────────────────── */
    document.addEventListener('DOMContentLoaded', init);
})();

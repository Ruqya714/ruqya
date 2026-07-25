/**
 * Ruqya Center — Admin Dashboard JavaScript
 */
(function($) {
    'use strict';

    /* ── Booking status update ─────────────────────── */
    /* ── Booking status & Healer update ────────────── */
    $(document).on('click', '.ruqya-save-status', function() {
        var btn = $(this);
        var bookingId = btn.data('booking-id');
        var row = btn.closest('tr');
        var status = row.find('.ruqya-status-select[data-field="status"]').val();
        var healerId = row.find('.ruqya-healer-select[data-field="healer_id"]').val();

        btn.prop('disabled', true).text('جاري...');

        var p1 = $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'update_booking_status',
            nonce: ruqyaAdmin.nonce,
            booking_id: bookingId,
            status: status
        });

        var p2 = $.ajax({
            url: ruqyaAdmin.restUrl + 'admin/bookings/' + bookingId + '/healer',
            method: 'PATCH',
            headers: { 'X-WP-Nonce': ruqyaAdmin.wpNonce },
            contentType: 'application/json',
            data: JSON.stringify({ healer_id: healerId })
        });

        $.when(p1, p2).done(function(res1, res2) {
            btn.prop('disabled', false).text('حفظ');
            btn.text('✓ تم').css('color', '#16a34a');
            setTimeout(function() { btn.text('حفظ').css('color', ''); }, 2000);
        }).fail(function() {
            btn.prop('disabled', false).text('حفظ');
            alert('حدث خطأ أثناء حفظ البيانات');
        });
    });

    /* ── Add slot ──────────────────────────────────── */
    $(document).on('submit', '#ruqya-add-slot-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');

        btn.prop('disabled', true).text('جاري...');

        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'add_slot',
            nonce: ruqyaAdmin.nonce,
            healer_id: form.find('[name="healer_id"]').val(),
            slot_date: form.find('[name="slot_date"]').val(),
            start_time: form.find('[name="start_time"]').val(),
            end_time: form.find('[name="end_time"]').val(),
            max_capacity: form.find('[name="max_capacity"]').val() || 1
        }, function(res) {
            btn.prop('disabled', false).text('إضافة');
            if (res.success) {
                location.reload();
            } else {
                alert('حدث خطأ في إضافة الموعد');
            }
        });
    });

    /* ── Bulk Slots Generation ─────────────────────── */
    $(document).on('submit', '#ruqya-bulk-slots-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');

        btn.prop('disabled', true).text('جاري توليد المواعيد...');

        var days = [];
        form.find('input[name="days[]"]:checked').each(function() {
            days.push(parseInt($(this).val()));
        });

        var body = {
            healer_id: form.find('[name="healer_id"]').val(),
            start_date: form.find('[name="start_date"]').val(),
            end_date: form.find('[name="end_date"]').val(),
            start_time: form.find('[name="start_time"]').val(),
            end_time: form.find('[name="end_time"]').val(),
            duration: parseInt(form.find('[name="duration"]').val()) || 30,
            max_capacity: parseInt(form.find('[name="max_capacity"]').val()) || 1,
            days: days
        };

        $.ajax({
            url: ruqyaAdmin.restUrl + 'admin/slots/bulk',
            method: 'POST',
            headers: { 'X-WP-Nonce': ruqyaAdmin.wpNonce },
            contentType: 'application/json',
            data: JSON.stringify(body),
            success: function(res) {
                btn.prop('disabled', false).text('توليد المواعيد');
                if (res.success) {
                    alert('تم بنجاح توليد ' + res.count + ' موعد جديد!');
                    location.reload();
                } else {
                    alert(res.error || 'حدث خطأ أثناء توليد المواعيد');
                }
            },
            error: function(xhr) {
                btn.prop('disabled', false).text('توليد المواعيد');
                var err = xhr.responseJSON ? xhr.responseJSON.error : 'خطأ في الاتصال بالخادم';
                alert(err);
            }
        });
    });

    /* ── Delete slot ───────────────────────────────── */
    $(document).on('click', '.ruqya-delete-slot', function() {
        if (!confirm('هل أنت متأكد من حذف هذا الموعد؟')) return;

        var btn = $(this);
        var slotId = btn.data('slot-id');

        btn.prop('disabled', true).text('جاري...');

        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'delete_slot',
            nonce: ruqyaAdmin.nonce,
            slot_id: slotId
        }, function(res) {
            if (res.success) {
                btn.closest('tr').fadeOut(300, function() { $(this).remove(); });
            } else {
                btn.prop('disabled', false).text('حذف');
                alert('حدث خطأ في حذف الموعد');
            }
        });
    });

    /* ── Save settings ────────────────────────────── */
    $(document).on('submit', '#ruqya-settings-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');
        var settings = {};

        form.find('input, textarea').each(function() {
            settings[$(this).attr('name')] = $(this).val();
        });

        btn.prop('disabled', true).text('جاري الحفظ...');

        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'save_settings',
            nonce: ruqyaAdmin.nonce,
            settings: settings
        }, function(res) {
            btn.prop('disabled', false).text('حفظ الإعدادات');
            if (res.success) {
                btn.text('✓ تم الحفظ').css('background', '#16a34a');
                setTimeout(function() {
                    btn.text('حفظ الإعدادات').css('background', '');
                }, 2000);
            } else {
                alert('خطأ في حفظ الإعدادات');
            }
        });
    });

    /* ── View Patient Details Modal ────────────────── */
    $(document).on('click', '.ruqya-view-patient', function(e) {
        e.preventDefault();
        var bookingId = $(this).data('booking-id');
        var modal = $('#ruqya-patient-modal');
        var modalBody = $('#ruqya-patient-modal-body');

        modal.show();
        modalBody.html('<div class="text-center" style="padding:40px;">جاري التحميل...</div>');

        $.ajax({
            url: ruqyaAdmin.restUrl + 'admin/bookings/' + bookingId,
            method: 'GET',
            headers: { 'X-WP-Nonce': ruqyaAdmin.wpNonce },
            success: function(res) {
                if (res) {
                    var maritalMap = { single: 'أعزب/عزباء', married: 'متزوج/ة', divorced: 'منفصل/ة', widowed: 'أرمل/ة' };
                    var needMap = { initial: 'توجيه أولي وتقييم للحالة', special: 'حالتي تحتاج متابعة خاصة', unsure: 'غير متأكد وأحتاج رأي المختص' };
                    var genderMap = { male: 'ذكر', female: 'أنثى' };
                    
                    var html = '<div class="patient-details-grid">';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">الاسم الكامل</div><div class="patient-detail-value">' + (res.patient_name || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">البريد الإلكتروني</div><div class="patient-detail-value">' + (res.patient_email || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">رقم الهاتف/الواتساب</div><div class="patient-detail-value" dir="ltr" style="text-align:right;">' + (res.patient_phone || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">الجنس</div><div class="patient-detail-value">' + (genderMap[res.patient_gender] || res.patient_gender || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">العمر</div><div class="patient-detail-value">' + (res.patient_age || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">الجنسية</div><div class="patient-detail-value">' + (res.patient_nationality || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">بلد الإقامة</div><div class="patient-detail-value">' + (res.patient_country || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">الحالة الاجتماعية</div><div class="patient-detail-value">' + (maritalMap[res.patient_marital_status] || res.patient_marital_status || '—') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">إمكانية السفر</div><div class="patient-detail-value">' + (res.patient_can_travel ? 'نعم' : 'لا') + '</div></div>';
                    html += '<div class="patient-detail-item"><div class="patient-detail-label">وصف الحاجة</div><div class="patient-detail-value">' + (needMap[res.patient_need_type] || res.patient_need_type || '—') + '</div></div>';
                    html += '<div class="patient-detail-item full-width"><div class="patient-detail-label">التجربة السابقة مع الرقاة والأعراض</div><div class="patient-detail-value">' + (res.patient_previous_ruqya || '—') + '</div></div>';
                    html += '</div>';

                    modalBody.html(html);
                } else {
                    modalBody.html('<div class="text-center" style="padding:20px; color:#dc2626;">فشل في تحميل البيانات</div>');
                }
            },
            error: function() {
                modalBody.html('<div class="text-center" style="padding:20px; color:#dc2626;">خطأ في الاتصال بالسيرفر</div>');
            }
        });
    });

    // Close modal
    $(document).on('click', '.ruqya-modal-close, #ruqya-patient-modal', function(e) {
        if (e.target === this) {
            $('#ruqya-patient-modal').hide();
        }
    });
    $(document).on('click', '.ruqya-modal-content', function(e) {
        e.stopPropagation();
    });

    /* ── CRUD Actions ──────────────────────────────── */
    // Add Healer
    $(document).on('submit', '#ruqya-add-healer-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'add_healer',
            nonce: ruqyaAdmin.nonce,
            display_name: form.find('[name="display_name"]').val(),
            title: form.find('[name="title"]').val(),
            specialization: form.find('[name="specialization"]').val(),
            experience_years: form.find('[name="experience_years"]').val() || 0,
            display_order: form.find('[name="display_order"]').val() || 0,
            is_visible: form.find('[name="is_visible"]').is(':checked') ? 1 : 0,
            is_available: form.find('[name="is_available"]').is(':checked') ? 1 : 0
        }, function(res) {
            btn.prop('disabled', false).text('إضافة معالج');
            if (res.success) {
                location.reload();
            } else {
                alert('حدث خطأ في إضافة المعالج');
            }
        });
    });

    // Delete Healer
    $(document).on('click', '.ruqya-delete-healer', function() {
        if (!confirm('هل أنت متأكد من حذف هذا المعالج؟')) return;
        var btn = $(this);
        var healerId = btn.data('healer-id');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'delete_healer',
            nonce: ruqyaAdmin.nonce,
            healer_id: healerId
        }, function(res) {
            if (res.success) {
                btn.closest('tr').fadeOut(300, function() { $(this).remove(); });
            } else {
                btn.prop('disabled', false).text('حذف');
                alert('حدث خطأ في حذف المعالج');
            }
        });
    });

    // Add/Update Service
    $(document).on('submit', '#ruqya-add-service-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('#ruqya-service-submit-btn');
        var serviceId = form.find('[name="service_id"]').val();
        
        btn.prop('disabled', true).text(serviceId ? 'جاري الحفظ...' : 'جاري الإضافة...');
        
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'add_service',
            nonce: ruqyaAdmin.nonce,
            service_id: serviceId,
            name: form.find('[name="name"]').val(),
            description: form.find('[name="description"]').val(),
            duration_minutes: form.find('[name="duration_minutes"]').val() || 30,
            price: form.find('[name="price"]').val() || 0,
            display_order: form.find('[name="display_order"]').val() || 0,
            min_days_delay: form.find('[name="min_days_delay"]').val() || 0,
            max_days_limit: form.find('[name="max_days_limit"]').val() || ''
        }, function(res) {
            btn.prop('disabled', false).text(serviceId ? 'حفظ التعديلات' : 'إضافة خدمة');
            if (res.success) {
                location.reload();
            } else {
                alert(serviceId ? 'حدث خطأ في تعديل الخدمة' : 'حدث خطأ في إضافة الخدمة');
            }
        });
    });

    // Edit Service click
    $(document).on('click', '.ruqya-edit-service', function() {
        var btn = $(this);
        var form = $('#ruqya-add-service-form');
        
        // Populate inputs
        form.find('[name="service_id"]').val(btn.data('service-id'));
        form.find('[name="name"]').val(btn.data('name'));
        form.find('[name="description"]').val(btn.data('description'));
        form.find('[name="duration_minutes"]').val(btn.data('duration'));
        form.find('[name="price"]').val(btn.data('price'));
        form.find('[name="display_order"]').val(btn.data('order'));
        form.find('[name="min_days_delay"]').val(btn.data('min-delay') !== undefined ? btn.data('min-delay') : 0);
        form.find('[name="max_days_limit"]').val(btn.data('max-limit') !== undefined ? btn.data('max-limit') : '');
        
        // Change UI text
        $('#ruqya-service-form-title').text('تعديل الخدمة: ' + btn.data('name'));
        $('#ruqya-service-submit-btn').text('حفظ التعديلات');
        $('#ruqya-service-cancel-btn').show();
        
        // Scroll to form smoothly
        $('html, body').animate({
            scrollTop: form.closest('.ruqya-section').offset().top - 40
        }, 300);
    });

    // Cancel Edit Service click
    $(document).on('click', '#ruqya-service-cancel-btn', function() {
        var form = $('#ruqya-add-service-form');
        
        // Reset form
        form[0].reset();
        form.find('[name="service_id"]').val('');
        
        // Reset UI text
        $('#ruqya-service-form-title').text('إضافة خدمة جديدة');
        $('#ruqya-service-submit-btn').text('إضافة خدمة');
        $(this).hide();
    });

    // Delete Service
    $(document).on('click', '.ruqya-delete-service', function() {
        if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
        var btn = $(this);
        var serviceId = btn.data('service-id');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'delete_service',
            nonce: ruqyaAdmin.nonce,
            service_id: serviceId
        }, function(res) {
            if (res.success) {
                btn.closest('tr').fadeOut(300, function() { $(this).remove(); });
            } else {
                btn.prop('disabled', false).text('حذف');
                alert('حدث خطأ في حذف الخدمة');
            }
        });
    });

    // Add Testimonial
    $(document).on('submit', '#ruqya-add-testimonial-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'add_testimonial',
            nonce: ruqyaAdmin.nonce,
            patient_name: form.find('[name="patient_name"]').val(),
            rating: form.find('[name="rating"]').val() || 5,
            display_order: form.find('[name="display_order"]').val() || 0,
            content: form.find('[name="content"]').val(),
            is_visible: form.find('[name="is_visible"]').is(':checked') ? 1 : 0
        }, function(res) {
            btn.prop('disabled', false).text('إضافة شهادة');
            if (res.success) {
                location.reload();
            } else {
                alert('حدث خطأ في إضافة الشهادة');
            }
        });
    });

    // Delete Testimonial
    $(document).on('click', '.ruqya-delete-testimonial', function() {
        if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return;
        var btn = $(this);
        var testimonialId = btn.data('testimonial-id');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'delete_testimonial',
            nonce: ruqyaAdmin.nonce,
            testimonial_id: testimonialId
        }, function(res) {
            if (res.success) {
                btn.closest('tr').fadeOut(300, function() { $(this).remove(); });
            } else {
                btn.prop('disabled', false).text('حذف');
                alert('حدث خطأ في حذف الشهادة');
            }
        });
    });

    // Add FAQ
    $(document).on('submit', '#ruqya-add-faq-form', function(e) {
        e.preventDefault();
        var form = $(this);
        var btn = form.find('button[type="submit"]');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'add_faq',
            nonce: ruqyaAdmin.nonce,
            question: form.find('[name="question"]').val(),
            display_order: form.find('[name="display_order"]').val() || 0,
            answer: form.find('[name="answer"]').val(),
            is_visible: form.find('[name="is_visible"]').is(':checked') ? 1 : 0
        }, function(res) {
            btn.prop('disabled', false).text('إضافة سؤال شائع');
            if (res.success) {
                location.reload();
            } else {
                alert('حدث خطأ في إضافة السؤال');
            }
        });
    });

    // Delete FAQ
    $(document).on('click', '.ruqya-delete-faq', function() {
        if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
        var btn = $(this);
        var faqId = btn.data('faq-id');
        btn.prop('disabled', true).text('جاري...');
        $.post(ruqyaAdmin.ajaxUrl, {
            action: 'ruqya_admin_action',
            action_type: 'delete_faq',
            nonce: ruqyaAdmin.nonce,
            faq_id: faqId
        }, function(res) {
            if (res.success) {
                btn.closest('tr').fadeOut(300, function() { $(this).remove(); });
            } else {
                btn.prop('disabled', false).text('حذف');
                alert('حدث خطأ في حذف السؤال');
            }
        });
    });

    // Healer save booking status
    $(document).on('click', '.ruqya-healer-save-status', function() {
        var btn = $(this);
        var bookingId = btn.data('booking-id');
        var row = btn.closest('tr');
        var status = row.find('.ruqya-healer-status-select').val();

        btn.prop('disabled', true).text('جاري...');

        $.ajax({
            url: ruqyaAdmin.restUrl + 'admin/bookings/' + bookingId + '/status',
            method: 'PATCH',
            headers: { 'X-WP-Nonce': ruqyaAdmin.wpNonce },
            contentType: 'application/json',
            data: JSON.stringify({ status: status }),
            success: function(res) {
                btn.prop('disabled', false).text('حفظ');
                btn.text('✓ تم').css('color', '#16a34a');
                setTimeout(function() { btn.text('حفظ').css('color', ''); }, 2000);
            },
            error: function() {
                btn.prop('disabled', false).text('حفظ');
                alert('حدث خطأ أثناء حفظ الحالة');
            }
        });
    });

})(jQuery);

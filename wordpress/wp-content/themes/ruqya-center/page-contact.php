<?php
/**
 * Template Name: اتصل بنا
 */
get_header();
$phone    = ruqya_setting( 'phone', '' );
$whatsapp = ruqya_setting( 'whatsapp', '' );
$email_s  = ruqya_setting( 'email', 'ruqya714@gmail.com' );
$address  = ruqya_translate( ruqya_setting( 'address', 'إسطنبول، تركيا' ) );
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'اتصل بنا', 'ruqya' ); ?></h1>
        <p><?php _e( 'نسعد بتواصلكم معنا. يمكنكم إرسال رسالة أو التواصل مباشرة عبر الوسائل التالية', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <div class="grid grid-2" style="max-width:1000px;margin:0 auto;gap:32px;">
            <!-- Contact Info -->
            <div>
                <h2 class="mb-6" style="font-size:1.3rem;"><?php _e( 'معلومات التواصل', 'ruqya' ); ?></h2>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <?php if ( $phone ) : ?>
                    <div class="card" style="display:flex;gap:12px;align-items:center;">
                        <div class="icon-box icon-box-green"><?php echo ruqya_icon( 'phone', 20 ); ?></div>
                        <div>
                            <p class="text-sm text-secondary"><?php _e( 'الهاتف', 'ruqya' ); ?></p>
                            <a href="tel:<?php echo esc_attr( $phone ); ?>" dir="ltr" class="fw-600"><?php echo esc_html( $phone ); ?></a>
                        </div>
                    </div>
                    <?php endif; ?>
                    <?php if ( $whatsapp ) : ?>
                    <div class="card" style="display:flex;gap:12px;align-items:center;">
                        <div class="icon-box icon-box-green" style="background:rgba(37,211,102,0.1);color:#25d366;"><?php echo ruqya_icon( 'whatsapp', 20 ); ?></div>
                        <div>
                            <p class="text-sm text-secondary"><?php _e( 'واتساب', 'ruqya' ); ?></p>
                            <a href="https://wa.me/<?php echo esc_attr( $whatsapp ); ?>" target="_blank" dir="ltr" class="fw-600"><?php echo esc_html( $whatsapp ); ?></a>
                        </div>
                    </div>
                    <?php endif; ?>
                    <div class="card" style="display:flex;gap:12px;align-items:center;">
                        <div class="icon-box icon-box-green"><?php echo ruqya_icon( 'mail', 20 ); ?></div>
                        <div>
                            <p class="text-sm text-secondary"><?php _e( 'البريد الإلكتروني', 'ruqya' ); ?></p>
                            <a href="mailto:<?php echo esc_attr( $email_s ); ?>" class="fw-600"><?php echo esc_html( $email_s ); ?></a>
                        </div>
                    </div>
                    <div class="card" style="display:flex;gap:12px;align-items:center;">
                        <div class="icon-box icon-box-green"><?php echo ruqya_icon( 'map-pin', 20 ); ?></div>
                        <div>
                            <p class="text-sm text-secondary"><?php _e( 'العنوان', 'ruqya' ); ?></p>
                            <p class="fw-600"><?php echo esc_html( $address ); ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div>
                <h2 class="mb-6" style="font-size:1.3rem;"><?php _e( 'أرسل لنا رسالة', 'ruqya' ); ?></h2>
                <div id="contact-success" class="notice-msg notice-success" style="display:none;">
                    <p><?php _e( '✅ تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت.', 'ruqya' ); ?></p>
                </div>
                <div id="contact-error" class="notice-msg notice-error" style="display:none;">
                    <p><?php _e( '❌ حدث خطأ. يرجى المحاولة لاحقاً.', 'ruqya' ); ?></p>
                </div>
                <form id="contact-form" class="card">
                    <div class="form-group">
                        <label><?php _e( 'الاسم الكامل', 'ruqya' ); ?> <span class="required">*</span></label>
                        <input type="text" name="name" class="form-control" placeholder="<?php esc_attr_e( 'أدخل اسمك', 'ruqya' ); ?>" required>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><?php _e( 'البريد الإلكتروني', 'ruqya' ); ?> <span class="required">*</span></label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label><?php _e( 'رقم الهاتف', 'ruqya' ); ?></label>
                            <input type="tel" name="phone" class="form-control" dir="ltr" placeholder="<?php esc_attr_e( 'أدخل رقم الهاتف', 'ruqya' ); ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'الرسالة', 'ruqya' ); ?> <span class="required">*</span></label>
                        <textarea name="message" class="form-control" rows="5" placeholder="<?php esc_attr_e( 'اكتب رسالتك هنا...', 'ruqya' ); ?>" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;" id="contact-submit-btn">
                        <?php echo ruqya_icon( 'send', 16 ); ?>
                        <?php _e( 'إرسال الرسالة', 'ruqya' ); ?>
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = document.getElementById('contact-submit-btn');
        btn.disabled = true;
        btn.innerHTML = '<?php echo esc_js( __( 'جاري الإرسال...', 'ruqya' ) ); ?>';

        var data = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]').value,
            message: form.querySelector('[name="message"]').value
        };

        fetch('<?php echo esc_url( rest_url( 'ruqya/v1/contact' ) ); ?>', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
            btn.disabled = false;
            btn.innerHTML = '<?php echo ruqya_icon( 'send', 16 ); ?> <?php echo esc_js( __( 'إرسال الرسالة', 'ruqya' ) ); ?>';
            if (res.success) {
                form.style.display = 'none';
                document.getElementById('contact-success').style.display = 'block';
            } else {
                document.getElementById('contact-error').style.display = 'block';
            }
        })
        .catch(function() {
            btn.disabled = false;
            btn.innerHTML = '<?php echo ruqya_icon( 'send', 16 ); ?> <?php echo esc_js( __( 'إرسال الرسالة', 'ruqya' ) ); ?>';
            document.getElementById('contact-error').style.display = 'block';
        });
    });
});
</script>

<?php get_footer(); ?>

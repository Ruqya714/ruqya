<?php
/** Template Name: نتيجة الدفع */
get_header();
?>
<section class="section">
    <div class="container-sm text-center" style="padding:80px 16px;">
        <div id="payment-loading" style="display:block;">
            <div style="width:48px;height:48px;border:3px solid var(--border);border-top-color:var(--green);border-radius:50%;animation:spin 0.6s linear infinite;margin:0 auto 24px;"></div>
            <p class="text-secondary"><?php _e( 'جاري التحقق من حالة الدفع...', 'ruqya' ); ?></p>
        </div>
        <div id="payment-success" style="display:none;">
            <div style="width:80px;height:80px;border-radius:50%;background:#e9f7ed;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2rem;">✅</div>
            <h1 style="font-size:1.8rem;margin-bottom:12px;color:var(--green);"><?php _e( 'تم الدفع بنجاح!', 'ruqya' ); ?></h1>
            <p class="text-secondary mb-8"><?php _e( 'شكراً لك. تم استلام الدفع وسيتم تأكيد حجزك قريباً.', 'ruqya' ); ?></p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary"><?php _e( 'العودة للرئيسية', 'ruqya' ); ?></a>
        </div>
        <div id="payment-failed" style="display:none;">
            <div style="width:80px;height:80px;border-radius:50%;background:#fff0ef;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2rem;">❌</div>
            <h1 style="font-size:1.8rem;margin-bottom:12px;color:var(--error);"><?php _e( 'فشل الدفع', 'ruqya' ); ?></h1>
            <p class="text-secondary mb-8"><?php _e( 'عذراً، لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى.', 'ruqya' ); ?></p>
            <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-primary"><?php _e( 'المحاولة مرة أخرى', 'ruqya' ); ?></a>
        </div>
    </div>
</section>

<style>@keyframes spin { to { transform: rotate(360deg); } }</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var params = new URLSearchParams(window.location.search);
    var status = params.get('status') || params.get('payment_status');
    var bookingId = params.get('booking_id');

    var loadingEl = document.getElementById('payment-loading');
    var successEl = document.getElementById('payment-success');
    var failedEl  = document.getElementById('payment-failed');

    if (status === 'verify' && bookingId) {
        var attempts = 0;
        function checkPayment() {
            attempts++;
            var url = '<?php echo esc_js( rest_url( 'ruqya/v1/' ) ); ?>payment/verify?booking_id=' + encodeURIComponent(bookingId);
            fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success && res.payment_status === 'paid') {
                    loadingEl.style.display = 'none';
                    successEl.style.display = 'block';
                } else {
                    if (attempts < 3) {
                        setTimeout(checkPayment, 2000);
                    } else {
                        loadingEl.style.display = 'none';
                        failedEl.style.display = 'block';
                    }
                }
            })
            .catch(function() {
                if (attempts < 3) {
                    setTimeout(checkPayment, 2000);
                } else {
                    loadingEl.style.display = 'none';
                    failedEl.style.display = 'block';
                }
            });
        }
        checkPayment();
    } else {
        setTimeout(function() {
            loadingEl.style.display = 'none';
            if (status === 'paid' || status === 'success') {
                successEl.style.display = 'block';
            } else {
                failedEl.style.display = 'block';
            }
        }, 1500);
    }
});
</script>
<?php get_footer(); ?>

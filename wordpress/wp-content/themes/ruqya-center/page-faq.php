<?php
/**
 * Template Name: الأسئلة الشائعة
 */
get_header();
$sb   = ruqya_sb();
$faqs = $sb->get_faqs();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'الأسئلة الشائعة', 'ruqya' ); ?></h1>
        <p><?php _e( 'نجيب على أبرز التساؤلات والاستفسارات ويمكنكم الحصول على المزيد من خلال تسجيل حالتكم حيث سيجيب موظف الاستقبال على جميع أسئلتكم بإذن الله', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container-sm">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <div class="faq-list">
            <?php if ( ! empty( $faqs ) ) : ?>
                <?php foreach ( $faqs as $faq ) : ?>
                <details class="faq-item">
                    <summary><?php echo esc_html( ruqya_translate( $faq->question ?? '' ) ); ?></summary>
                    <div class="faq-answer"><?php echo nl2br( esc_html( ruqya_translate( $faq->answer ?? '' ) ) ); ?></div>
                </details>
                <?php endforeach; ?>
            <?php else : ?>
                <p class="text-center text-secondary"><?php _e( 'لا توجد أسئلة شائعة حالياً', 'ruqya' ); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="section section-white" data-animate>
    <div class="container-sm text-center">
        <h2 class="mb-4"><?php _e( 'لم تجد إجابة لسؤالك؟', 'ruqya' ); ?></h2>
        <p class="text-secondary mb-8"><?php _e( 'تواصل معنا مباشرة وسنسعد بالإجابة على جميع استفساراتك', 'ruqya' ); ?></p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="<?php echo esc_url( ruqya_page_link( 'contact' ) ); ?>" class="btn btn-outline"><?php _e( 'اتصل بنا', 'ruqya' ); ?></a>
            <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-primary"><?php _e( 'سجّل حالتك', 'ruqya' ); ?></a>
        </div>
    </div>
</section>

<?php get_footer(); ?>

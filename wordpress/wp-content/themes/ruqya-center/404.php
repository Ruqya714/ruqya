<?php
/**
 * 404 Page
 */
get_header();
?>
<section class="section">
    <div class="container-sm text-center" style="padding:80px 16px;">
        <div style="font-size:6rem;font-weight:700;color:var(--border);line-height:1;margin-bottom:24px;">404</div>
        <h1 style="font-size:1.5rem;margin-bottom:12px;"><?php _e( 'الصفحة غير موجودة', 'ruqya' ); ?></h1>
        <p class="text-secondary mb-8"><?php _e( 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.', 'ruqya' ); ?></p>
        <a href="<?php echo esc_url( ruqya_home_url() ); ?>" class="btn btn-primary"><?php _e( 'العودة للرئيسية', 'ruqya' ); ?></a>
    </div>
</section>
<?php get_footer(); ?>

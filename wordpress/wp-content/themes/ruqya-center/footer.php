</main><!-- #main-content -->

<?php
$phone     = ruqya_setting( 'phone', '' );
$whatsapp  = ruqya_setting( 'whatsapp', '' );
$email     = ruqya_setting( 'email', 'ruqya714@gmail.com' );
$address   = ruqya_translate( ruqya_setting( 'address', 'إسطنبول، تركيا' ) );
$instagram = ruqya_setting( 'instagram', '' );
$youtube   = ruqya_setting( 'youtube', '' );
$facebook  = ruqya_setting( 'facebook', '' );
$twitter   = ruqya_setting( 'twitter', '' );
?>

<footer class="site-footer" id="site-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- About Column -->
            <div class="footer-about">
                <h3><?php _e( 'مركز الرقية بكلام الرحمن', 'ruqya' ); ?></h3>
                <p><?php _e( 'مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم. نسعى لمساعدة المرضى على التعافي بإذن الله من خلال العلاج بكتاب الله وسنة رسوله ﷺ.', 'ruqya' ); ?></p>

                <div class="footer-social">
                    <?php if ( $whatsapp ) : ?>
                        <a href="https://wa.me/<?php echo esc_attr( $whatsapp ); ?>" target="_blank" rel="noopener" aria-label="واتساب" title="واتساب"><?php echo ruqya_icon( 'whatsapp', 18 ); ?></a>
                    <?php endif; ?>
                    <?php if ( $instagram ) : ?>
                        <a href="<?php echo esc_url( $instagram ); ?>" target="_blank" rel="noopener" aria-label="انستغرام" title="انستغرام"><?php echo ruqya_icon( 'instagram', 18 ); ?></a>
                    <?php endif; ?>
                    <?php if ( $youtube ) : ?>
                        <a href="<?php echo esc_url( $youtube ); ?>" target="_blank" rel="noopener" aria-label="يوتيوب" title="يوتيوب"><?php echo ruqya_icon( 'youtube', 18 ); ?></a>
                    <?php endif; ?>
                    <?php if ( $facebook ) : ?>
                        <a href="<?php echo esc_url( $facebook ); ?>" target="_blank" rel="noopener" aria-label="فيسبوك" title="فيسبوك"><?php echo ruqya_icon( 'facebook', 18 ); ?></a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-links">
                <h4><?php _e( 'روابط سريعة', 'ruqya' ); ?></h4>
                <ul>
                    <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php _e( 'الرئيسية', 'ruqya' ); ?></a></li>
                    <li><a href="<?php echo esc_url( ruqya_page_link( 'about' ) ); ?>"><?php _e( 'من نحن', 'ruqya' ); ?></a></li>
                    <li><a href="<?php echo esc_url( ruqya_page_link( 'services' ) ); ?>"><?php _e( 'خدماتنا', 'ruqya' ); ?></a></li>
                    <li><a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>"><?php _e( 'حجز استشارة', 'ruqya' ); ?></a></li>
                    <li><a href="<?php echo esc_url( ruqya_page_link( 'blog' ) ); ?>"><?php _e( 'المقالات', 'ruqya' ); ?></a></li>
                    <li><a href="<?php echo esc_url( ruqya_page_link( 'faq' ) ); ?>"><?php _e( 'الأسئلة الشائعة', 'ruqya' ); ?></a></li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div class="footer-links">
                <h4><?php _e( 'تواصل معنا', 'ruqya' ); ?></h4>
                <ul>
                    <?php if ( $phone ) : ?>
                        <li><?php echo ruqya_icon( 'phone', 14 ); ?> <a href="tel:<?php echo esc_attr( $phone ); ?>" dir="ltr"><?php echo esc_html( $phone ); ?></a></li>
                    <?php endif; ?>
                    <?php if ( $email ) : ?>
                        <li><?php echo ruqya_icon( 'mail', 14 ); ?> <a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a></li>
                    <?php endif; ?>
                    <?php if ( $address ) : ?>
                        <li><?php echo ruqya_icon( 'map-pin', 14 ); ?> <?php echo esc_html( $address ); ?></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© <?php echo date( 'Y' ); ?> <?php _e( 'مركز الرقية بكلام الرحمن لرد كيد الشيطان — جميع الحقوق محفوظة', 'ruqya' ); ?></p>
            <div style="margin-top: 8px;">
                <a href="<?php echo esc_url( ruqya_page_link( 'privacy-policy' ) ); ?>" style="color: rgba(255,255,255,0.5);"><?php _e( 'سياسة الخصوصية', 'ruqya' ); ?></a> |
                <a href="<?php echo esc_url( ruqya_page_link( 'terms-of-service' ) ); ?>" style="color: rgba(255,255,255,0.5);"><?php _e( 'شروط الخدمة', 'ruqya' ); ?></a>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

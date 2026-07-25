<?php
/**
 * Template Name: خدماتنا
 */
get_header();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <div class="badge badge-gold mb-4"><?php _e( 'تبدأ رحلتك العلاجية من هنا', 'ruqya' ); ?></div>
        <h1><?php _e( 'الخدمات العلاجية', 'ruqya' ); ?></h1>
        <p><?php _e( 'نقدم مجموعة متكاملة من خدمات الرقية الشرعية للتعافي من الأمراض الروحية، وكلها تبدأ بخطوة واحدة أساسية للتقييم الصحيح', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<!-- الاستشارة الصوتية (البوابة) -->
<section class="section" data-animate>
    <div class="container-sm">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <div class="card" style="border-top:3px solid var(--green);padding:32px;">
            <h2 class="mb-4" style="font-size:1.5rem;color:var(--green);"><?php _e( 'الاستشارة الصوتية', 'ruqya' ); ?></h2>
            <p class="text-secondary mb-6"><?php _e( 'بوابة الدخول الإلزامية لجميع خدماتنا العلاجية والتشخيصية. لأن كل حالة تختلف عن الأخرى، لا يمكننا البدء بأي برنامج علاجي أو استقبال أي مريض بشكل مباشر قبل إجراء تقييم دقيق وشامل لحالته عبر الاستشارة الصوتية.', 'ruqya' ); ?></p>

            <h3 class="mb-4" style="font-size:1.1rem;"><?php _e( 'لماذا نبدأ بالاستشارة؟', 'ruqya' ); ?></h3>
            <ul style="list-style:none;">
                <?php
                $why_items = [
                    __( 'التأكد من جدية المريض والتزامه بالعلاج', 'ruqya' ),
                    __( 'فهم المشكلة وسبب الاتصال بشكل دقيق', 'ruqya' ),
                    __( 'تحديد إمكانية تغطية التكاليف العلاجية', 'ruqya' ),
                    __( 'توضيح شروط العلاج بكل شفافية', 'ruqya' ),
                    __( 'توجيهك للخدمة الأنسب لك', 'ruqya' ),
                    __( 'تحديد الحاجة لحضور مباشر أو عن بعد', 'ruqya' ),
                ];
                foreach ( $why_items as $item ) :
                ?>
                <li style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:0.95rem;color:var(--text-secondary);">
                    <?php echo ruqya_icon( 'check-circle', 16 ); ?>
                    <?php echo esc_html( $item ); ?>
                </li>
                <?php endforeach; ?>
            </ul>

            <div style="margin-top:24px;text-align:center;">
                <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-primary btn-lg">
                    <?php echo ruqya_icon( 'calendar', 18 ); ?>
                    <?php _e( 'احجز موعدك الآن', 'ruqya' ); ?>
                </a>
                <p class="text-muted text-sm mt-4"><?php echo ruqya_icon( 'shield', 14 ); ?> <?php _e( 'سرية بيانات تامة ومضمونة', 'ruqya' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- ما الذي يمكن علاجه -->
<section class="section section-white" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'ما الذي يمكن علاجه بالرقية الشرعية؟', 'ruqya' ); ?></h2>
            <p><?php _e( 'تغطي الرقية الشرعية مجالات واسعة استناداً إلى التوجيهات النبوية الشريفة، لتشمل جميع أنواع الأذى', 'ruqya' ); ?></p>
        </div>
        <div class="grid grid-2" style="max-width:900px;margin:0 auto;">
            <?php
            $is_tr = ( strpos( determine_locale(), 'tr' ) === 0 || ( function_exists( 'pll_current_language' ) && 'tr' === pll_current_language() ) );
            $treatments = [
                [ 'title' => __( 'علاج الأمراض الروحية', 'ruqya' ), 'desc' => __( 'تعتبر الرقية من الطرق الشرعية التي تعالج الأمراض الروحية من السحر والمس والعين والحسد التي يكون سببها الأرواح الشيطانية.', 'ruqya' ) ],
                [ 'title' => __( 'علاج الامراض النفسية', 'ruqya' ), 'desc' => __( 'لقد ثبت من خلال التعامل مع الحالات التي تعاني من أمراض نفسية أن الرقية الشرعية تساعد على الاستقرار النفسي.', 'ruqya' ) ],
            ];
            
            if ( ! $is_tr ) {
                $treatments[] = [ 'title' => __( 'علاج الحالات الصحية', 'ruqya' ), 'desc' => __( 'لقد ثبت من خلال التجربة أن الرقية الشرعية تساهم في علاج بعض الأمراض العضوية وتخفيف الآلام كسبب للشفاء بإذن الله.', 'ruqya' ) ];
            }
            
            $treatments[] = [ 'title' => __( 'تحصين النفس والاهل', 'ruqya' ), 'desc' => __( 'تعتبر الرقية الشرعية سبباً وعاملاً مهماً في تحصين النفس والأهل والمال من الشرور الداخلية والخارجية بإذن الله تعالى.', 'ruqya' ) ];

            foreach ( $treatments as $t ) :
            ?>
            <div class="card" data-animate>
                <h3 style="font-size:1.1rem;" class="mb-2"><?php echo esc_html( $t['title'] ); ?></h3>
                <p class="text-secondary text-sm"><?php echo esc_html( $t['desc'] ); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- الخدمات بعد الاستشارة -->
<section class="section" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'ماذا بعد الاستشارة الأولية؟', 'ruqya' ); ?></h2>
            <p><?php _e( 'بناءً على التقييم الدقيق في الجلسة الاستشارية، سيتم العمل معك وتوجيهك لإحدى الخدمات التالية', 'ruqya' ); ?></p>
        </div>
        <div class="grid grid-3" style="max-width:1100px;margin:0 auto;">
            <?php
            $post_services = [
                [ 
                    'title' => __( 'التشخيص بالرقية', 'ruqya' ), 
                    'desc' => __( 'جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية (روحية، نفسية، جسدية).', 'ruqya' ), 
                    'features' => [ __( 'قراءة رقية متخصصة لحالتك', 'ruqya' ), __( 'تحديد نوع الإصابة بشكل دقيق', 'ruqya' ), __( 'البدء في تسليم العلاج الملائم', 'ruqya' ) ] 
                ],
                [ 
                    'title' => __( 'العلاج بإشراف خاص', 'ruqya' ), 
                    'desc' => __( 'برنامج علاجي مخصص للتعامل مع الحالات المستعصية يتضمن استخراج العقد وجلسات الرقية المباشرة مع دعم مستمر.', 'ruqya' ), 
                    'features' => [ __( 'الاتصال المباشر على مدار الساعة', 'ruqya' ), __( 'تأمين الأدوية والعلاجات دون قيود', 'ruqya' ), __( 'جلسات علاجية ورقية دون قيود', 'ruqya' ), __( 'المتابعة اليومية والتقييم الدوري', 'ruqya' ) ] 
                ],
                [ 
                    'title' => __( 'الكورس العلاجي عن بعد', 'ruqya' ), 
                    'desc' => __( 'كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع توفير دعم وإرشاد وتوجيه ذاتي بخطوات واضحة.', 'ruqya' ), 
                    'features' => [ __( 'علاج ذاتي منهجي منزلي', 'ruqya' ), __( 'متابعة وإرشاد على فترات', 'ruqya' ), __( 'برامج وقائية وحماية للأسرة', 'ruqya' ) ] 
                ],
            ];
            foreach ( $post_services as $ps ) :
            ?>
            <div class="card" data-animate>
                <h3 style="font-size:1.1rem;" class="mb-2"><?php echo esc_html( $ps['title'] ); ?></h3>
                <p class="text-secondary text-sm mb-4"><?php echo esc_html( $ps['desc'] ); ?></p>
                <p class="fw-600 text-sm mb-2"><?php _e( 'ميزات الخدمة:', 'ruqya' ); ?></p>
                <ul style="list-style:none;">
                    <?php foreach ( $ps['features'] as $feat ) : ?>
                    <li style="display:flex;align-items:flex-start;gap:8px;padding:4px 0;font-size:0.85rem;color:var(--text-secondary);">
                        <?php echo ruqya_icon( 'check-circle', 14 ); ?>
                        <?php echo esc_html( $feat ); ?>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section section-white" data-animate>
    <div class="container-sm text-center">
        <h2 class="mb-4"><?php _e( 'لا تتردد، فالشفاء يبدأ بخطوة', 'ruqya' ); ?></h2>
        <p class="text-secondary mb-8"><?php _e( 'الاستشارة الصوتية هي المفتاح للتعرف على حالتك بدقة والبدء بمسار العلاج الشافي والمخصص لك بإذن الله دون تكاليف عشوائية.', 'ruqya' ); ?></p>
        <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-accent btn-lg"><?php _e( 'سجل حالتك للبدء الآن', 'ruqya' ); ?></a>
    </div>
</section>

<?php get_footer(); ?>

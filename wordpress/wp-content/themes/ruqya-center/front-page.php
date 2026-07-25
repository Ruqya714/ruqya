<?php
/**
 * Template Name: Front Page
 * The main homepage — ported from Next.js page.tsx
 */

get_header();

// Get dynamic data from Supabase
$sb   = ruqya_sb();
$faqs = $sb->get_faqs( 4 );
?>

<!-- ========== Hero Section ========== -->
<section class="hero gradient-hero">
    <div class="hero-blur" style="top:80px;right:80px;width:280px;height:280px;background:var(--gold);filter:blur(100px);"></div>
    <div class="hero-blur" style="bottom:40px;left:40px;width:380px;height:380px;background:var(--green-light);filter:blur(100px);"></div>

    <div class="hero-inner">
        <div class="badge badge-gold" style="margin-bottom:24px;display:inline-flex;">
            <?php echo ruqya_icon( 'sparkles', 14 ); ?>
            <span><?php _e( 'مركز متخصص في الرقية الشرعية منذ 2017', 'ruqya' ); ?></span>
        </div>

        <h1 class="animate-slide-up">
            <?php _e( 'مركز الرقية', 'ruqya' ); ?>
            <span class="text-gradient"><?php _e( 'بكلام الرحمن', 'ruqya' ); ?></span>
            <br><?php _e( 'لرد كيد الشيطان', 'ruqya' ); ?>
        </h1>

        <p style="animation: slide-up 0.6s ease-out 0.15s both;">
            <?php _e( 'نسعى بإذن الله لمساعدتك على التعافي من الأمراض الروحية والنفسية من خلال العلاج بكتاب الله وسنة رسوله ﷺ', 'ruqya' ); ?>
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;animation: slide-up 0.6s ease-out 0.3s both;">
            <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-accent btn-lg">
                <?php echo ruqya_icon( 'phone', 20 ); ?>
                <?php _e( 'سجّل حالتك الآن', 'ruqya' ); ?>
            </a>
            <a href="<?php echo esc_url( ruqya_page_link( 'about' ) ); ?>" class="btn btn-ghost btn-lg">
                <?php _e( 'تعرّف علينا', 'ruqya' ); ?>
                <?php echo ruqya_icon( 'arrow-left', 18 ); ?>
            </a>
        </div>

        <div class="hero-stats" style="animation: fade-in 0.6s ease-out 0.5s both;">
            <div class="stat">
                <div class="stat-val">+1000</div>
                <div class="stat-label"><?php _e( 'حالة تم علاجها', 'ruqya' ); ?></div>
            </div>
            <div class="stat">
                <div class="stat-val">+25</div>
                <div class="stat-label"><?php _e( 'سنوات خبرة', 'ruqya' ); ?></div>
            </div>
            <div class="stat">
                <div class="stat-val">+20</div>
                <div class="stat-label"><?php _e( 'دولة حول العالم', 'ruqya' ); ?></div>
            </div>
        </div>
    </div>

    <div class="wave-sep">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="var(--bg)"/>
        </svg>
    </div>
</section>

<!-- ========== About Section ========== -->
<section class="section" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'من نحن', 'ruqya' ); ?></h2>
            <p><?php _e( 'مركز متخصص في الرقية الشرعية تأسس عام 2017 في إسطنبول، يقدم خدمات العلاج بالقرآن الكريم والسنة النبوية عبر الإنترنت لجميع أنحاء العالم. نجمع بين الأصالة الشرعية والمنهج العلمي المنظم.', 'ruqya' ); ?></p>
        </div>

        <div class="grid grid-3">
            <div class="card" data-animate>
                <div class="icon-box icon-box-green">
                    <?php echo ruqya_icon( 'shield', 24 ); ?>
                </div>
                <h3 class="mt-4" style="font-size:1.1rem;"><?php _e( 'منهج شرعي صحيح', 'ruqya' ); ?></h3>
                <p class="text-secondary text-sm mt-2"><?php _e( 'نلتزم بالكتاب والسنة في جميع أساليب العلاج والرقية', 'ruqya' ); ?></p>
            </div>
            <div class="card" data-animate>
                <div class="icon-box icon-box-green">
                    <?php echo ruqya_icon( 'globe', 24 ); ?>
                </div>
                <h3 class="mt-4" style="font-size:1.1rem;"><?php _e( 'استشارات أونلاين', 'ruqya' ); ?></h3>
                <p class="text-secondary text-sm mt-2"><?php _e( 'نقدم خدماتنا لجميع أنحاء العالم عبر الاستشارات الصوتية', 'ruqya' ); ?></p>
            </div>
            <div class="card" data-animate>
                <div class="icon-box icon-box-green">
                    <?php echo ruqya_icon( 'users', 24 ); ?>
                </div>
                <h3 class="mt-4" style="font-size:1.1rem;"><?php _e( 'فريق متخصص', 'ruqya' ); ?></h3>
                <p class="text-secondary text-sm mt-2"><?php _e( 'معالجون ذوو خبرة طويلة في مجال الرقية الشرعية والعلاج', 'ruqya' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- ========== Services Section ========== -->
<section class="section section-white" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'خدماتنا', 'ruqya' ); ?></h2>
            <p><?php _e( 'نقدم مجموعة متكاملة من الخدمات العلاجية المتخصصة في الرقية الشرعية', 'ruqya' ); ?></p>
        </div>

        <div class="grid grid-2" style="max-width:900px;margin:0 auto;">
            <?php
            $services_list = [
                [ 
                    'icon' => 'phone',     
                    'title' => __( 'الاستشارة الصوتية', 'ruqya' ),             
                    'desc' => __( 'جلسة استشارية صوتية مع الراقي لتقييم الحالة والإرشاد للخطة العلاجية قبل البدء بتحديد العلاج', 'ruqya' ),     
                    'color' => 'green' 
                ],
                [ 
                    'icon' => 'book-open', 
                    'title' => __( 'التشخيص بالرقية', 'ruqya' ),               
                    'desc' => __( 'جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية', 'ruqya' ),                     
                    'color' => 'gold' 
                ],
                [ 
                    'icon' => 'heart',     
                    'title' => __( 'العلاج بإشراف خاص', 'ruqya' ),             
                    'desc' => __( 'برنامج علاجي مخصص ومباشر مع استخراج العقد ودعم متواصل حتى الشفاء التام وللحالات المستعصية', 'ruqya' ), 
                    'color' => 'green' 
                ],
                [ 
                    'icon' => 'star',      
                    'title' => __( 'الكورس العلاجي الذاتي عن بعد', 'ruqya' ), 
                    'desc' => __( 'كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع خدمات التوجيه والدعم الذاتي', 'ruqya' ),         
                    'color' => 'gold' 
                ],
            ];
            foreach ( $services_list as $svc ) :
            ?>
            <div class="card" data-animate>
                <div class="icon-box icon-box-<?php echo esc_attr( $svc['color'] ); ?>">
                    <?php echo ruqya_icon( $svc['icon'], 24 ); ?>
                </div>
                <h3 class="mt-4" style="font-size:1.1rem;"><?php echo esc_html( $svc['title'] ); ?></h3>
                <p class="text-secondary text-sm mt-2 mb-4"><?php echo esc_html( $svc['desc'] ); ?></p>
                <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="text-green fw-600 text-sm" style="display:inline-flex;align-items:center;gap:4px;">
                    <?php _e( 'احجز الآن', 'ruqya' ); ?>
                    <?php echo ruqya_icon( 'arrow-left', 14 ); ?>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ========== What We Treat Section ========== -->
<section class="section" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'ما الذي يمكن علاجه؟', 'ruqya' ); ?></h2>
            <p><?php _e( 'نعالج بإذن الله مختلف الحالات الروحية والنفسية والصحية', 'ruqya' ); ?></p>
        </div>

        <div class="grid grid-4">
            <?php
            $is_tr = ( strpos( determine_locale(), 'tr' ) === 0 || ( function_exists( 'pll_current_language' ) && 'tr' === pll_current_language() ) );
            $categories = [
                [ 
                    'icon' => 'shield',       
                    'title' => __( 'الأمراض الروحية', 'ruqya' ),    
                    'items' => [ __( 'العين والحسد', 'ruqya' ), __( 'السحر بأنواعه', 'ruqya' ), __( 'المس والتلبس', 'ruqya' ) ],                                 
                    'grad' => 'var(--green) 0%, var(--green-dark) 100%' 
                ],
                [ 
                    'icon' => 'heart',        
                    'title' => __( 'الأمراض النفسية', 'ruqya' ),    
                    'items' => [ __( 'القلق والاكتئاب', 'ruqya' ), __( 'الوسواس القهري', 'ruqya' ), __( 'الأرق المزمن', 'ruqya' ) ],                               
                    'grad' => 'var(--gold) 0%, var(--gold-dark) 100%' 
                ]
            ];

            if ( ! $is_tr ) {
                $categories[] = [ 
                    'icon' => 'sparkles',     
                    'title' => __( 'الحالات المستعصية', 'ruqya' ),  
                    'items' => [ __( 'أمراض السرطان والتوحد', 'ruqya' ), __( 'الصرع والتهاب الكبد', 'ruqya' ), __( 'الإسقاط المتكرر وتأخر الإنجاب', 'ruqya' ) ], 
                    'grad' => 'var(--teal) 0%, var(--green-dark) 100%' 
                ];
            }

            $categories[] = [ 
                'icon' => 'check-circle', 
                'title' => __( 'التحصين والوقاية', 'ruqya' ),   
                'items' => [ __( 'التحصين اليومي', 'ruqya' ), __( 'تحصين المنزل', 'ruqya' ), __( 'حماية الأطفال', 'ruqya' ) ],                                 
                'grad' => 'var(--green-light) 0%, var(--green) 100%' 
            ];

            foreach ( $categories as $cat ) :
            ?>
            <div class="card" style="padding:0;overflow:hidden;" data-animate>
                <div style="height:3px;background:linear-gradient(135deg,<?php echo $cat['grad']; ?>);"></div>
                <div style="padding:24px;">
                    <div class="icon-box icon-box-green" style="width:56px;height:56px;">
                        <?php echo ruqya_icon( $cat['icon'], 28 ); ?>
                    </div>
                    <h3 class="mt-4" style="font-size:1.1rem;"><?php echo esc_html( $cat['title'] ); ?></h3>
                    <ul style="margin-top:12px;list-style:none;">
                        <?php foreach ( $cat['items'] as $item ) : ?>
                        <li style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.9rem;color:var(--text-secondary);">
                            <?php echo ruqya_icon( 'check-circle', 14 ); ?>
                            <?php echo esc_html( $item ); ?>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ========== FAQ Preview Section ========== -->
<section class="section section-white" data-animate>
    <div class="container-sm">
        <div class="section-heading">
            <h2><?php _e( 'الأسئلة الشائعة', 'ruqya' ); ?></h2>
            <p><?php _e( 'إجابات لأكثر الأسئلة شيوعاً حول خدماتنا', 'ruqya' ); ?></p>
        </div>

        <div class="faq-list">
            <?php if ( ! empty( $faqs ) ) : ?>
                <?php foreach ( $faqs as $faq ) : ?>
                <details class="faq-item">
                    <summary><?php echo esc_html( ruqya_translate( $faq->question ?? '' ) ); ?></summary>
                    <div class="faq-answer"><?php echo nl2br( esc_html( ruqya_translate( $faq->answer ?? '' ) ) ); ?></div>
                </details>
                <?php endforeach; ?>
            <?php else : ?>
                <p class="text-center text-secondary" style="grid-column: 1/-1;"><?php _e( 'لا توجد أسئلة شائعة حالياً', 'ruqya' ); ?></p>
            <?php endif; ?>
        </div>

        <div class="text-center mt-8">
            <a href="<?php echo esc_url( ruqya_page_link( 'faq' ) ); ?>" class="text-green fw-600 text-sm" style="display:inline-flex;align-items:center;gap:6px;">
                <?php _e( 'عرض جميع الأسئلة', 'ruqya' ); ?>
                <?php echo ruqya_icon( 'arrow-left', 14 ); ?>
            </a>
        </div>
    </div>
</section>

<!-- ========== Final CTA ========== -->
<section class="section" data-animate>
    <div class="container" style="max-width:900px;">
        <div class="gradient-hero" style="border-radius:16px;padding:48px 32px;text-align:center;color:#fff;position:relative;overflow:hidden;">
            <div class="hero-blur" style="top:0;left:auto;right:0;width:200px;height:200px;background:var(--gold);filter:blur(100px);opacity:0.1;"></div>
            <div class="hero-blur" style="bottom:0;left:0;right:auto;width:260px;height:260px;background:var(--green-light);filter:blur(100px);opacity:0.1;"></div>

            <div style="position:relative;">
                <h2 style="color:#fff;font-size:clamp(1.5rem,3vw,2.5rem);margin-bottom:16px;"><?php _e( 'هل أنت مستعد للبدء؟', 'ruqya' ); ?></h2>
                <p style="color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:32px;max-width:550px;margin-left:auto;margin-right:auto;">
                    <?php _e( 'سجّل حالتك الآن وسيتم التواصل معك من قبل أحد المتخصصين لتحديد موعد الاستشارة المناسب', 'ruqya' ); ?>
                </p>
                <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-accent btn-lg">
                    <?php echo ruqya_icon( 'phone', 20 ); ?>
                    <?php _e( 'سجّل حالتك الآن', 'ruqya' ); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>

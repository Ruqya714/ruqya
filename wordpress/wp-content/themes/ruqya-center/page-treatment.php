<?php
/**
 * Template Name: الرحلة العلاجية
 */
get_header();
$steps = [
    [ 
        'num' => '1', 
        'title' => __( 'سجل حالتك في المركز', 'ruqya' ), 
        'desc' => __( 'سجل طلبك وسيقوم موظف الاستقبال بالتواصل معك لشرح تفاصيل العلاج بإشراف المعالج وبشكل خاص وهذا الإجراء مهم لنا لنقدم لك أفضل خدمة ممكنة بدون عشوائية.', 'ruqya' ) 
    ],
    [ 
        'num' => '2', 
        'title' => __( 'حجز موعد استشارة', 'ruqya' ), 
        'desc' => __( 'بعد التواصل معك سيقوم الموظف بحجز موعد استشارة لك ويرسل لك جميع التفاصيل بالموعد وستتواصل مع المعالج بشكل مباشر في الموعد المحدد بدون تأخير أو تأجيل.', 'ruqya' ) 
    ],
    [ 
        'num' => '3', 
        'title' => __( 'الاستشارة الصوتية', 'ruqya' ), 
        'desc' => __( 'هي عبارة عن مكالمة صوتية بينك وبين الراقي وتكون عبر برنامج google meet تشرح من خلالها المشكلة بشكل مفصل وسيقوم الراقي بتقييم حالتك وإرشادك للخطة العلاجية المناسبة لك كما سيقوم بتزويدك بشروط العلاج وتكاليفه.', 'ruqya' ) 
    ],
    [ 
        'num' => '4', 
        'title' => __( 'جلسة التشخيص واستلام العلاج', 'ruqya' ), 
        'desc' => __( 'بعد جلسة الاستشارة ستنتقل لجلسة التشخيص وهي عبارة عن جلسة تتم فيها قراءة الرقية الشرعية للتأكد من الحالة الروحية ثم نقوم بتسليم العلاج ونتابع حالتك عبر الهاتف حتى تصل لمرحلة جلسات الاستفراغ.', 'ruqya' ) 
    ],
    [ 
        'num' => '5', 
        'title' => __( 'بعد استلامك العلاج! أين تطبق العلاج', 'ruqya' ), 
        'desc' => __( 'يكون استخدام العلاج في منزلك وسيتواصل معك الراقي بشكل دوري ليتابع حالتك عبر الهاتف ومكالمات فيديو ورسائل صوتية وكتابية وسيقدم لك الدعم بشكل مستمر خلال هذه الفترة بإذن الله.', 'ruqya' ) 
    ],
    [ 
        'num' => '6', 
        'title' => __( 'جلسات الاستفراغ', 'ruqya' ), 
        'desc' => __( 'بعد انتهاء مدة البرنامج ستبدأ جلسات الاستفراغ وتكون اما مباشره في مكان سكنك او عبر مكالمات فيديو او رسائل كتابية او صوتية و سيقوم الراقي بتقديم التوجيه المستمر والإرشاد الدائم والسند في هذه الجلسات.', 'ruqya' ) 
    ],
    [ 
        'num' => '7', 
        'title' => __( 'جلسات الرقية الختامية', 'ruqya' ), 
        'desc' => __( 'بعد انتهاء من استخراج العقد ستكون جلسات الرقية حصريا مباشرة وذلك من أجل تحقيق أكبر فائدة للمريض والتعامل مع الحالة بكل احترافية وتكون الجلسات في منزل خاص بالمريض ويزوره الراقي.', 'ruqya' ) 
    ],
];
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'الرحلة العلاجية', 'ruqya' ); ?></h1>
        <p><?php _e( 'سبع مراحل مدروسة تبدأ بالتسجيل وتنتهي بالتعافي والتحصين بإذن الله', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container-sm">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <?php foreach ( $steps as $step ) : ?>
        <div class="card mb-6" data-animate style="display:flex;gap:20px;align-items:flex-start;">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;flex-shrink:0;">
                <?php echo esc_html( $step['num'] ); ?>
            </div>
            <div>
                <h3 style="font-size:1.1rem;margin-bottom:8px;"><?php echo esc_html( $step['title'] ); ?></h3>
                <p class="text-secondary text-sm" style="line-height:1.8;"><?php echo esc_html( $step['desc'] ); ?></p>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

<section class="section section-white" data-animate>
    <div class="container-sm text-center">
        <h2 class="mb-4"><?php _e( 'ابدأ رحلتك نحو التعافي', 'ruqya' ); ?></h2>
        <p class="text-secondary mb-8"><?php _e( 'الخطوة الأولى هي الأهم. سجّل حالتك وسنكون معك في كل خطوة بإذن الله', 'ruqya' ); ?></p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-accent btn-lg"><?php _e( 'سجّل حالتك', 'ruqya' ); ?></a>
            <a href="<?php echo esc_url( ruqya_page_link( 'services' ) ); ?>" class="btn btn-outline btn-lg"><?php _e( 'تعرّف على خدماتنا', 'ruqya' ); ?></a>
        </div>
    </div>
</section>

<?php get_footer(); ?>

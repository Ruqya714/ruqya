<?php
/**
 * Template Name: من نحن
 */
get_header();

$sb = ruqya_sb();
$testimonials = $sb->get_testimonials();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'من نحن', 'ruqya' ); ?></h1>
        <p><?php _e( 'مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم تأسس عام 2017 في إسطنبول، نقدم خدماتنا لجميع أنحاء العالم عبر الإنترنت', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<!-- Story -->
<section class="section" data-animate>
    <div class="container" style="max-width:900px;">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <div class="badge badge-gold mb-6"><?php _e( 'قصتنا', 'ruqya' ); ?></div>
        <h2 class="mb-6"><?php _e( 'رحلة بدأت بإيمان ونية صادقة', 'ruqya' ); ?></h2>
        <div style="line-height:1.9;color:var(--text-secondary);">
            <p class="mb-4"><?php _e( 'تأسس مركز الرقية بكلام الرحمن لرد كيد الشيطان عام 2017 في مدينة إسطنبول التركية، بإدارة الخبير والمعالج (سيف الله) (أبو عامر) بخبرة +25 عام.', 'ruqya' ); ?></p>
            <p class="mb-4"><?php _e( 'يُعد مركزنا صاحب البرنامج العلاجي الأول في العالم بفضل الله في استخراج العقد والأسحار وطرد الشيطان من الجسد، وهو العلاج الشامل لجميع الإصابات الروحية (سحر، مس، عين، حسد).', 'ruqya' ); ?></p>
            <p><?php _e( 'نستقبل الحالات من جميع أنحاء العالم، ونتخصص في التعامل مع "الحالات المستعصية" التي تشمل: (أمراض السرطان، أمراض الصرع وزيادة الشحنات الكهربائية، أمراض التوحد، الإسقاط المتكرر عند النساء، والتهاب الكبد الفيروسي).', 'ruqya' ); ?></p>
        </div>

        <div class="grid grid-4 mt-8">
            <?php
            $stats = [
                [ 'val' => '2017', 'label' => __( 'سنة التأسيس', 'ruqya' ) ],
                [ 'val' => '+1000', 'label' => __( 'حالة تم علاجها', 'ruqya' ) ],
                [ 'val' => '+20', 'label' => __( 'دولة حول العالم', 'ruqya' ) ],
                [ 'val' => '+25', 'label' => __( 'سنوات خبرة', 'ruqya' ) ],
            ];
            foreach ( $stats as $s ) :
            ?>
            <div class="card text-center">
                <div style="font-size:1.8rem;font-weight:700;color:var(--green);"><?php echo esc_html( $s['val'] ); ?></div>
                <div class="text-secondary text-sm mt-2"><?php echo esc_html( $s['label'] ); ?></div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Vision & Mission -->
<section class="section section-white" data-animate>
    <div class="container">
        <div class="grid grid-2" style="max-width:900px;margin:0 auto;">
            <div class="card" style="border-top:3px solid var(--green);">
                <h3 class="text-green mb-4"><?php _e( 'رؤيتنا', 'ruqya' ); ?></h3>
                <p class="text-secondary"><?php _e( 'أن نكون المرجع الأول في العالم العربي والإسلامي لتقديم خدمات الرقية الشرعية الموثوقة وفق منهج علمي شرعي متكامل، والوصول إلى كل محتاج أينما كان.', 'ruqya' ); ?></p>
            </div>
            <div class="card" style="border-top:3px solid var(--gold);">
                <h3 class="text-gold mb-4"><?php _e( 'رسالتنا', 'ruqya' ); ?></h3>
                <p class="text-secondary"><?php _e( 'تقديم خدمات الرقية الشرعية والعلاج بالقرآن والسنة بأعلى مستوى من المهنية والأمانة، مع تثقيف المجتمع حول أهمية التحصين والعلاج الشرعي وكيفية الوقاية من الأمراض الروحية.', 'ruqya' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- Features -->
<section class="section" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'ما يميّزنا', 'ruqya' ); ?></h2>
            <p><?php _e( 'نلتزم بأعلى معايير الجودة والأمانة في تقديم خدماتنا', 'ruqya' ); ?></p>
        </div>
        <div class="grid grid-3">
            <?php
            $features = [
                [ 'icon' => 'shield',       'title' => __( 'منهج شرعي وإثبات للإصابة', 'ruqya' ), 'desc' => __( 'نلتزم بالكتاب والسنة والامتناع التام عن التكلم مع الجن بأي حال من الأحوال، مع إثبات الإصابة قبل وبعد العلاج.', 'ruqya' ) ],
                [ 'icon' => 'star',          'title' => __( 'خبرة طويلة', 'ruqya' ),                'desc' => __( 'تقديم خدمات علاجية بدون أي أضرار جانبية بمصداقية عالية تحت إشراف معالجين مختصين بخبرة 25 عاماً.', 'ruqya' ) ],
                [ 'icon' => 'globe',         'title' => __( 'خدمات مباشرة وعالمية', 'ruqya' ),      'desc' => __( 'استقبال المرضى بشكل مباشر في مركزنا بإسطنبول، مع إمكانية سفر المعالجين للحالات الخاصة وفق شروط محددة.', 'ruqya' ) ],
                [ 'icon' => 'book-open',     'title' => __( 'كورسات علاجية ووقائية', 'ruqya' ),     'desc' => __( 'توفير كورسات علاجية للعلاج الذاتي المنهجي، وتقديم برامج وقائية للأفراد والأسر تكون درعاً متيناً وحصناً حصيناً.', 'ruqya' ) ],
                [ 'icon' => 'clock',         'title' => __( 'متابعة دورية وشاملة', 'ruqya' ),       'desc' => __( 'متابعة دورية ومستمرة للحالات من كافة الأعمار حتى الشفاء التام بإذن الله تعالى.', 'ruqya' ) ],
                [ 'icon' => 'heart',         'title' => __( 'إرشاد وتوجيه أسري', 'ruqya' ),        'desc' => __( 'إرشاد وتوجيه أسر المرضى لدعم العملية العلاجية وتعزيز الاستقرار النفسي.', 'ruqya' ) ],
            ];
            foreach ( $features as $f ) :
            ?>
            <div class="card" data-animate>
                <div class="icon-box icon-box-green">
                    <?php echo ruqya_icon( $f['icon'], 24 ); ?>
                </div>
                <h3 class="mt-4" style="font-size:1.05rem;"><?php echo esc_html( $f['title'] ); ?></h3>
                <p class="text-secondary text-sm mt-2"><?php echo esc_html( $f['desc'] ); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Team -->
<section class="section section-white" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'فريق العمل (القائمين على المركز)', 'ruqya' ); ?></h2>
        </div>
        <div class="grid grid-3">
            <?php
            $team = [
                [ 'name' => __( 'الإدارة', 'ruqya' ),                         'role' => __( 'إدارة شؤون المركز والمتابعة التامة', 'ruqya' ) ],
                [ 'name' => __( 'الراقي سيف الله أبو عامر', 'ruqya' ),        'role' => __( 'مستشار ومعالج والمدير التنفيذي للمركز', 'ruqya' ) ],
                [ 'name' => __( 'الراقي المعالج أبو إبراهيم', 'ruqya' ),       'role' => __( 'مستشار ومعالج والمتحدث الرسمي للمركز', 'ruqya' ) ],
                [ 'name' => __( 'الراقي المعالج أبو الياس', 'ruqya' ),         'role' => __( 'مستشار ومعالج والمتحدث الرسمي للمركز', 'ruqya' ) ],
                [ 'name' => __( 'الراقي المعالج يافووز سليم', 'ruqya' ),       'role' => __( 'مستشار ومعالج والمتحدث الرسمي للمركز', 'ruqya' ) ],
                [ 'name' => __( 'الكادر الطبي', 'ruqya' ),                     'role' => __( 'تقديم الاستشارات الطبية والصحية', 'ruqya' ) ],
            ];
            foreach ( $team as $m ) :
            ?>
            <div class="card text-center" data-animate>
                <div style="width:64px;height:64px;border-radius:50%;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:1.5rem;">
                    <?php echo ruqya_icon( 'users', 28 ); ?>
                </div>
                <h3 style="font-size:1rem;"><?php echo esc_html( $m['name'] ); ?></h3>
                <p class="text-secondary text-sm mt-2"><?php echo esc_html( $m['role'] ); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Values -->
<section class="section" data-animate>
    <div class="container-sm">
        <div class="section-heading">
            <h2><?php _e( 'قيمنا', 'ruqya' ); ?></h2>
        </div>
        <div class="card">
            <ul style="list-style:none;">
                <?php
                $values = [
                    __( 'الإخلاص والتقوى في العمل وابتغاء وجه الله تعالى', 'ruqya' ),
                    __( 'الالتزام بالمنهج الشرعي الصحيح المستند للكتاب والسنة', 'ruqya' ),
                    __( 'الأمانة والصدق في التعامل مع المرضى وذويهم', 'ruqya' ),
                    __( 'التطوير المستمر والاستفادة من التقنيات الحديثة', 'ruqya' ),
                    __( 'المهنية والاحترافية في تقديم الخدمات', 'ruqya' ),
                    __( 'السرية التامة والحفاظ على خصوصية المرضى', 'ruqya' ),
                ];
                foreach ( $values as $v ) :
                ?>
                <li style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-light);font-size:0.95rem;">
                    <?php echo ruqya_icon( 'check-circle', 18 ); ?>
                    <?php echo esc_html( $v ); ?>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<?php get_footer(); ?>

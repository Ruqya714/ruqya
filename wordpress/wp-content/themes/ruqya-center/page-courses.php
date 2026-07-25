<?php
/**
 * Template Name: الكورسات والدورات
 */
get_header();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'تدريب وتأهيل الرقاة والمعالجين', 'ruqya' ); ?></h1>
        <p><?php _e( 'برنامج متخصص ومكثف يهدف إلى إعداد وتأهيل معالجين متمكنين وفق الكتاب والسنة، مع تدريب عملي دقيق.', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section" data-animate>
    <div class="container-sm">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>
        <h2 class="mb-4"><?php _e( 'عن البرنامج التدريبي', 'ruqya' ); ?></h2>
        <p class="text-secondary mb-8" style="line-height:1.9;"><?php _e( 'برنامج شامل يتضمن تدريباً عملياً على إعداد البرامج العلاجية باستخدام الزيوت العشبية لاستخراج العقد والأسحار وطرد الشيطان من الجسد لجميع الإصابات الروحية، والتعامل مع مختلف الحالات المستعصية، ضمن ضوابط شرعية وأخلاقية دقيقة.', 'ruqya' ); ?></p>
    </div>
</section>

<section class="section section-white" data-animate>
    <div class="container">
        <div class="section-heading">
            <h2><?php _e( 'مميزات البرنامج الشامل', 'ruqya' ); ?></h2>
        </div>
        <div class="grid grid-3" style="max-width:1000px;margin:0 auto;">
            <?php
            $feats = [
                [ 'title' => __( 'تأهيل متكامل', 'ruqya' ), 'desc' => __( 'تأهيل علمي وعملي متكامل وفق منهجية صحيحة.', 'ruqya' ) ],
                [ 'title' => __( 'البرامج العلاجية', 'ruqya' ), 'desc' => __( 'تعليم فنيات إعداد البرامج العلاجية والمنظومة العشبية.', 'ruqya' ) ],
                [ 'title' => __( 'ضوابط شرعية', 'ruqya' ), 'desc' => __( 'دراسة دقيقة لضوابط الرقية الشرعية وأخلاقيات المعالج.', 'ruqya' ) ],
                [ 'title' => __( 'الحالات المعقدة', 'ruqya' ), 'desc' => __( 'التركيز والتدريب على كيفية التعامل مع الحالات الصعبة والمستعصية.', 'ruqya' ) ],
                [ 'title' => __( 'إجازة معتمدة', 'ruqya' ), 'desc' => __( 'منح إجازة رسمية معتمدة من المركز وإشراف مباشر من الشيخ سيف الله أبو عامر.', 'ruqya' ) ],
            ];
            foreach ( $feats as $f ) :
            ?>
            <div class="card" data-animate>
                <h3 style="font-size:1.05rem;" class="mb-2"><?php echo esc_html( $f['title'] ); ?></h3>
                <p class="text-secondary text-sm"><?php echo esc_html( $f['desc'] ); ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Golden Feature -->
<section class="section" data-animate>
    <div class="container-sm">
        <div class="card" style="border:2px solid var(--gold);padding:32px;">
            <div class="badge badge-gold mb-4"><?php _e( 'الميزة الذهبية والحصرية', 'ruqya' ); ?></div>
            <h2 style="font-size:1.3rem;" class="mb-4"><?php _e( 'متابعة مستمرة بعد الإجازة 🎓', 'ruqya' ); ?></h2>
            <p class="text-secondary mb-6"><?php _e( 'حرصًا منا على اكتمال التأهيل وضمان الجاهزية الميدانية، لا يُترك الراقي دون توجيه بعد حصوله على الإجازة الشرعية، بل يستمر الإشراف المباشر لمدة ثلاثة أشهر كاملة.', 'ruqya' ); ?></p>
            <ul style="list-style:none;">
                <?php
                $golden = [
                    __( 'متابعة الحالات التي يعالجها الراقي في الميدان', 'ruqya' ),
                    __( 'تقديم التوجيه العلمي والعملي المستمر والدائم', 'ruqya' ),
                    __( 'تصحيح الأخطاء الميدانية وتعزيز التمكن', 'ruqya' ),
                    __( 'الإجابة المباشرة عن كافة الاستفسارات الصعبة', 'ruqya' ),
                ];
                foreach ( $golden as $g ) :
                ?>
                <li style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:0.95rem;color:var(--text-secondary);">
                    <?php echo ruqya_icon( 'check-circle', 16 ); ?>
                    <?php echo esc_html( $g ); ?>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<!-- Note + CTA -->
<section class="section section-white" data-animate>
    <div class="container-sm">
        <div class="card mb-8" style="background:var(--bg);border-color:var(--gold);padding:24px;">
            <h3 style="font-size:1rem;" class="mb-2"><?php _e( 'تنويه شرعي وطبي مهم', 'ruqya' ); ?></h3>
            <p class="text-secondary text-sm"><?php _e( 'نؤكد بشكل قاطع أن الرقية الشرعية هي (سببٌ من الأسباب) والله هو الشافي وحده، وهي لا تُغني أبداً عن الأخذ بالأسباب الطبية والتوجه للمختصين عند الحاجة.', 'ruqya' ); ?></p>
        </div>

        <div class="text-center">
            <h2 class="mb-4"><?php _e( 'هل تود معرفة المزيد والتسجيل؟', 'ruqya' ); ?></h2>
            <p class="text-secondary mb-8"><?php _e( 'استفسر الآن عن مواعيد الدورة القادمة، شروط الالتحاق، وآلية التسجيل المعتمدة عبر قنواتنا الرسمية.', 'ruqya' ); ?></p>
            <a href="<?php echo esc_url( ruqya_page_link( 'contact' ) ); ?>" class="btn btn-primary btn-lg"><?php _e( 'تواصل معنا للاستفسار', 'ruqya' ); ?></a>
            <p class="text-muted text-sm mt-8"><?php _e( 'نسأل الله القبول والتوفيق والسداد للجميع 🌿', 'ruqya' ); ?></p>
        </div>
    </div>
</section>

<?php get_footer(); ?>

<?php
/**
 * Template Name: حجز استشارة
 * Multi-step booking form — ported from the 849-line React booking page.
 */
get_header();

// Enqueue booking assets
wp_enqueue_style( 'ruqya-booking', get_theme_file_uri( 'assets/css/booking.css' ), [], '2.1.0' );
wp_enqueue_script( 'ruqya-booking', get_theme_file_uri( 'assets/js/booking.js' ), [], '2.1.0', true );
wp_localize_script( 'ruqya-booking', 'ruqyaBooking', [
    'apiBase'  => rest_url( 'ruqya/v1/' ),
    'homeUrl'  => home_url( '/' ),
    'nonce'    => wp_create_nonce( 'wp_rest' ),
] );

// Get services for initial render
$sb       = ruqya_sb();
$services = $sb->get_services();

// Country codes for WhatsApp
$country_codes = [
    [ 'code' => '90',  'name' => __( 'تركيا', 'ruqya' ) ],
    [ 'code' => '966', 'name' => __( 'السعودية', 'ruqya' ) ],
    [ 'code' => '971', 'name' => __( 'الإمارات', 'ruqya' ) ],
    [ 'code' => '965', 'name' => __( 'الكويت', 'ruqya' ) ],
    [ 'code' => '974', 'name' => __( 'قطر', 'ruqya' ) ],
    [ 'code' => '973', 'name' => __( 'البحرين', 'ruqya' ) ],
    [ 'code' => '968', 'name' => __( 'عمان', 'ruqya' ) ],
    [ 'code' => '962', 'name' => __( 'الأردن', 'ruqya' ) ],
    [ 'code' => '970', 'name' => __( 'فلسطين', 'ruqya' ) ],
    [ 'code' => '961', 'name' => __( 'لبنان', 'ruqya' ) ],
    [ 'code' => '964', 'name' => __( 'العراق', 'ruqya' ) ],
    [ 'code' => '20',  'name' => __( 'مصر', 'ruqya' ) ],
    [ 'code' => '212', 'name' => __( 'المغرب', 'ruqya' ) ],
    [ 'code' => '213', 'name' => __( 'الجزائر', 'ruqya' ) ],
    [ 'code' => '216', 'name' => __( 'تونس', 'ruqya' ) ],
    [ 'code' => '218', 'name' => __( 'ليبيا', 'ruqya' ) ],
    [ 'code' => '249', 'name' => __( 'السودان', 'ruqya' ) ],
    [ 'code' => '967', 'name' => __( 'اليمن', 'ruqya' ) ],
    [ 'code' => '963', 'name' => __( 'سوريا', 'ruqya' ) ],
    [ 'code' => '1',   'name' => __( 'أمريكا/كندا', 'ruqya' ) ],
    [ 'code' => '44',  'name' => __( 'بريطانيا', 'ruqya' ) ],
    [ 'code' => '49',  'name' => __( 'ألمانيا', 'ruqya' ) ],
    [ 'code' => '33',  'name' => __( 'فرنسا', 'ruqya' ) ],
    [ 'code' => '31',  'name' => __( 'هولندا', 'ruqya' ) ],
    [ 'code' => '46',  'name' => __( 'السويد', 'ruqya' ) ],
    [ 'code' => '60',  'name' => __( 'ماليزيا', 'ruqya' ) ],
    [ 'code' => '62',  'name' => __( 'إندونيسيا', 'ruqya' ) ],
    [ 'code' => '92',  'name' => __( 'باكستان', 'ruqya' ) ],
    [ 'code' => '91',  'name' => __( 'الهند', 'ruqya' ) ],
];
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'سجّل حالتك', 'ruqya' ); ?></h1>
        <p><?php _e( 'اختر الخدمة والموعد المناسب واملأ بياناتك لنتمكن من مساعدتك', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container-sm">

        <!-- Success State (hidden by default) -->
        <div id="booking-success" style="display:none;" class="text-center">
            <div style="width:80px;height:80px;border-radius:50%;background:#e9f7ed;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2.5rem;">✅</div>
            <h2 class="mb-4" style="color:var(--green);"><?php _e( 'تم تسجيل حالتك بنجاح!', 'ruqya' ); ?></h2>
            <p class="text-secondary mb-8"><?php _e( 'شكراً لك. سيتم التواصل معك قريباً من قبل أحد المتخصصين لتأكيد الموعد.', 'ruqya' ); ?></p>
            <p class="text-muted mb-8"><?php _e( 'نسأل الله لك الشفاء العاجل 🤲', 'ruqya' ); ?></p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary"><?php _e( 'العودة للرئيسية', 'ruqya' ); ?></a>
        </div>

        <!-- Error Message -->
        <div id="booking-error" class="notice-msg notice-error" style="display:none;"></div>

        <!-- Booking Form (multi-step) -->
        <div id="booking-form-wrapper">

            <!-- Stepper -->
            <div class="stepper" id="booking-stepper">
                <div class="stepper-step active" data-step="0">
                    <span class="step-num">1</span>
                    <span><?php _e( 'الخدمة', 'ruqya' ); ?></span>
                </div>
                <div class="stepper-line"></div>
                <div class="stepper-step" data-step="1">
                    <span class="step-num">2</span>
                    <span><?php _e( 'المعلومات', 'ruqya' ); ?></span>
                </div>
                <div class="stepper-line"></div>
                <div class="stepper-step" data-step="2">
                    <span class="step-num">3</span>
                    <span><?php _e( 'الموعد', 'ruqya' ); ?></span>
                </div>
                <div class="stepper-line"></div>
                <div class="stepper-step" data-step="3">
                    <span class="step-num">4</span>
                    <span><?php _e( 'التأكيد', 'ruqya' ); ?></span>
                </div>
            </div>

            <!-- Step 1: Service Selection -->
            <div class="booking-step" id="step-0">
                <div class="card" style="padding:32px;">
                    <div class="notice-msg" style="background:#fff8e1;color:#8a6d00;margin-bottom:24px;">
                        <strong><?php _e( 'ملاحظة هامة:', 'ruqya' ); ?></strong> <?php _e( 'جلسات التشخيص والعلاج غير متاحة للحجز المباشر حالياً لضمان توجيهك بأفضل شكل. بناءً على مخرجات الاستشارة الصوتية، سيتم تقييم الحالة وتحديد ما إذا كان هنالك داعٍ لحجز جلسة تشخيص والبدء بالبرنامج العلاجي.', 'ruqya' ); ?>
                    </div>

                    <h3 class="mb-6"><?php _e( 'اختر نوع الاستشارة الصوتية', 'ruqya' ); ?></h3>

                    <div class="grid grid-2" style="gap:16px;">
                        <?php 
                        if ( is_array( $services ) ) : 
                            foreach ( $services as $s ) : 
                                $name = ruqya_translate( $s->name ?? '' );
                                $desc = ruqya_translate( $s->description ?? '' );
                                $price = $s->price ?? 0;
                                $id = $s->id ?? '';
                                
                                // Determine if it is urgent or normal
                                $is_urgent = ( mb_strpos( mb_strtolower( $name ), 'مستعجل' ) !== false || mb_strpos( mb_strtolower( $name ), 'urgent' ) !== false );
                                $type_val = $is_urgent ? 'urgent' : 'normal';
                                $badge_class = $is_urgent ? 'badge-gold' : '';
                                $badge_style = $is_urgent ? '' : 'background:rgba(26,92,42,0.1);color:var(--green);';
                        ?>
                        <label class="booking-option" data-service-id="<?php echo esc_attr( $id ); ?>" data-service-name="<?php echo esc_attr( $name ); ?>" data-service-price="<?php echo esc_attr( $price ); ?>" data-consult-type="<?php echo esc_attr( $type_val ); ?>">
                            <input type="radio" name="consultation_type" value="<?php echo esc_attr( $type_val ); ?>" hidden>
                            <div class="booking-option-inner">
                                <div class="badge <?php echo esc_attr( $badge_class ); ?> mb-2" style="<?php echo esc_attr( $badge_style ); ?>">
                                    <?php echo esc_html( $name ); ?>
                                </div>
                                <p class="text-sm text-secondary" style="margin-top: 8px;"><?php echo esc_html( $desc ); ?></p>
                                <p class="fw-700 text-green mt-2"><?php echo esc_html( $price ); ?> $</p>
                            </div>
                        </label>
                        <?php 
                            endforeach; 
                        endif; 
                        ?>
                    </div>
                </div>
            </div>

            <!-- Step 2: Patient Info -->
            <div class="booking-step" id="step-1" style="display:none;">
                <div class="card" style="padding:32px;">
                    <h3 class="mb-6"><?php _e( 'بياناتك الشخصية', 'ruqya' ); ?></h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><?php _e( 'البريد الإلكتروني', 'ruqya' ); ?> <span class="required">*</span></label>
                            <input type="email" id="b-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label><?php _e( 'الاسم الكامل', 'ruqya' ); ?> <span class="required">*</span></label>
                            <input type="text" id="b-name" class="form-control" placeholder="<?php esc_attr_e( 'أدخل اسمك الكامل', 'ruqya' ); ?>" required>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><?php _e( 'الجنس', 'ruqya' ); ?> <span class="required">*</span></label>
                            <select id="b-gender" class="form-control" required>
                                <option value=""><?php _e( 'اختر الجنس', 'ruqya' ); ?></option>
                                <option value="male"><?php _e( 'ذكر', 'ruqya' ); ?></option>
                                <option value="female"><?php _e( 'أنثى', 'ruqya' ); ?></option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><?php _e( 'العمر', 'ruqya' ); ?></label>
                            <input type="number" id="b-age" class="form-control" min="1" max="120">
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><?php _e( 'الجنسية', 'ruqya' ); ?></label>
                            <input type="text" id="b-nationality" class="form-control">
                        </div>
                        <div class="form-group">
                            <label><?php _e( 'الإقامة الحالية', 'ruqya' ); ?></label>
                            <input type="text" id="b-country" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'الحالة الاجتماعية', 'ruqya' ); ?></label>
                        <select id="b-marital" class="form-control">
                            <option value=""><?php _e( 'اختر', 'ruqya' ); ?></option>
                            <option value="single"><?php _e( 'أعزب/عزباء', 'ruqya' ); ?></option>
                            <option value="married"><?php _e( 'متزوج/ة', 'ruqya' ); ?></option>
                            <option value="divorced"><?php _e( 'منفصل/ة', 'ruqya' ); ?></option>
                            <option value="widowed"><?php _e( 'أرمل/ة', 'ruqya' ); ?></option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'هل ذهبت من قبل إلى رقاة؟ وما هي المشاكل التي تعاني منها؟', 'ruqya' ); ?></label>
                        <textarea id="b-previous" class="form-control" rows="3" placeholder="<?php esc_attr_e( 'اكتب تجربتك السابقة والأعراض التي تعاني منها...', 'ruqya' ); ?>"></textarea>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'هل لديك إمكانية السفر؟', 'ruqya' ); ?></label>
                        <div style="display:flex;gap:16px;">
                            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                                <input type="radio" name="can_travel" value="true"> <?php _e( 'نعم', 'ruqya' ); ?>
                            </label>
                            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                                <input type="radio" name="can_travel" value="false"> <?php _e( 'لا', 'ruqya' ); ?>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'أي وصف أقرب لحاجتك حالياً؟', 'ruqya' ); ?></label>
                        <select id="b-need-type" class="form-control">
                            <option value=""><?php _e( 'اختر', 'ruqya' ); ?></option>
                            <option value="initial"><?php _e( 'أبحث عن توجيه أولي وتقييم للحالة', 'ruqya' ); ?></option>
                            <option value="special"><?php _e( 'أشعر أن حالتي تحتاج متابعة خاصة', 'ruqya' ); ?></option>
                            <option value="unsure"><?php _e( 'غير متأكد وأحتاج رأي المختص', 'ruqya' ); ?></option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><?php _e( 'رقم الواتساب', 'ruqya' ); ?> <span class="required">*</span></label>
                        <div style="display:flex;gap:8px;">
                            <select id="b-country-code" class="form-control" style="width:180px;flex-shrink:0;">
                                <?php foreach ( $country_codes as $cc ) : ?>
                                <option value="+<?php echo esc_attr( $cc['code'] ); ?>" <?php echo $cc['code'] === '90' ? 'selected' : ''; ?>>
                                    +<?php echo esc_html( $cc['code'] ); ?> <?php echo esc_html( $cc['name'] ); ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                            <input type="tel" id="b-phone" class="form-control" dir="ltr" placeholder="5XX XXX XXXX" required>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 3: Date & Time -->
            <div class="booking-step" id="step-2" style="display:none;">
                <div class="card" style="padding:32px;">
                    <h3 class="mb-6"><?php _e( 'اختر الموعد', 'ruqya' ); ?></h3>
                    <div id="dates-loading" class="text-center" style="padding:40px;">
                        <div style="width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--green);border-radius:50%;animation:spin 0.6s linear infinite;margin:0 auto 16px;"></div>
                        <p class="text-secondary"><?php _e( 'جاري تحميل المواعيد...', 'ruqya' ); ?></p>
                    </div>
                    <div id="no-dates" style="display:none;" class="text-center" style="padding:40px;">
                        <p class="text-secondary"><?php _e( 'لا توجد مواعيد متاحة حالياً', 'ruqya' ); ?></p>
                        <p class="text-muted text-sm mt-2"><?php _e( 'يرجى التواصل معنا مباشرة أو المحاولة لاحقاً', 'ruqya' ); ?></p>
                    </div>
                    <div id="dates-grid" class="grid grid-4" style="display:none;"></div>
                    <div id="times-section" style="display:none;margin-top:24px;">
                        <h4 class="mb-4" id="times-title"><?php _e( 'المواعيد المتاحة', 'ruqya' ); ?></h4>
                        <div id="times-grid" class="grid grid-3"></div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Confirmation -->
            <div class="booking-step" id="step-3" style="display:none;">
                <div class="card" style="padding:32px;">
                    <h3 class="mb-6"><?php _e( 'مراجعة الطلب', 'ruqya' ); ?></h3>
                    <div id="review-details" class="review-table"></div>

                    <div class="notice-msg mt-6" style="background:#f0f9ff;color:#1e40af;">
                        💳 <?php _e( 'بعد الضغط على تأكيد الحجز، سيتم توجيهك بأمان لاستكمال عملية الدفع الإلكتروني عبر بوابة الدفع.', 'ruqya' ); ?>
                    </div>

                    <div class="form-group mt-6">
                        <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;">
                            <input type="checkbox" id="b-agree" style="margin-top:4px;">
                            <span class="text-sm">
                                <?php _e( 'أقر بأني قرأت وأوافق على', 'ruqya' ); ?>
                                <a href="<?php echo esc_url( ruqya_page_link( 'terms-of-service' ) ); ?>" target="_blank" class="text-green"><?php _e( 'شروط الخدمة وسياسة العمل', 'ruqya' ); ?></a>
                                <?php _e( 'ورجعت لـ', 'ruqya' ); ?>
                                <a href="<?php echo esc_url( ruqya_page_link( 'privacy-policy' ) ); ?>" target="_blank" class="text-green"><?php _e( 'سياسة الخصوصية', 'ruqya' ); ?></a>
                                <?php _e( 'الخاصة بالمركز.', 'ruqya' ); ?>
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="booking-nav" id="booking-nav">
                <button type="button" class="btn btn-outline" id="btn-prev" style="display:none;"><?php _e( 'السابق', 'ruqya' ); ?></button>
                <div style="flex:1;"></div>
                <button type="button" class="btn btn-primary" id="btn-next" disabled><?php _e( 'التالي', 'ruqya' ); ?></button>
                <button type="button" class="btn btn-accent" id="btn-submit" style="display:none;" disabled>
                    <?php echo ruqya_icon( 'phone', 16 ); ?>
                    <?php _e( 'تأكيد الحجز', 'ruqya' ); ?>
                </button>
            </div>

        </div><!-- /booking-form-wrapper -->
    </div>
</section>

<!-- Pass services data to JS -->
<script>
var ruqyaServices = <?php echo wp_json_encode( $services ); ?>;
</script>

<style>@keyframes spin { to { transform: rotate(360deg); } }</style>

<?php get_footer(); ?>

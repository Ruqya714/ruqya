<?php
/**
 * Admin Dashboard — custom WordPress admin pages for managing the Ruqya Center.
 * Replaces the Next.js admin panel.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Admin_Dashboard {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_menu', [ $this, 'register_menus' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
        add_action( 'wp_ajax_ruqya_admin_action', [ $this, 'handle_ajax' ] );
    }

    /**
     * Register admin menu pages.
     */
    public function register_menus(): void {
        // Main menu
        add_menu_page(
            'مركز الرقية',
            'مركز الرقية',
            'manage_options',
            'ruqya-dashboard',
            [ $this, 'page_dashboard' ],
            'dashicons-heart',
            3
        );

        // Submenu pages
        $subpages = [
            [ 'ruqya-bookings',      'الحجوزات',          'page_bookings' ],
            [ 'ruqya-slots',         'المواعيد',          'page_slots' ],
            [ 'ruqya-healers',       'المعالجون',         'page_healers' ],
            [ 'ruqya-services',      'الخدمات',           'page_services' ],
            [ 'ruqya-faqs',          'الأسئلة الشائعة',  'page_faqs' ],
            [ 'ruqya-inbox',         'البريد الوارد',     'page_inbox' ],
            [ 'ruqya-settings',      'إعدادات الموقع',   'page_settings' ],
        ];

        foreach ( $subpages as $sp ) {
            add_submenu_page(
                'ruqya-dashboard',
                $sp[1],
                $sp[1],
                'manage_options',
                $sp[0],
                [ $this, $sp[2] ]
            );
        }
    }

    /**
     * Enqueue admin CSS/JS.
     */
    public function enqueue_assets( string $hook ): void {
        // Only load on our pages
        if ( strpos( $hook, 'ruqya' ) === false ) {
            return;
        }

        $css_ver = file_exists( RUQYA_PLUGIN_DIR . 'admin/assets/css/admin.css' ) ? filemtime( RUQYA_PLUGIN_DIR . 'admin/assets/css/admin.css' ) : RUQYA_VERSION;
        $js_ver  = file_exists( RUQYA_PLUGIN_DIR . 'admin/assets/js/admin.js' ) ? filemtime( RUQYA_PLUGIN_DIR . 'admin/assets/js/admin.js' ) : RUQYA_VERSION;

        wp_enqueue_style(
            'ruqya-admin',
            RUQYA_PLUGIN_URL . 'admin/assets/css/admin.css',
            [],
            $css_ver
        );
        wp_enqueue_script(
            'ruqya-admin',
            RUQYA_PLUGIN_URL . 'admin/assets/js/admin.js',
            [ 'jquery' ],
            $js_ver,
            true
        );
        wp_localize_script( 'ruqya-admin', 'ruqyaAdmin', [
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'restUrl' => rest_url( 'ruqya/v1/' ),
            'nonce'   => wp_create_nonce( 'ruqya_admin_nonce' ),
            'wpNonce' => wp_create_nonce( 'wp_rest' ),
        ] );
    }

    /* ── Page renderers ──────────────────────────────────────── */

    public function page_dashboard(): void {
        $sb = Ruqya_Supabase::instance();

        // Get today's bookings
        $today = date( 'Y-m-d' );
        $all_bookings = Ruqya_Booking::instance()->get_list( [], 200 );
        $today_count = 0;
        $pending_count = 0;
        $week_count = 0;
        $month_count = 0;
        $week_ago = date( 'Y-m-d', strtotime( '-7 days' ) );
        $month_ago = date( 'Y-m-d', strtotime( '-30 days' ) );

        foreach ( $all_bookings as $b ) {
            $created = substr( $b->created_at ?? '', 0, 10 );
            if ( $created === $today ) $today_count++;
            if ( $created >= $week_ago ) $week_count++;
            if ( $created >= $month_ago ) $month_count++;
            if ( ( $b->status ?? '' ) === 'pending' ) $pending_count++;
        }

        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>لوحة تحكم مركز الرقية</h1>

            <div class="ruqya-stats-grid">
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">📅</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo esc_html( $today_count ); ?></span>
                        <span class="stat-label">حجوزات اليوم</span>
                    </div>
                </div>
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #fff3e0; color: #e65100;">⏳</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo esc_html( $pending_count ); ?></span>
                        <span class="stat-label">بانتظار التأكيد</span>
                    </div>
                </div>
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #e3f2fd; color: #1565c0;">📊</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo esc_html( $week_count ); ?></span>
                        <span class="stat-label">هذا الأسبوع</span>
                    </div>
                </div>
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #f3e5f5; color: #7b1fa2;">🗓️</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo esc_html( $month_count ); ?></span>
                        <span class="stat-label">هذا الشهر</span>
                    </div>
                </div>
            </div>

            <div class="ruqya-section">
                <h2>آخر الحجوزات</h2>
                <table class="ruqya-table">
                    <thead>
                        <tr>
                            <th>المريض</th>
                            <th>الخدمة</th>
                            <th>الحالة</th>
                            <th>الدفع</th>
                            <th>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $recent = array_slice( $all_bookings, 0, 10 );
                        foreach ( $recent as $b ) :
                            $status_labels = [ 'pending' => 'بانتظار', 'confirmed' => 'مؤكد', 'completed' => 'مكتمل', 'cancelled' => 'ملغي', 'no_show' => 'لم يحضر' ];
                            $payment_labels = [ 'pending' => 'بانتظار', 'paid' => 'مدفوع', 'refunded' => 'مسترد' ];
                            $status_class = [ 'pending' => 'warning', 'confirmed' => 'info', 'completed' => 'success', 'cancelled' => 'error', 'no_show' => 'error' ];
                        ?>
                        <tr>
                            <td>
                                <strong><?php echo esc_html( $b->patient_name ?? '' ); ?></strong>
                                <br><small><?php echo esc_html( $b->patient_phone ?? '' ); ?></small>
                            </td>
                            <td><?php echo esc_html( $b->services->name ?? '—' ); ?></td>
                            <td><span class="ruqya-badge <?php echo esc_attr( $status_class[ $b->status ?? 'pending' ] ?? 'warning' ); ?>"><?php echo esc_html( $status_labels[ $b->status ?? 'pending' ] ?? $b->status ); ?></span></td>
                            <td><span class="ruqya-badge <?php echo ( $b->payment_status ?? '' ) === 'paid' ? 'success' : 'warning'; ?>"><?php echo esc_html( $payment_labels[ $b->payment_status ?? 'pending' ] ?? $b->payment_status ); ?></span></td>
                            <td><?php echo esc_html( substr( $b->created_at ?? '', 0, 10 ) ); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }

    public function page_bookings(): void {
        $bookings = Ruqya_Booking::instance()->get_list( [], 100 );
        $status_labels  = [ 'pending' => 'بانتظار التأكيد', 'confirmed' => 'مؤكد', 'completed' => 'مكتمل', 'cancelled' => 'ملغي', 'no_show' => 'لم يحضر' ];
        $payment_labels = [ 'pending' => 'بانتظار الدفع', 'paid' => 'مدفوع', 'refunded' => 'مسترد' ];
        $status_class   = [ 'pending' => 'warning', 'confirmed' => 'info', 'completed' => 'success', 'cancelled' => 'error', 'no_show' => 'error' ];

        $sb = Ruqya_Supabase::instance();
        $healers = $sb->get_healers();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إدارة الحجوزات</h1>
            <table class="ruqya-table">
                <thead>
                    <tr>
                        <th>المريض</th>
                        <th>الهاتف</th>
                        <th>الخدمة</th>
                        <th>التاريخ/الوقت</th>
                        <th>المعالج</th>
                        <th>الحالة</th>
                        <th>الدفع</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $bookings as $b ) : ?>
                    <tr>
                        <td>
                            <a href="#" class="ruqya-view-patient" data-booking-id="<?php echo esc_attr( $b->id ); ?>" style="font-weight:bold; text-decoration:none;">
                                <?php echo esc_html( $b->patient_name ?? '' ); ?>
                            </a>
                            <?php if ( ! empty( $b->patient_email ) ) : ?>
                                <br><small><?php echo esc_html( $b->patient_email ); ?></small>
                            <?php endif; ?>
                        </td>
                        <td dir="ltr"><?php echo esc_html( $b->patient_phone ?? '' ); ?></td>
                        <td><?php echo esc_html( $b->services->name ?? '—' ); ?></td>
                        <td>
                            <?php echo esc_html( $b->available_slots->slot_date ?? '—' ); ?>
                            <br><small dir="ltr"><?php echo esc_html( substr( $b->available_slots->start_time ?? '', 0, 5 ) . ' - ' . substr( $b->available_slots->end_time ?? '', 0, 5 ) ); ?></small>
                        </td>
                        <td>
                            <select class="ruqya-healer-select" data-booking-id="<?php echo esc_attr( $b->id ); ?>" data-field="healer_id" style="padding: 5px 8px; border: 1px solid #d4d0c6; border-radius: 6px; font-size: 0.85rem; background: #fff;">
                                <option value="">غير معين</option>
                                <?php foreach ( $healers as $h ) : ?>
                                    <option value="<?php echo esc_attr( $h->id ); ?>" <?php selected( $b->healer_id ?? '', $h->id ); ?>><?php echo esc_html( $h->display_name ); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                        <td>
                            <select class="ruqya-status-select" data-booking-id="<?php echo esc_attr( $b->id ); ?>" data-field="status">
                                <?php foreach ( $status_labels as $val => $label ) : ?>
                                    <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $b->status ?? '', $val ); ?>><?php echo esc_html( $label ); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                        <td><span class="ruqya-badge <?php echo ( $b->payment_status ?? '' ) === 'paid' ? 'success' : 'warning'; ?>"><?php echo esc_html( $payment_labels[ $b->payment_status ?? 'pending' ] ?? '' ); ?></span></td>
                        <td>
                            <button class="button ruqya-save-status" data-booking-id="<?php echo esc_attr( $b->id ); ?>">حفظ</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <!-- Patient Details Modal -->
            <div id="ruqya-patient-modal" class="ruqya-modal" style="display:none;">
                <div class="ruqya-modal-content">
                    <span class="ruqya-modal-close">&times;</span>
                    <h2>تفاصيل المريض والحالة الطبية</h2>
                    <div id="ruqya-patient-modal-body">
                        <div class="text-center" style="padding:20px;">جاري التحميل...</div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    public function page_slots(): void {
        $sb    = Ruqya_Supabase::instance();
        $slots = $sb->from( 'available_slots' )
            ->select( '*,healers(display_name)' )
            ->service()
            ->order( 'slot_date', 'desc' )
            ->limit( 100 )
            ->get();
        $healers  = $sb->get_healers();
        $services = $sb->get_services();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إدارة المواعيد</h1>
            <div style="display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap;">
                <div class="ruqya-section" style="flex: 1; min-width: 300px; margin-bottom: 0;">
                    <h2>إضافة موعد فردي</h2>
                    <form id="ruqya-add-slot-form" class="ruqya-form-inline" style="display: flex; flex-direction: column; align-items: stretch; gap: 12px;">
                        <select name="healer_id" required style="width: 100%; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <option value="">اختر المعالج</option>
                            <?php foreach ( $healers as $h ) : ?>
                                <option value="<?php echo esc_attr( $h->id ); ?>"><?php echo esc_html( $h->display_name ); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <div style="display: flex; gap: 8px;">
                            <input type="date" name="slot_date" required title="التاريخ" style="flex: 1; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <input type="number" name="max_capacity" value="1" min="1" style="width: 80px; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;" placeholder="السعة">
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <input type="time" name="start_time" required title="من" style="flex: 1; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <input type="time" name="end_time" required title="إلى" style="flex: 1; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                        </div>
                        <button type="submit" class="button button-primary" style="width: 100%;">إضافة الموعد</button>
                    </form>
                </div>
                
                <div class="ruqya-section" style="flex: 2; min-width: 450px; margin-bottom: 0;">
                    <h2>توليد مواعيد مجمّعة (Bulk Generator)</h2>
                    <form id="ruqya-bulk-slots-form">
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
                            <select name="healer_id" required style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                                <option value="">اختر المعالج</option>
                                <?php foreach ( $healers as $h ) : ?>
                                    <option value="<?php echo esc_attr( $h->id ); ?>"><?php echo esc_html( $h->display_name ); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <input type="date" name="start_date" required title="تاريخ البدء" placeholder="تاريخ البدء" style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <input type="date" name="end_date" required title="تاريخ الانتهاء" placeholder="تاريخ الانتهاء" style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <input type="time" name="start_time" required title="وقت البدء" style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <input type="time" name="end_time" required title="وقت الانتهاء" style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                            <select name="duration" style="padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;">
                                <option value="30">30 دقيقة</option>
                                <option value="45">45 دقيقة</option>
                                <option value="60">60 دقيقة</option>
                                <option value="90">90 دقيقة</option>
                            </select>
                            <input type="number" name="max_capacity" value="1" min="1" style="width: 70px; padding: 8px 12px; border: 1px solid #d4d0c6; border-radius: 8px;" placeholder="السعة">
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>الأيام المطلوبة:</strong>
                            <div style="display: flex; gap: 12px; margin-top: 6px; flex-wrap: wrap;">
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="0" checked> الأحد</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="1" checked> الاثنين</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="2" checked> الثلاثاء</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="3" checked> الأربعاء</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="4" checked> الخميس</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="5"> الجمعة</label>
                                <label style="cursor: pointer;"><input type="checkbox" name="days[]" value="6"> السبت</label>
                            </div>
                        </div>
                        <button type="submit" class="button button-primary">توليد المواعيد</button>
                    </form>
                </div>
            </div>
            <table class="ruqya-table">
                <thead>
                    <tr><th>المعالج</th><th>التاريخ</th><th>الوقت</th><th>السعة</th><th>الحجوزات</th><th>الحالة</th><th>إجراءات</th></tr>
                </thead>
                <tbody>
                    <?php if ( is_array( $slots ) ) : foreach ( $slots as $s ) : ?>
                    <tr>
                        <td><?php echo esc_html( $s->healers->display_name ?? '—' ); ?></td>
                        <td><?php echo esc_html( $s->slot_date ?? '' ); ?></td>
                        <td dir="ltr"><?php echo esc_html( substr( $s->start_time ?? '', 0, 5 ) . ' - ' . substr( $s->end_time ?? '', 0, 5 ) ); ?></td>
                        <td><?php echo esc_html( $s->max_capacity ?? 1 ); ?></td>
                        <td><?php echo esc_html( $s->current_bookings ?? 0 ); ?></td>
                        <td><span class="ruqya-badge <?php echo ( $s->is_booked ?? false ) ? 'error' : 'success'; ?>"><?php echo ( $s->is_booked ?? false ) ? 'محجوز' : 'متاح'; ?></span></td>
                        <td><button class="button ruqya-delete-slot" data-slot-id="<?php echo esc_attr( $s->id ); ?>">حذف</button></td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_healers(): void {
        $sb = Ruqya_Supabase::instance();
        $healers = $sb->from( 'healers' )->select( '*' )->service()->order( 'display_order' )->get();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إدارة المعالجين</h1>
            
            <div class="ruqya-section" style="max-width: 650px;">
                <h2>إضافة معالج جديد</h2>
                <form id="ruqya-add-healer-form" style="display: grid; gap: 16px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>الاسم الكامل <span style="color: #dc2626;">*</span></label>
                            <input type="text" name="display_name" required placeholder="مثال: الشيخ أحمد البخاري">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>اللقب والوصف <span style="color: #dc2626;">*</span></label>
                            <input type="text" name="title" required placeholder="مثال: معالج راقٍ">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>التخصص</label>
                            <input type="text" name="specialization" placeholder="مثال: رقية شرعية">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>سنوات الخبرة</label>
                            <input type="number" name="experience_years" min="0" placeholder="مثال: 5">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>ترتيب العرض</label>
                            <input type="number" name="display_order" min="0" value="0" placeholder="مثال: 0">
                        </div>
                    </div>
                    <div style="display: flex; gap: 20px; align-items: center; margin-top: 4px;">
                        <label style="cursor: pointer;"><input type="checkbox" name="is_visible" checked style="margin-left: 6px;"> يظهر في الموقع العام</label>
                        <label style="cursor: pointer;"><input type="checkbox" name="is_available" checked style="margin-left: 6px;"> متاح لاستقبال المواعيد</label>
                    </div>
                    <button type="submit" class="button button-primary" style="justify-self: start; padding: 10px 24px !important; height: auto !important; font-size: 0.95rem !important;">إضافة معالج</button>
                </form>
            </div>

            <table class="ruqya-table">
                <thead><tr><th>الاسم</th><th>اللقب</th><th>التخصص</th><th>الخبرة</th><th>ظاهر</th><th>متاح</th><th>إجراءات</th></tr></thead>
                <tbody>
                    <?php if ( is_array( $healers ) ) : foreach ( $healers as $h ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $h->display_name ?? '' ); ?></strong></td>
                        <td><?php echo esc_html( $h->title ?? '' ); ?></td>
                        <td><?php echo esc_html( $h->specialization ?? '—' ); ?></td>
                        <td><?php echo esc_html( $h->experience_years ?? '—' ); ?> سنة</td>
                        <td><span class="ruqya-badge <?php echo ( $h->is_visible ?? false ) ? 'success' : 'error'; ?>"><?php echo ( $h->is_visible ?? false ) ? 'نعم' : 'لا'; ?></span></td>
                        <td><span class="ruqya-badge <?php echo ( $h->is_available ?? false ) ? 'success' : 'error'; ?>"><?php echo ( $h->is_available ?? false ) ? 'نعم' : 'لا'; ?></span></td>
                        <td><button class="button ruqya-delete-healer" data-healer-id="<?php echo esc_attr( $h->id ); ?>" style="color:#dc2626;">حذف</button></td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_services(): void {
        $sb       = Ruqya_Supabase::instance();
        $services = $sb->from( 'services' )->select( '*' )->order( 'display_order' )->get() ?: [];
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إدارة الخدمات</h1>

            <div class="ruqya-section" style="max-width: 650px;">
                <h2 id="ruqya-service-form-title">إضافة خدمة جديدة</h2>
                <form id="ruqya-add-service-form" style="display: grid; gap: 16px;">
                    <input type="hidden" name="service_id" value="">
                    <div class="ruqya-form-group" style="margin-bottom: 0;">
                        <label>اسم الخدمة <span style="color: #dc2626;">*</span></label>
                        <input type="text" name="name" required placeholder="مثال: الاستشارة الصوتية (مستعجلة)">
                    </div>
                    <div class="ruqya-form-group" style="margin-bottom: 0;">
                        <label>وصف الخدمة <span style="color: #dc2626;">*</span></label>
                        <textarea name="description" required placeholder="اكتب تفاصيل الخدمة وشروطها..." rows="3"></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>المدة بالدقائق <span style="color: #dc2626;">*</span></label>
                            <input type="number" name="duration_minutes" value="30" min="5" placeholder="مثال: 60">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>السعر بالدولار ($) <span style="color: #dc2626;">*</span></label>
                            <input type="number" name="price" step="0.01" value="0" min="0" placeholder="مثال: 50">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>ترتيب العرض</label>
                            <input type="number" name="display_order" min="0" value="0" placeholder="مثال: 1">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>الحد الأدنى للانتظار بالأيام <span style="color: #dc2626;">*</span></label>
                            <input type="number" name="min_days_delay" value="0" min="0" placeholder="0 للحجز الفوري، 7 للبدء بعد أسبوع">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>الحد الأقصى للمواعيد بالأيام</label>
                            <input type="number" name="max_days_limit" value="" min="0" placeholder="3 لتحديد الحجز خلال 72 ساعة، اتركه فارغاً لعرض غير محدود">
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button type="submit" id="ruqya-service-submit-btn" class="button button-primary" style="padding: 10px 24px !important; height: auto !important; font-size: 0.95rem !important;">إضافة خدمة</button>
                        <button type="button" id="ruqya-service-cancel-btn" class="button" style="display: none; padding: 10px 24px !important; height: auto !important; font-size: 0.95rem !important;">إلغاء التعديل</button>
                    </div>
                </form>
            </div>

            <table class="ruqya-table">
                <thead><tr><th>الخدمة</th><th>الوصف</th><th>المدة والسعر</th><th>إعدادات الموعد</th><th>إجراءات</th></tr></thead>
                <tbody>
                    <?php foreach ( $services as $s ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $s->name ?? '' ); ?></strong></td>
                        <td><?php echo esc_html( mb_substr( $s->description ?? '', 0, 60 ) ); ?>...</td>
                        <td><?php echo esc_html( $s->duration_minutes ?? 30 ); ?> دقيقة | $<?php echo esc_html( $s->price ?? 0 ); ?></td>
                        <td>
                            الانتظار: <?php echo esc_html( $s->min_days_delay ?? 0 ); ?> يوم
                            <br>
                            الأقصى: <?php echo isset( $s->max_days_limit ) && $s->max_days_limit !== '' && $s->max_days_limit !== null ? esc_html( $s->max_days_limit ) . ' يوم' : 'مفتوح'; ?>
                        </td>
                        <td>
                            <button class="button ruqya-edit-service" 
                                    data-service-id="<?php echo esc_attr( $s->id ); ?>" 
                                    data-name="<?php echo esc_attr( $s->name ?? '' ); ?>" 
                                    data-description="<?php echo esc_attr( $s->description ?? '' ); ?>" 
                                    data-duration="<?php echo esc_attr( $s->duration_minutes ?? 30 ); ?>" 
                                    data-price="<?php echo esc_attr( $s->price ?? 0 ); ?>" 
                                    data-order="<?php echo esc_attr( $s->display_order ?? 0 ); ?>" 
                                    data-min-delay="<?php echo esc_attr( $s->min_days_delay ?? 0 ); ?>" 
                                    data-max-limit="<?php echo esc_attr( $s->max_days_limit ?? '' ); ?>" 
                                    style="color: var(--green); margin-left: 8px;">تعديل</button>
                            <button class="button ruqya-delete-service" data-service-id="<?php echo esc_attr( $s->id ); ?>" style="color:#dc2626;">حذف</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_articles(): void {
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إدارة المقالات وقصص الشفاء</h1>
            <div class="ruqya-section" style="max-width: 600px; text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">✍️</div>
                <h2 style="margin-bottom: 12px;">إدارة المقالات الافتراضية لووردبريس</h2>
                <p style="color: #6b7280; font-size: 1rem; margin-bottom: 24px; line-height: 1.6;">
                    لقد تم اعتماد نظام المقالات القياسي لووردبريس (Native WP Posts) لتمكينك من استخدام المحرر المتطور (Gutenberg) لرفع الصور وتنسيق النصوص بكل سهولة وسلاسة.
                </p>
                <a href="<?php echo esc_url( admin_url( 'edit.php' ) ); ?>" class="button button-primary button-large" style="padding: 6px 30px !important; font-size: 1.1rem !important;">الذهاب لإدارة وكتابة المقالات</a>
            </div>
        </div>
        <?php
    }

    public function page_testimonials(): void {
        $sb = Ruqya_Supabase::instance();
        $testimonials = $sb->from( 'testimonials' )->select( '*' )->service()->order( 'display_order' )->get();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>شهادات المرضى</h1>

            <div class="ruqya-section" style="max-width: 650px;">
                <h2>إضافة شهادة جديدة</h2>
                <form id="ruqya-add-testimonial-form" style="display: grid; gap: 16px;">
                    <div style="display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>اسم المريض <span style="color: #dc2626;">*</span></label>
                            <input type="text" name="patient_name" required placeholder="مثال: أحمد عبد الله">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>التقييم</label>
                            <select name="rating">
                                <option value="5">⭐⭐⭐⭐⭐ (5 نجوم)</option>
                                <option value="4">⭐⭐⭐⭐ (4 نجوم)</option>
                                <option value="3">⭐⭐⭐ (3 نجوم)</option>
                                <option value="2">⭐⭐ (نجمتان)</option>
                                <option value="1">⭐ (نجمة واحدة)</option>
                            </select>
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>ترتيب العرض</label>
                            <input type="number" name="display_order" min="0" value="0" placeholder="مثال: 0">
                        </div>
                    </div>
                    <div class="ruqya-form-group" style="margin-bottom: 0;">
                        <label>محتوى الشهادة وقصة الشفاء <span style="color: #dc2626;">*</span></label>
                        <textarea name="content" required placeholder="اكتب قصة الشفاء وتجربة المريض هنا..." rows="3"></textarea>
                    </div>
                    <div style="display: flex; gap: 20px; align-items: center; margin-top: 4px;">
                        <label style="cursor: pointer;"><input type="checkbox" name="is_visible" checked style="margin-left: 6px;"> يظهر في الموقع العام</label>
                    </div>
                    <button type="submit" class="button button-primary" style="justify-self: start; padding: 10px 24px !important; height: auto !important; font-size: 0.95rem !important;">إضافة شهادة</button>
                </form>
            </div>

            <table class="ruqya-table">
                <thead><tr><th>الاسم</th><th>الشهادة</th><th>التقييم</th><th>ظاهرة</th><th>إجراءات</th></tr></thead>
                <tbody>
                    <?php if ( is_array( $testimonials ) ) : foreach ( $testimonials as $t ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $t->patient_name ?? '' ); ?></strong></td>
                        <td><?php echo esc_html( mb_substr( $t->content ?? '', 0, 80 ) ); ?>...</td>
                        <td><?php echo str_repeat( '⭐', (int) ( $t->rating ?? 5 ) ); ?></td>
                        <td><span class="ruqya-badge <?php echo ( $t->is_visible ?? false ) ? 'success' : 'error'; ?>"><?php echo ( $t->is_visible ?? false ) ? 'نعم' : 'لا'; ?></span></td>
                        <td><button class="button ruqya-delete-testimonial" data-testimonial-id="<?php echo esc_attr( $t->id ); ?>" style="color:#dc2626;">حذف</button></td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_faqs(): void {
        $sb   = Ruqya_Supabase::instance();
        $faqs = $sb->from( 'faqs' )->select( '*' )->service()->order( 'display_order' )->get();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>الأسئلة الشائعة</h1>

            <div class="ruqya-section" style="max-width: 650px;">
                <h2>إضافة سؤال وجواب جديد</h2>
                <form id="ruqya-add-faq-form" style="display: grid; gap: 16px;">
                    <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 12px;">
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>السؤال <span style="color: #dc2626;">*</span></label>
                            <input type="text" name="question" required placeholder="مثال: كيف يتم الحجز؟">
                        </div>
                        <div class="ruqya-form-group" style="margin-bottom: 0;">
                            <label>ترتيب العرض</label>
                            <input type="number" name="display_order" min="0" value="0" placeholder="مثال: 0">
                        </div>
                    </div>
                    <div class="ruqya-form-group" style="margin-bottom: 0;">
                        <label>الإجابة الشافية <span style="color: #dc2626;">*</span></label>
                        <textarea name="answer" required placeholder="اكتب الإجابة المفصلة هنا..." rows="3"></textarea>
                    </div>
                    <div style="display: flex; gap: 20px; align-items: center; margin-top: 4px;">
                        <label style="cursor: pointer;"><input type="checkbox" name="is_visible" checked style="margin-left: 6px;"> يظهر في الموقع العام</label>
                    </div>
                    <button type="submit" class="button button-primary" style="justify-self: start; padding: 10px 24px !important; height: auto !important; font-size: 0.95rem !important;">إضافة سؤال شائع</button>
                </form>
            </div>

            <table class="ruqya-table">
                <thead><tr><th>السؤال</th><th>الجواب</th><th>الترتيب</th><th>ظاهر</th><th>إجراءات</th></tr></thead>
                <tbody>
                    <?php if ( is_array( $faqs ) ) : foreach ( $faqs as $f ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $f->question ?? '' ); ?></strong></td>
                        <td><?php echo esc_html( mb_substr( $f->answer ?? '', 0, 80 ) ); ?>...</td>
                        <td><?php echo esc_html( $f->display_order ?? 0 ); ?></td>
                        <td><span class="ruqya-badge <?php echo ( $f->is_visible ?? false ) ? 'success' : 'error'; ?>"><?php echo ( $f->is_visible ?? false ) ? 'نعم' : 'لا'; ?></span></td>
                        <td><button class="button ruqya-delete-faq" data-faq-id="<?php echo esc_attr( $f->id ); ?>" style="color:#dc2626;">حذف</button></td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_inbox(): void {
        $sb       = Ruqya_Supabase::instance();
        $messages = $sb->from( 'contact_messages' )->select( '*' )->service()->order( 'created_at', 'desc' )->limit( 50 )->get();
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>البريد الوارد</h1>
            <table class="ruqya-table">
                <thead><tr><th>الاسم</th><th>البريد</th><th>الهاتف</th><th>الرسالة</th><th>التاريخ</th><th>الحالة</th></tr></thead>
                <tbody>
                    <?php if ( is_array( $messages ) ) : foreach ( $messages as $m ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $m->name ?? '' ); ?></strong></td>
                        <td><?php echo esc_html( $m->email ?? '' ); ?></td>
                        <td dir="ltr"><?php echo esc_html( $m->phone ?? '—' ); ?></td>
                        <td><?php echo esc_html( mb_substr( $m->message ?? '', 0, 100 ) ); ?></td>
                        <td><?php echo esc_html( substr( $m->created_at ?? '', 0, 10 ) ); ?></td>
                        <td><span class="ruqya-badge <?php echo ( $m->is_read ?? false ) ? 'success' : 'warning'; ?>"><?php echo ( $m->is_read ?? false ) ? 'مقروءة' : 'جديدة'; ?></span></td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    public function page_settings(): void {
        $sb       = Ruqya_Supabase::instance();
        $settings = $sb->get_settings();
        $keys     = [ 'phone', 'whatsapp', 'email', 'address', 'instagram', 'youtube', 'facebook', 'twitter' ];
        $labels   = [
            'phone' => 'رقم الهاتف', 'whatsapp' => 'واتساب', 'email' => 'البريد الإلكتروني',
            'address' => 'العنوان',
            'instagram' => 'انستغرام', 'youtube' => 'يوتيوب', 'facebook' => 'فيسبوك', 'twitter' => 'تويتر',
        ];
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>إعدادات الموقع</h1>
            <div class="ruqya-section">
                <form id="ruqya-settings-form">
                    <?php foreach ( $keys as $key ) : ?>
                    <div class="ruqya-form-group">
                        <label><strong><?php echo esc_html( $labels[ $key ] ?? $key ); ?></strong></label>
                        <input type="text" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $settings[ $key ] ?? '' ); ?>">
                    </div>
                    <?php endforeach; ?>
                    <button type="submit" class="button button-primary">حفظ الإعدادات</button>
                </form>
            </div>
        </div>
        <?php
    }

    /**
     * Handle AJAX actions.
     */
    public function handle_ajax(): void {
        check_ajax_referer( 'ruqya_admin_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Unauthorized' );
        }

        $action_type = sanitize_text_field( $_POST['action_type'] ?? '' );
        $sb = Ruqya_Supabase::instance();

        switch ( $action_type ) {
            case 'update_booking_status':
                $id     = sanitize_text_field( $_POST['booking_id'] ?? '' );
                $status = sanitize_text_field( $_POST['status'] ?? '' );
                $ok     = Ruqya_Booking::instance()->update_status( $id, $status );
                wp_send_json( [ 'success' => $ok ] );
                break;

            case 'add_slot':
                $result = $sb->from( 'available_slots' )->service()->insert( [
                    'healer_id'  => sanitize_text_field( $_POST['healer_id'] ?? '' ),
                    'slot_date'  => sanitize_text_field( $_POST['slot_date'] ?? '' ),
                    'start_time' => sanitize_text_field( $_POST['start_time'] ?? '' ),
                    'end_time'   => sanitize_text_field( $_POST['end_time'] ?? '' ),
                    'max_capacity' => (int) ( $_POST['max_capacity'] ?? 1 ),
                ] );
                wp_send_json( [ 'success' => $result !== null ] );
                break;

            case 'delete_slot':
                $id = sanitize_text_field( $_POST['slot_id'] ?? '' );
                $ok = $sb->from( 'available_slots' )->eq( 'id', $id )->service()->delete();
                wp_send_json( [ 'success' => $ok ] );
                break;

            case 'save_settings':
                $settings_data = $_POST['settings'] ?? [];
                foreach ( $settings_data as $key => $value ) {
                    $key = sanitize_text_field( $key );
                    $value = sanitize_textarea_field( $value );
                    // Check if setting exists
                    $existing = $sb->from( 'site_settings' )->select( 'id' )->eq( 'key', $key )->service()->single()->get();
                    if ( $existing && isset( $existing->id ) ) {
                        $sb->from( 'site_settings' )->eq( 'key', $key )->service()->update( [ 'value' => $value ] );
                    } else {
                        $sb->from( 'site_settings' )->service()->insert( [ 'key' => $key, 'value' => $value ] );
                    }
                }
                wp_send_json( [ 'success' => true ] );
                break;

            case 'add_healer':
                $result = $sb->from( 'healers' )->service()->insert( [
                    'display_name'     => sanitize_text_field( $_POST['display_name'] ?? '' ),
                    'title'            => sanitize_text_field( $_POST['title'] ?? '' ),
                    'specialization'   => sanitize_text_field( $_POST['specialization'] ?? '' ),
                    'experience_years' => (int) ( $_POST['experience_years'] ?? 0 ),
                    'display_order'    => (int) ( $_POST['display_order'] ?? 0 ),
                    'is_visible'       => (bool) ( $_POST['is_visible'] === '1' ),
                    'is_available'     => (bool) ( $_POST['is_available'] === '1' ),
                ] );
                wp_send_json( [ 'success' => $result !== null ] );
                break;

            case 'delete_healer':
                $id = sanitize_text_field( $_POST['healer_id'] ?? '' );
                $ok = $sb->from( 'healers' )->eq( 'id', $id )->service()->delete();
                wp_send_json( [ 'success' => $ok ] );
                break;

            case 'add_service':
                $id   = sanitize_text_field( $_POST['service_id'] ?? '' );
                $data = [
                    'name'             => sanitize_text_field( $_POST['name'] ?? '' ),
                    'description'      => sanitize_textarea_field( $_POST['description'] ?? '' ),
                    'duration_minutes' => (int) ( $_POST['duration_minutes'] ?? 30 ),
                    'price'            => (float) ( $_POST['price'] ?? 0 ),
                    'display_order'    => (int) ( $_POST['display_order'] ?? 0 ),
                    'is_active'        => true,
                    'min_days_delay'   => (int) ( $_POST['min_days_delay'] ?? 0 ),
                    'max_days_limit'   => isset( $_POST['max_days_limit'] ) && $_POST['max_days_limit'] !== '' ? (int) $_POST['max_days_limit'] : null,
                ];
                if ( ! empty( $id ) ) {
                    $result = $sb->from( 'services' )->eq( 'id', $id )->service()->update( $data );
                } else {
                    $result = $sb->from( 'services' )->service()->insert( $data );
                }
                wp_send_json( [ 'success' => $result !== null ] );
                break;

            case 'delete_service':
                $id = sanitize_text_field( $_POST['service_id'] ?? '' );
                $ok = $sb->from( 'services' )->eq( 'id', $id )->service()->delete();
                wp_send_json( [ 'success' => $ok ] );
                break;

            case 'add_testimonial':
                $result = $sb->from( 'testimonials' )->service()->insert( [
                    'patient_name'  => sanitize_text_field( $_POST['patient_name'] ?? '' ),
                    'rating'        => (int) ( $_POST['rating'] ?? 5 ),
                    'display_order' => (int) ( $_POST['display_order'] ?? 0 ),
                    'content'       => sanitize_textarea_field( $_POST['content'] ?? '' ),
                    'is_visible'    => (bool) ( $_POST['is_visible'] === '1' ),
                ] );
                wp_send_json( [ 'success' => $result !== null ] );
                break;

            case 'delete_testimonial':
                $id = sanitize_text_field( $_POST['testimonial_id'] ?? '' );
                $ok = $sb->from( 'testimonials' )->eq( 'id', $id )->service()->delete();
                wp_send_json( [ 'success' => $ok ] );
                break;

            case 'add_faq':
                $result = $sb->from( 'faqs' )->service()->insert( [
                    'question'      => sanitize_text_field( $_POST['question'] ?? '' ),
                    'display_order' => (int) ( $_POST['display_order'] ?? 0 ),
                    'answer'        => sanitize_textarea_field( $_POST['answer'] ?? '' ),
                    'is_visible'    => (bool) ( $_POST['is_visible'] === '1' ),
                ] );
                wp_send_json( [ 'success' => $result !== null ] );
                break;

            case 'delete_faq':
                $id = sanitize_text_field( $_POST['faq_id'] ?? '' );
                $ok = $sb->from( 'faqs' )->eq( 'id', $id )->service()->delete();
                wp_send_json( [ 'success' => $ok ] );
                break;

            default:
                wp_send_json_error( 'Unknown action' );
        }
    }
}

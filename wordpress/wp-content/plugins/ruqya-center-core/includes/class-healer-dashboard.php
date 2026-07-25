<?php
/**
 * Healer Dashboard — custom frontend pages for healers.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Healer_Dashboard {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_menu', [ $this, 'register_menus' ] );
    }

    /**
     * Register healer-specific admin pages.
     */
    public function register_menus(): void {
        // Only show for healers (not admins — they already have full access)
        $user = wp_get_current_user();
        if ( ! in_array( 'ruqya_healer', $user->roles, true ) ) {
            return;
        }

        add_menu_page(
            'لوحة المعالج',
            'لوحة المعالج',
            'read',
            'ruqya-healer',
            [ $this, 'page_dashboard' ],
            'dashicons-calendar-alt',
            3
        );

        add_submenu_page(
            'ruqya-healer',
            'حجوزاتي',
            'حجوزاتي',
            'read',
            'ruqya-healer-bookings',
            [ $this, 'page_bookings' ]
        );

        add_submenu_page(
            'ruqya-healer',
            'ملفي الشخصي',
            'ملفي الشخصي',
            'read',
            'ruqya-healer-profile',
            [ $this, 'page_profile' ]
        );
    }

    /**
     * Get the healer record linked to the current WordPress user.
     */
    private function get_current_healer(): ?object {
        $user = wp_get_current_user();
        $healer_id = get_user_meta( $user->ID, 'ruqya_healer_id', true );
        if ( ! $healer_id ) {
            return null;
        }
        $sb = Ruqya_Supabase::instance();
        return $sb->from( 'healers' )->select( '*' )->eq( 'id', $healer_id )->service()->single()->get();
    }

    public function page_dashboard(): void {
        $healer = $this->get_current_healer();
        if ( ! $healer ) {
            echo '<div class="wrap ruqya-admin" dir="rtl"><div class="notice notice-warning"><p>لم يتم ربط حسابك بمعالج. يرجى التواصل مع الإدارة.</p></div></div>';
            return;
        }

        $sb = Ruqya_Supabase::instance();
        $bookings = Ruqya_Booking::instance()->get_list( [ 'healer_id' => $healer->id ], 50 );
        $today = date( 'Y-m-d' );
        $today_bookings = array_filter( $bookings, function( $b ) use ( $today ) {
            return ( $b->available_slots->slot_date ?? '' ) === $today;
        } );
        $upcoming = array_filter( $bookings, function( $b ) use ( $today ) {
            return ( $b->available_slots->slot_date ?? '' ) > $today && in_array( $b->status ?? '', [ 'pending', 'confirmed' ] );
        } );
        $month_count = count( array_filter( $bookings, function( $b ) {
            return substr( $b->created_at ?? '', 0, 7 ) === date( 'Y-m' );
        } ) );

        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>مرحباً <?php echo esc_html( $healer->display_name ); ?> 👋</h1>

            <div class="ruqya-stats-grid">
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">📅</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo count( $today_bookings ); ?></span>
                        <span class="stat-label">حجوزات اليوم</span>
                    </div>
                </div>
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #e3f2fd; color: #1565c0;">📋</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo count( $upcoming ); ?></span>
                        <span class="stat-label">حجوزات قادمة</span>
                    </div>
                </div>
                <div class="ruqya-stat-card">
                    <div class="stat-icon" style="background: #f3e5f5; color: #7b1fa2;">🗓️</div>
                    <div class="stat-content">
                        <span class="stat-number"><?php echo $month_count; ?></span>
                        <span class="stat-label">هذا الشهر</span>
                    </div>
                </div>
            </div>

            <?php if ( ! empty( $today_bookings ) ) : ?>
            <div class="ruqya-section">
                <h2>حجوزات اليوم</h2>
                <table class="ruqya-table">
                    <thead><tr><th>المريض</th><th>الهاتف</th><th>الخدمة</th><th>الوقت</th><th>الحالة</th></tr></thead>
                    <tbody>
                        <?php foreach ( $today_bookings as $b ) : ?>
                        <tr>
                            <td><strong><?php echo esc_html( $b->patient_name ?? '' ); ?></strong></td>
                            <td dir="ltr"><?php echo esc_html( $b->patient_phone ?? '' ); ?></td>
                            <td><?php echo esc_html( $b->services->name ?? '—' ); ?></td>
                            <td dir="ltr"><?php echo esc_html( substr( $b->available_slots->start_time ?? '', 0, 5 ) ); ?></td>
                            <td><span class="ruqya-badge <?php echo ( $b->status ?? '' ) === 'confirmed' ? 'info' : 'warning'; ?>"><?php echo esc_html( $b->status ?? 'pending' ); ?></span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }

    public function page_bookings(): void {
        $healer = $this->get_current_healer();
        if ( ! $healer ) {
            echo '<div class="wrap" dir="rtl"><p>لم يتم ربط حسابك بمعالج.</p></div>';
            return;
        }

        $bookings = Ruqya_Booking::instance()->get_list( [ 'healer_id' => $healer->id ], 100 );
        $status_labels = [ 'pending' => 'بانتظار التأكيد', 'confirmed' => 'مؤكد', 'completed' => 'مكتمل', 'cancelled' => 'ملغي', 'no_show' => 'لم يحضر' ];
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>حجوزاتي</h1>
            <table class="ruqya-table">
                <thead><tr><th>المريض</th><th>الهاتف</th><th>الخدمة</th><th>التاريخ/الوقت</th><th>الحالة</th><th>ملاحظات</th></tr></thead>
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
                            <select class="ruqya-healer-status-select" data-booking-id="<?php echo esc_attr( $b->id ); ?>" style="padding: 5px 8px; border: 1px solid #d4d0c6; border-radius: 6px; font-size: 0.85rem; background: #fff;">
                                <?php foreach ( $status_labels as $val => $label ) : ?>
                                    <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $b->status ?? '', $val ); ?>><?php echo esc_html( $label ); ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button class="button ruqya-healer-save-status" data-booking-id="<?php echo esc_attr( $b->id ); ?>">حفظ</button>
                        </td>
                        <td><?php echo esc_html( mb_substr( $b->patient_notes ?? '', 0, 100 ) ); ?></td>
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

    public function page_profile(): void {
        $healer = $this->get_current_healer();
        if ( ! $healer ) {
            echo '<div class="wrap" dir="rtl"><p>لم يتم ربط حسابك بمعالج.</p></div>';
            return;
        }
        ?>
        <div class="wrap ruqya-admin" dir="rtl">
            <h1>ملفي الشخصي</h1>
            <div class="ruqya-section" style="max-width: 600px;">
                <div class="ruqya-form-group">
                    <label><strong>الاسم</strong></label>
                    <p><?php echo esc_html( $healer->display_name ); ?></p>
                </div>
                <div class="ruqya-form-group">
                    <label><strong>اللقب</strong></label>
                    <p><?php echo esc_html( $healer->title ?? '—' ); ?></p>
                </div>
                <div class="ruqya-form-group">
                    <label><strong>التخصص</strong></label>
                    <p><?php echo esc_html( $healer->specialization ?? '—' ); ?></p>
                </div>
                <div class="ruqya-form-group">
                    <label><strong>سنوات الخبرة</strong></label>
                    <p><?php echo esc_html( $healer->experience_years ?? '—' ); ?></p>
                </div>
            </div>
        </div>
        <?php
    }
}

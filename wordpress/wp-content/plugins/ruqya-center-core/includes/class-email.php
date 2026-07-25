<?php
/**
 * Email notifications via Resend API.
 * Mirrors the Next.js email templates exactly.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Email {

    private static ?self $instance = null;
    private string $api_key;
    private string $from;
    private string $admin_email;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->api_key     = defined( 'RESEND_API_KEY' ) ? RESEND_API_KEY : '';
        $this->from        = 'مركز الرقية بكلام الرحمن <noreply@ruqyacenter.com>';
        $this->admin_email = defined( 'ADMIN_EMAIL' ) ? ADMIN_EMAIL : get_option( 'admin_email' );
    }

    /**
     * Send an email via Resend API.
     */
    public function send( string $to, string $subject, string $html ): bool {
        if ( empty( $this->api_key ) ) {
            error_log( 'Ruqya Email: RESEND_API_KEY not configured. Skipping email.' );
            return true; // Don't block on missing key
        }

        $response = wp_remote_post( 'https://api.resend.com/emails', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode( [
                'from'    => $this->from,
                'to'      => [ $to ],
                'subject' => $subject,
                'html'    => $html,
            ] ),
            'timeout' => 15,
        ] );

        if ( is_wp_error( $response ) ) {
            error_log( 'Ruqya Email Error: ' . $response->get_error_message() );
            return false;
        }

        $code = wp_remote_retrieve_response_code( $response );
        if ( $code >= 400 ) {
            error_log( 'Ruqya Email HTTP ' . $code . ': ' . wp_remote_retrieve_body( $response ) );
            return false;
        }

        return true;
    }

    /**
     * Helper: Format date with Arabic day name.
     */
    private function format_date( string $date_str ): string {
        $days = [ 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت' ];
        $ts   = strtotime( $date_str );
        $day  = $days[ (int) date( 'w', $ts ) ];
        return $day . ' ' . $date_str;
    }

    /**
     * Helper: Format time to 12h Arabic.
     */
    private function format_time( string $time_str ): string {
        $parts = explode( ' - ', $time_str );
        $result = [];
        foreach ( $parts as $t ) {
            $t = trim( $t );
            $segments = explode( ':', $t );
            $h = (int) $segments[0];
            $m = $segments[1] ?? '00';
            $period = $h >= 12 ? 'م' : 'ص';
            $h12 = $h % 12 ?: 12;
            $result[] = "{$h12}:{$m} {$period}";
        }
        return implode( ' - ', $result );
    }

    /* ── Booking emails ──────────────────────────────────────── */

    /**
     * Send booking confirmation emails to admin + patient.
     */
    public function send_booking_emails( array $details ): void {
        $formatted_date = $this->format_date( $details['date'] ?? '' );
        $formatted_time = $this->format_time( $details['time'] ?? '' );

        // 1. Email to Admin
        $admin_html = '
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #0b5c47;">يوجد حجز موعد جديد 📅</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">المريض</td><td style="padding: 10px; border: 1px solid #ddd;">' . esc_html( $details['patient_name'] ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الهاتف</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">' . esc_html( $details['patient_phone'] ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الخدمة المطلوبة</td><td style="padding: 10px; border: 1px solid #ddd;">' . esc_html( $details['service_name'] ?? '' ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">تاريخ الموعد</td><td style="padding: 10px; border: 1px solid #ddd;">' . esc_html( $formatted_date ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الوقت</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">' . esc_html( $formatted_time ) . '</td></tr>
            </table>
            <p style="margin-top: 20px;">يرجى الدخول للوحة التحكم للاعتماد.</p>
        </div>';

        $this->send(
            $this->admin_email,
            'حجز جديد من: ' . ( $details['patient_name'] ?? '' ),
            $admin_html
        );

        // 2. Email to Patient
        if ( ! empty( $details['patient_email'] ) ) {
            $patient_html = '
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #0b5c47;">السلام عليكم ' . esc_html( $details['patient_name'] ) . '،</h2>
                <p>تم استلام طلب حجزك بنجاح في مركز الرقية. نحن بصدد مراجعة الطلب وسنقوم بتأكيده قريباً.</p>
                <br>
                <h3 style="color: #333;">تفاصيل الموعد المبدئي:</h3>
                <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
                    <li><strong>الخدمة:</strong> ' . esc_html( $details['service_name'] ?? '' ) . '</li>
                    <li><strong>التاريخ:</strong> ' . esc_html( $formatted_date ) . '</li>
                    <li><strong>الوقت:</strong> ' . esc_html( $formatted_time ) . '</li>
                    <li><strong>المعالج:</strong> ' . esc_html( $details['healer_name'] ?? 'سيتم التعيين من قِبل الإدارة' ) . '</li>
                </ul>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 13px; color: #777;">هذه رسالة آلية، يرجى عدم الرد عليها. للتواصل المباشر يرجى استخدام أرقام المركز الرسمية.</p>
            </div>';

            $this->send(
                $details['patient_email'],
                'تأكيد تقديم طلب حجز موعد - مركز الرقية',
                $patient_html
            );
        }
    }

    /**
     * Send healer assignment + patient confirmation emails.
     */
    public function send_assignment_emails( object $booking, string $healer_email = '' ): void {
        $service_name = $booking->services->name ?? 'غير محدد';
        $slot_date    = $booking->available_slots->slot_date ?? 'غير محدد';
        $slot_time    = '';
        if ( isset( $booking->available_slots->start_time ) ) {
            $slot_time = substr( $booking->available_slots->start_time, 0, 5 ) . ' - ' . substr( $booking->available_slots->end_time ?? '', 0, 5 );
        }
        $healer_name  = $booking->healers->display_name ?? 'غير محدد';
        $formatted_date = $this->format_date( $slot_date );

        // 1. Email to Healer
        if ( $healer_email ) {
            $healer_html = '
            <div dir="rtl" style="font-family: \'Segoe UI\', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0b5c47, #0a7d5a); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📅 لديك موعد جديد</h2>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">مركز الرقية بكلام الرحمن</p>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e8e8e8; border-top: none;">
                    <p style="color: #333; font-size: 16px; margin-top: 0;">السلام عليكم ورحمة الله <strong>' . esc_html( $healer_name ) . '</strong>،</p>
                    <p style="color: #555; line-height: 1.7;">تم تعيين موعد جديد إليك من قبل الإدارة. يرجى الاطلاع على التفاصيل:</p>
                    <div style="background: #f8faf9; border: 1px solid #e0e8e4; border-radius: 10px; padding: 20px; margin: 20px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 10px 5px; color: #888; font-size: 13px; width: 90px;">المريض</td><td style="padding: 10px 5px; color: #333; font-weight: 600;">' . esc_html( $booking->patient_name ) . '</td></tr>
                            <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                            <tr><td style="padding: 10px 5px; color: #888; font-size: 13px;">الهاتف</td><td style="padding: 10px 5px; color: #333;" dir="ltr">' . esc_html( $booking->patient_phone ?? '—' ) . '</td></tr>
                            <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                            <tr><td style="padding: 10px 5px; color: #888; font-size: 13px;">الخدمة</td><td style="padding: 10px 5px; color: #333;">' . esc_html( $service_name ) . '</td></tr>
                            <tr><td colspan="2" style="border-bottom: 1px solid #e8e8e8;"></td></tr>
                            <tr><td style="padding: 10px 5px; color: #888; font-size: 13px;">التاريخ</td><td style="padding: 10px 5px; color: #0b5c47; font-weight: 600;">📅 ' . esc_html( $formatted_date ) . '</td></tr>
                        </table>
                    </div>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="https://ruqyacenter.com/healer" style="display: inline-block; background: #0b5c47; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">الدخول للوحة المعالج</a>
                    </div>
                </div>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e8e8e8; border-top: none;">
                    <p style="color: #999; font-size: 12px; margin: 0;">هذه رسالة آلية من مركز الرقية بكلام الرحمن — يرجى عدم الرد عليها</p>
                </div>
            </div>';

            $this->send(
                $healer_email,
                '📅 موعد جديد: ' . $booking->patient_name . ' — ' . $formatted_date,
                $healer_html
            );
        }

        // 2. Confirmation email to Patient
        if ( ! empty( $booking->patient_email ) && ( $booking->status ?? '' ) === 'confirmed' ) {
            $patient_html = '
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #0b5c47;">أهلاً بك ' . esc_html( $booking->patient_name ) . '،</h2>
                <p>يسعدنا إخبارك بأنه <strong>تم تأكيد موعدك</strong> بنجاح في مركز الرقية.</p>
                <br>
                <h3 style="color: #333;">تفاصيل الموعد النهائي:</h3>
                <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
                    <li><strong>الخدمة:</strong> ' . esc_html( $service_name ) . '</li>
                    <li><strong>التاريخ:</strong> ' . esc_html( $formatted_date ) . '</li>
                    <li><strong>المعالج المسؤول:</strong> ' . esc_html( $healer_name ) . '</li>
                </ul>
                <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px;">
                    نسأل الله لك العافية والشفاء. يرجى التواجد/الاستعداد قبل موعد الجلسة بـ 10 دقائق.
                </div>
            </div>';

            $this->send(
                $booking->patient_email,
                'تأكيد موعد الجلسة - مركز الرقية',
                $patient_html
            );
        }
    }

    /**
     * Send contact form notification to admin.
     */
    public function send_contact_email( array $data ): void {
        $html = '
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #0b5c47;">لديك رسالة جديدة من الموقع 📬</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 100px;">الاسم</td><td style="padding: 10px; border: 1px solid #ddd;">' . esc_html( $data['name'] ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">البريد</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">' . esc_html( $data['email'] ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الهاتف</td><td style="padding: 10px; border: 1px solid #ddd; direction: ltr; text-align: right;">' . esc_html( $data['phone'] ?? 'غير متوفر' ) . '</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الرسالة</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">' . esc_html( $data['message'] ) . '</td></tr>
            </table>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">يمكنك عرض الرسالة والتواصل معه من خلال لوحة التحكم الخاصة بالمركز.</p>
        </div>';

        $this->send(
            $this->admin_email,
            'رسالة جديدة من: ' . ( $data['name'] ?? '' ),
            $html
        );
    }
}

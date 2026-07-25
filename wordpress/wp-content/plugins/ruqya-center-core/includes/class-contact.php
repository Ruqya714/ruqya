<?php
/**
 * Contact form handler — saves to Supabase and emails admin.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Contact {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {}

    /**
     * Submit a contact message.
     */
    public function submit( array $data ): array {
        $name    = sanitize_text_field( $data['name'] ?? '' );
        $email   = sanitize_email( $data['email'] ?? '' );
        $phone   = sanitize_text_field( $data['phone'] ?? '' );
        $message = sanitize_textarea_field( $data['message'] ?? '' );

        if ( ! $name || ! is_email( $email ) || ! $message ) {
            return [ 'success' => false, 'error' => 'الرجاء ملء جميع الحقول المطلوبة' ];
        }

        $sb = Ruqya_Supabase::instance();
        $result = $sb->from( 'contact_messages' )->service()->insert( [
            'name'    => $name,
            'email'   => $email,
            'phone'   => $phone,
            'message' => $message,
        ] );

        if ( ! $result ) {
            return [ 'success' => false, 'error' => 'حدث خطأ في حفظ الرسالة' ];
        }

        // Send email notification
        Ruqya_Email::instance()->send_contact_email( [
            'name'    => $name,
            'email'   => $email,
            'phone'   => $phone,
            'message' => $message,
        ] );

        return [ 'success' => true ];
    }
}

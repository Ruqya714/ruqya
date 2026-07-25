<?php
/**
 * Plugin Name: Ruqya Center Core
 * Plugin URI:  https://ruqyacenter.com
 * Description: Backend engine for the Ruqya Center — connects WordPress to Supabase, handles bookings, payments, emails, and admin dashboards.
 * Version:     2.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author:      Ruqya Center Dev
 * Text Domain: ruqya
 * Domain Path: /languages
 */

defined( 'ABSPATH' ) || exit;

/* ── Constants ─────────────────────────────────────────────── */
define( 'RUQYA_VERSION', '2.1.0' );
define( 'RUQYA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'RUQYA_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/* ── Autoload includes ─────────────────────────────────────── */
require_once RUQYA_PLUGIN_DIR . 'includes/class-supabase.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-email.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-booking.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-contact.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-payment.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once RUQYA_PLUGIN_DIR . 'includes/class-seo.php';

if ( is_admin() ) {
    require_once RUQYA_PLUGIN_DIR . 'includes/class-admin-dashboard.php';
    require_once RUQYA_PLUGIN_DIR . 'includes/class-healer-dashboard.php';
}

/* ── Boot ──────────────────────────────────────────────────── */
final class Ruqya_Center_Core {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize all modules
        Ruqya_Supabase::instance();
        Ruqya_Email::instance();
        Ruqya_Booking::instance();
        Ruqya_Contact::instance();
        Ruqya_Payment::instance();
        Ruqya_REST_API::instance();
        Ruqya_SEO::instance();

        if ( is_admin() ) {
            Ruqya_Admin_Dashboard::instance();
            Ruqya_Healer_Dashboard::instance();
        }

        // Register custom user role on init
        add_action( 'init', [ $this, 'register_roles' ] );

        // Webhook URL Interceptor for NELS (without WooCommerce)
        add_action( 'init', [ $this, 'intercept_nels_webhook' ] );
    }

    /**
     * Intercept and handle NELS/Mtjree webhook requests at /wc-api/nels_payment/ or /wc-api/mtjree_payment/
     */
    public function intercept_nels_webhook(): void {
        $request_uri = $_SERVER['REQUEST_URI'] ?? '';
        if ( strpos( $request_uri, '/wc-api/nels_payment/' ) !== false || strpos( $request_uri, '/wc-api/mtjree_payment/' ) !== false ) {
            $raw_payload = file_get_contents( 'php://input' );
            $payload     = json_decode( $raw_payload, true );

            if ( is_array( $payload ) ) {
                $ok = Ruqya_Payment::instance()->handle_webhook( $payload );
                if ( $ok ) {
                    status_header( 200 );
                    wp_send_json( [ 'success' => true, 'message' => 'Payment webhook processed successfully.' ] );
                } else {
                    status_header( 400 );
                    wp_send_json( [ 'success' => false, 'message' => 'Invalid signature or payload.' ] );
                }
            } else {
                status_header( 400 );
                wp_send_json( [ 'success' => false, 'message' => 'Empty webhook payload.' ] );
            }
            exit;
        }
    }

    /**
     * Register custom WordPress roles for healers.
     */
    public function register_roles(): void {
        if ( ! get_role( 'ruqya_healer' ) ) {
            add_role( 'ruqya_healer', __( 'معالج', 'ruqya' ), [
                'read'         => true,
                'upload_files' => true,
            ] );
        }
    }

    /**
     * Activation hook — create pages automatically.
     */
    public static function activate(): void {
        // Create required pages
        $pages = [
            'booking'        => [ 'title' => 'حجز استشارة',       'template' => 'page-booking.php' ],
            'contact'        => [ 'title' => 'اتصل بنا',          'template' => 'page-contact.php' ],
            'about'          => [ 'title' => 'من نحن',            'template' => 'page-about.php' ],
            'services'       => [ 'title' => 'خدماتنا',           'template' => 'page-services.php' ],
            'treatment'      => [ 'title' => 'الرحلة العلاجية',    'template' => 'page-treatment.php' ],
            'faq'            => [ 'title' => 'الأسئلة الشائعة',    'template' => 'page-faq.php' ],
            'courses'        => [ 'title' => 'الكورسات والدورات',  'template' => 'page-courses.php' ],
            'blog'           => [ 'title' => 'المقالات',           'template' => 'page-blog.php' ],
            'privacy-policy' => [ 'title' => 'سياسة الخصوصية',    'template' => 'page-privacy.php' ],
            'terms-of-service' => [ 'title' => 'شروط الخدمة',     'template' => 'page-terms.php' ],
            'payment-result' => [ 'title' => 'نتيجة الدفع',       'template' => 'page-payment-result.php' ],
        ];

        foreach ( $pages as $slug => $page ) {
            $existing = get_page_by_path( $slug );
            if ( ! $existing ) {
                $id = wp_insert_post( [
                    'post_title'  => $page['title'],
                    'post_name'   => $slug,
                    'post_status' => 'publish',
                    'post_type'   => 'page',
                    'post_content' => '', // Clear any default content
                ] );
            } else {
                $id = $existing->ID;
                // Clear default WordPress content (e.g. Privacy Policy boilerplate)
                wp_update_post( [
                    'ID'           => $id,
                    'post_content' => '',
                ] );
            }
            if ( $id && $page['template'] ) {
                update_post_meta( $id, '_wp_page_template', $page['template'] );
            }
        }

        // Set front page
        $front = get_page_by_path( 'front-page' );
        if ( ! $front ) {
            $front_id = wp_insert_post( [
                'post_title'  => 'الصفحة الرئيسية',
                'post_name'   => 'front-page',
                'post_status' => 'publish',
                'post_type'   => 'page',
            ] );
        } else {
            $front_id = $front->ID;
        }
        update_option( 'page_on_front', $front_id );
        update_option( 'show_on_front', 'page' );

        // Set blog page
        $blog = get_page_by_path( 'blog' );
        if ( $blog ) {
            update_option( 'page_for_posts', $blog->ID );
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Deactivation hook.
     */
    public static function deactivate(): void {
        flush_rewrite_rules();
    }
}

// Boot the plugin
Ruqya_Center_Core::instance();

// Hooks
register_activation_hook( __FILE__, [ 'Ruqya_Center_Core', 'activate' ] );
register_deactivation_hook( __FILE__, [ 'Ruqya_Center_Core', 'deactivate' ] );

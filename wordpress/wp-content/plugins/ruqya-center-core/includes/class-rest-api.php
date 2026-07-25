<?php
/**
 * REST API endpoints for AJAX operations (booking form, contact form, payment).
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_REST_API {

    private static ?self $instance = null;
    private const NAMESPACE = 'ruqya/v1';

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes(): void {
        /* ── Public endpoints ──────────────────────────────────── */

        // Get active services
        register_rest_route( self::NAMESPACE, '/services', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_services' ],
            'permission_callback' => '__return_true',
        ] );

        // Get site settings
        register_rest_route( self::NAMESPACE, '/settings', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_settings' ],
            'permission_callback' => '__return_true',
        ] );

        // Get available slot dates
        register_rest_route( self::NAMESPACE, '/slots/dates', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_slot_dates' ],
            'permission_callback' => '__return_true',
        ] );

        // Get time slots for a specific date
        register_rest_route( self::NAMESPACE, '/slots/times', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_slot_times' ],
            'permission_callback' => '__return_true',
        ] );

        // Unified: Get all available slots (for booking.js)
        register_rest_route( self::NAMESPACE, '/slots', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'get_all_slots' ],
            'permission_callback' => '__return_true',
        ] );

        // Create booking
        register_rest_route( self::NAMESPACE, '/bookings', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'create_booking' ],
            'permission_callback' => '__return_true',
        ] );

        // Submit contact message
        register_rest_route( self::NAMESPACE, '/contact', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'submit_contact' ],
            'permission_callback' => '__return_true',
        ] );

        // Create payment link
        register_rest_route( self::NAMESPACE, '/payment/create', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'create_payment' ],
            'permission_callback' => '__return_true',
        ] );

        // Payment webhook
        register_rest_route( self::NAMESPACE, '/payment/webhook', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'payment_webhook' ],
            'permission_callback' => '__return_true',
        ] );

        // Payment status check
        register_rest_route( self::NAMESPACE, '/payment/status', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'payment_status' ],
            'permission_callback' => '__return_true',
        ] );

        // Verify payment by booking_id
        register_rest_route( self::NAMESPACE, '/payment/verify', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'verify_booking_payment' ],
            'permission_callback' => '__return_true',
        ] );

        /* ── Admin endpoints (require login) ───────────────────── */

        // Get bookings list (admin)
        register_rest_route( self::NAMESPACE, '/admin/bookings', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'admin_get_bookings' ],
            'permission_callback' => [ $this, 'is_admin_user' ],
        ] );

        // Update booking status (admin/healer)
        register_rest_route( self::NAMESPACE, '/admin/bookings/(?P<id>[a-f0-9-]+)/status', [
            'methods'             => 'PATCH',
            'callback'            => [ $this, 'admin_update_booking_status' ],
            'permission_callback' => [ $this, 'is_healer_user' ],
        ] );

        // Get single booking details (admin/healer)
        register_rest_route( self::NAMESPACE, '/admin/bookings/(?P<id>[a-f0-9-]+)', [
            'methods'             => 'GET',
            'callback'            => [ $this, 'admin_get_booking_single' ],
            'permission_callback' => [ $this, 'is_healer_user' ],
        ] );

        // Update booking healer (admin)
        register_rest_route( self::NAMESPACE, '/admin/bookings/(?P<id>[a-f0-9-]+)/healer', [
            'methods'             => 'PATCH',
            'callback'            => [ $this, 'admin_update_booking_healer' ],
            'permission_callback' => [ $this, 'is_admin_user' ],
        ] );

        // CRUD slots (admin)
        register_rest_route( self::NAMESPACE, '/admin/slots', [
            'methods'             => [ 'GET', 'POST' ],
            'callback'            => [ $this, 'admin_slots' ],
            'permission_callback' => [ $this, 'is_admin_user' ],
        ] );

        // Bulk generate slots (admin)
        register_rest_route( self::NAMESPACE, '/admin/slots/bulk', [
            'methods'             => 'POST',
            'callback'            => [ $this, 'admin_slots_bulk' ],
            'permission_callback' => [ $this, 'is_admin_user' ],
        ] );

        register_rest_route( self::NAMESPACE, '/admin/slots/(?P<id>[a-f0-9-]+)', [
            'methods'             => [ 'PATCH', 'DELETE' ],
            'callback'            => [ $this, 'admin_slot_single' ],
            'permission_callback' => [ $this, 'is_admin_user' ],
        ] );
    }

    /* ── Permission checks ───────────────────────────────────── */

    public function is_admin_user(): bool {
        return current_user_can( 'manage_options' );
    }

    public function is_healer_user(): bool {
        $user = wp_get_current_user();
        return in_array( 'ruqya_healer', $user->roles, true ) || current_user_can( 'manage_options' );
    }

    /* ── Public callbacks ────────────────────────────────────── */

    public function get_services(): \WP_REST_Response {
        $sb = Ruqya_Supabase::instance();
        $services = $sb->get_services();
        return new \WP_REST_Response( $services, 200 );
    }

    public function get_settings(): \WP_REST_Response {
        $sb = Ruqya_Supabase::instance();
        $settings = $sb->get_settings();
        return new \WP_REST_Response( $settings, 200 );
    }

    public function get_slot_dates( \WP_REST_Request $request ): \WP_REST_Response {
        $min_date = $request->get_param( 'min_date' ) ?: date( 'Y-m-d' );
        $sb       = Ruqya_Supabase::instance();
        $slots    = $sb->get_available_slots( $min_date );

        // Extract unique dates
        $dates = [];
        foreach ( $slots as $slot ) {
            $d = $slot->slot_date ?? '';
            if ( $d && ! in_array( $d, $dates, true ) ) {
                $dates[] = $d;
            }
        }

        return new \WP_REST_Response( $dates, 200 );
    }

    public function get_slot_times( \WP_REST_Request $request ): \WP_REST_Response {
        $date = $request->get_param( 'date' );
        if ( ! $date ) {
            return new \WP_REST_Response( [ 'error' => 'date required' ], 400 );
        }

        $sb    = Ruqya_Supabase::instance();
        $slots = $sb->from( 'available_slots' )
            ->select( 'id,slot_date,start_time,end_time,healer_id,max_capacity,current_bookings,healers(display_name)' )
            ->eq( 'slot_date', $date )
            ->eq( 'is_booked', 'false' )
            ->order( 'start_time' )
            ->get();

        // Filter slots with remaining capacity
        $available = [];
        if ( is_array( $slots ) ) {
            foreach ( $slots as $s ) {
                if ( ( $s->current_bookings ?? 0 ) < ( $s->max_capacity ?? 1 ) ) {
                    $available[] = [
                        'id'          => $s->id,
                        'start_time'  => $s->start_time,
                        'end_time'    => $s->end_time,
                        'healer_name' => $s->healers->display_name ?? '',
                    ];
                }
            }
        }

        return new \WP_REST_Response( $available, 200 );
    }

    /**
     * Unified: Get all available slots for the booking form.
     * Called by booking.js as /slots?service_id=...&urgent=1
     */
    public function get_all_slots( \WP_REST_Request $request ): \WP_REST_Response {
        $service_id = sanitize_text_field( $request->get_param( 'service_id' ) ?? '' );
        $sb         = Ruqya_Supabase::instance();

        // Defaults
        $min_days = 0;
        $max_days = null;

        if ( ! empty( $service_id ) ) {
            $service = $sb->from( 'services' )->eq( 'id', $service_id )->service()->single()->get();
            if ( $service ) {
                $min_days = isset( $service->min_days_delay ) ? (int) $service->min_days_delay : 0;
                $max_days = isset( $service->max_days_limit ) && $service->max_days_limit !== '' && $service->max_days_limit !== null ? (int) $service->max_days_limit : null;
            }
        } else {
            // Fallback if no service_id (e.g. backward compatibility)
            $urgent      = $request->get_param( 'urgent' );
            $settings    = $sb->get_settings();
            $urgent_days = (int) ( $settings['urgent_booking_days'] ?? 2 );
            $normal_delay = (int) ( $settings['normal_booking_delay_days'] ?? 7 );
            
            if ( $urgent ) {
                $min_days = 0;
                $max_days = $urgent_days;
            } else {
                $min_days = $normal_delay;
                $max_days = null;
            }
        }

        $min_date = date( 'Y-m-d', strtotime( "+{$min_days} days" ) );
        $max_date = $max_days !== null ? date( 'Y-m-d', strtotime( "+{$max_days} days" ) ) : '';

        $q  = $sb->from( 'available_slots' )
            ->select( 'id,slot_date,start_time,end_time,healer_id,max_capacity,current_bookings,healers(display_name)' )
            ->eq( 'is_booked', 'false' )
            ->gte( 'slot_date', $min_date )
            ->order( 'slot_date' );

        if ( $max_date ) {
            $q = $q->lte( 'slot_date', $max_date );
        }

        $slots = $q->get();

        // Filter by remaining capacity
        $available = [];
        if ( is_array( $slots ) ) {
            foreach ( $slots as $s ) {
                if ( ( $s->current_bookings ?? 0 ) < ( $s->max_capacity ?? 1 ) ) {
                    $available[] = $s;
                }
            }
        }

        return new \WP_REST_Response( [ 'slots' => $available ], 200 );
    }

    public function create_booking( \WP_REST_Request $request ): \WP_REST_Response {
        $data   = $request->get_json_params();
        $result = Ruqya_Booking::instance()->create( $data );

        if ( $result['success'] ) {
            return new \WP_REST_Response( $result, 200 );
        }
        return new \WP_REST_Response( $result, 400 );
    }

    public function submit_contact( \WP_REST_Request $request ): \WP_REST_Response {
        $data   = $request->get_json_params();
        $result = Ruqya_Contact::instance()->submit( $data );

        if ( $result['success'] ) {
            return new \WP_REST_Response( $result, 200 );
        }
        return new \WP_REST_Response( $result, 400 );
    }

    public function create_payment( \WP_REST_Request $request ): \WP_REST_Response {
        $data   = $request->get_json_params();
        $result = Ruqya_Payment::instance()->create_payment( $data );

        if ( $result['success'] ) {
            return new \WP_REST_Response( $result, 200 );
        }
        return new \WP_REST_Response( $result, 400 );
    }

    public function payment_webhook( \WP_REST_Request $request ): \WP_REST_Response {
        $payload = $request->get_json_params();
        $ok      = Ruqya_Payment::instance()->handle_webhook( $payload );
        return new \WP_REST_Response( [ 'received' => $ok ], $ok ? 200 : 400 );
    }

    public function payment_status( \WP_REST_Request $request ): \WP_REST_Response {
        $id     = $request->get_param( 'payment_id' );
        $result = Ruqya_Payment::instance()->check_status( $id );
        return new \WP_REST_Response( $result ?? [ 'error' => 'Not found' ], $result ? 200 : 404 );
    }

    public function verify_booking_payment( \WP_REST_Request $request ): \WP_REST_Response {
        $booking_id = $request->get_param( 'booking_id' );
        if ( ! $booking_id ) {
            return new \WP_REST_Response( [ 'success' => false, 'error' => 'Missing booking_id' ], 400 );
        }
        $result = Ruqya_Payment::instance()->verify_booking_payment( $booking_id );
        return new \WP_REST_Response( $result, $result['success'] ? 200 : 400 );
    }

    /* ── Admin callbacks ─────────────────────────────────────── */

    public function admin_get_bookings( \WP_REST_Request $request ): \WP_REST_Response {
        $filters = [
            'status'         => $request->get_param( 'status' ),
            'healer_id'      => $request->get_param( 'healer_id' ),
            'payment_status' => $request->get_param( 'payment_status' ),
        ];
        $limit   = (int) ( $request->get_param( 'limit' ) ?: 50 );
        $offset  = (int) ( $request->get_param( 'offset' ) ?: 0 );

        $bookings = Ruqya_Booking::instance()->get_list( $filters, $limit, $offset );
        return new \WP_REST_Response( $bookings, 200 );
    }

    public function admin_get_booking_single( \WP_REST_Request $request ): \WP_REST_Response {
        $id      = $request->get_param( 'id' );
        $booking = Ruqya_Booking::instance()->get( $id );
        if ( ! $booking ) {
            return new \WP_REST_Response( [ 'error' => 'Booking not found' ], 404 );
        }
        return new \WP_REST_Response( $booking, 200 );
    }

    public function admin_update_booking_healer( \WP_REST_Request $request ): \WP_REST_Response {
        $id        = $request->get_param( 'id' );
        $healer_id = $request->get_param( 'healer_id' );
        $sb        = Ruqya_Supabase::instance();
        
        $result = $sb->from( 'bookings' )
            ->eq( 'id', $id )
            ->service()
            ->update( [ 'healer_id' => $healer_id ?: null ] );
            
        return new \WP_REST_Response( [ 'success' => $result !== null ], $result !== null ? 200 : 400 );
    }

    public function admin_update_booking_status( \WP_REST_Request $request ): \WP_REST_Response {
        $id     = $request->get_param( 'id' );
        $status = $request->get_param( 'status' );
        $ok     = Ruqya_Booking::instance()->update_status( $id, $status );
        return new \WP_REST_Response( [ 'success' => $ok ], $ok ? 200 : 400 );
    }

    public function admin_slots( \WP_REST_Request $request ): \WP_REST_Response {
        $sb = Ruqya_Supabase::instance();

        if ( $request->get_method() === 'POST' ) {
            $data   = $request->get_json_params();
            $result = $sb->from( 'available_slots' )->service()->insert( $data );
            return new \WP_REST_Response( $result, $result ? 201 : 400 );
        }

        // GET
        $slots = $sb->from( 'available_slots' )
            ->select( '*,healers(display_name)' )
            ->service()
            ->order( 'slot_date', 'desc' )
            ->limit( 100 )
            ->get();
        return new \WP_REST_Response( $slots ?: [], 200 );
    }

    public function admin_slot_single( \WP_REST_Request $request ): \WP_REST_Response {
        $sb = Ruqya_Supabase::instance();
        $id = $request->get_param( 'id' );

        if ( $request->get_method() === 'DELETE' ) {
            $ok = $sb->from( 'available_slots' )->eq( 'id', $id )->service()->delete();
            return new \WP_REST_Response( [ 'success' => $ok ], $ok ? 200 : 400 );
        }

        // PATCH
        $data   = $request->get_json_params();
        $result = $sb->from( 'available_slots' )->eq( 'id', $id )->service()->update( $data );
        return new \WP_REST_Response( $result, $result !== null ? 200 : 400 );
    }

    public function admin_slots_bulk( \WP_REST_Request $request ): \WP_REST_Response {
        $params = $request->get_json_params();
        
        $healer_id    = sanitize_text_field( $params['healer_id'] ?? '' );
        $start_date   = sanitize_text_field( $params['start_date'] ?? '' );
        $end_date     = sanitize_text_field( $params['end_date'] ?? '' );
        $start_time   = sanitize_text_field( $params['start_time'] ?? '' );
        $end_time     = sanitize_text_field( $params['end_time'] ?? '' );
        $duration     = (int) ( $params['duration'] ?? 30 );
        $days         = array_map( 'intval', $params['days'] ?? [] );
        $max_capacity = (int) ( $params['max_capacity'] ?? 1 );

        if ( empty( $healer_id ) || empty( $start_date ) || empty( $end_date ) || empty( $start_time ) || empty( $end_time ) || empty( $days ) ) {
            return new \WP_REST_Response( [ 'success' => false, 'error' => 'Missing required fields' ], 400 );
        }

        $sb = Ruqya_Supabase::instance();
        
        $current_date = strtotime( $start_date );
        $last_date    = strtotime( $end_date );
        $inserted_count = 0;

        while ( $current_date <= $last_date ) {
            $day_of_week = (int) date( 'w', $current_date ); // 0 = Sunday, 6 = Saturday

            if ( in_array( $day_of_week, $days, true ) ) {
                $date_str = date( 'Y-m-d', $current_date );
                
                $time_cursor = strtotime( $date_str . ' ' . $start_time );
                $end_limit   = strtotime( $date_str . ' ' . $end_time );

                while ( $time_cursor < $end_limit ) {
                    $slot_start = date( 'H:i:s', $time_cursor );
                    $slot_end   = date( 'H:i:s', $time_cursor + ( $duration * 60 ) );

                    // Make sure slot_end does not exceed end_limit
                    if ( $time_cursor + ( $duration * 60 ) > $end_limit ) {
                        break;
                    }

                    // Check if exists in Supabase
                    $existing = $sb->from( 'available_slots' )
                        ->select( 'id' )
                        ->eq( 'healer_id', $healer_id )
                        ->eq( 'slot_date', $date_str )
                        ->eq( 'start_time', $slot_start )
                        ->service()
                        ->single()
                        ->get();

                    if ( ! $existing || ! isset( $existing->id ) ) {
                        // Insert
                        $sb->from( 'available_slots' )->service()->insert( [
                            'healer_id'        => $healer_id,
                            'slot_date'        => $date_str,
                            'start_time'       => $slot_start,
                            'end_time'         => $slot_end,
                            'max_capacity'     => $max_capacity,
                            'current_bookings' => 0,
                            'is_booked'        => false,
                        ] );
                        $inserted_count++;
                    }

                    $time_cursor += $duration * 60;
                }
            }

            $current_date = strtotime( '+1 day', $current_date );
        }

        return new \WP_REST_Response( [ 'success' => true, 'count' => $inserted_count ], 200 );
    }
}

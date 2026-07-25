<?php
/**
 * Booking handler — creates bookings in Supabase and triggers emails.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Booking {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {}

    /**
     * Create a new booking.
     *
     * @param array $data  Booking data from the form.
     * @return array       [ 'success' => bool, 'booking_id' => string|null, 'error' => string|null ]
     */
    public function create( array $data ): array {
        $sb = Ruqya_Supabase::instance();

        // Map and normalize fields to handle both Next.js and booking.js keys & DB constraints
        $patient_gender = sanitize_text_field( $data['patient_gender'] ?? $data['gender'] ?? '' );
        if ( $patient_gender === 'male' || $patient_gender === 'female' ) {
            // valid
        } else {
            $patient_gender = '';
        }

        $need_type = sanitize_text_field( $data['patient_need_type'] ?? $data['need_type'] ?? '' );
        if ( $need_type === 'initial' || $need_type === 'initial_assessment' ) {
            $need_type = 'initial_assessment';
        } elseif ( $need_type === 'special' || $need_type === 'special_followup' ) {
            $need_type = 'special_followup';
        } elseif ( $need_type === 'unsure' || $need_type === 'need_specialist_opinion' ) {
            $need_type = 'need_specialist_opinion';
        } else {
            $need_type = null;
        }

        $can_travel = null;
        if ( isset( $data['patient_can_travel'] ) ) {
            $can_travel = (bool) $data['patient_can_travel'];
        } elseif ( isset( $data['can_travel'] ) ) {
            $can_travel = (bool) $data['can_travel'];
        }

        $patient_notes = sanitize_textarea_field( $data['patient_notes'] ?? '' );
        $patient_previous_ruqya = sanitize_textarea_field( $data['patient_previous_ruqya'] ?? $data['patient_notes'] ?? '' );
        if ( empty( $patient_notes ) ) {
            $patient_notes = $patient_previous_ruqya;
        }

        $marital_status = sanitize_text_field( $data['patient_marital_status'] ?? $data['marital_status'] ?? '' );
        $allowed_marital = [ 'single', 'married', 'divorced', 'widowed' ];
        if ( ! in_array( $marital_status, $allowed_marital, true ) ) {
            $marital_status = null;
        }

        // 1. Insert booking
        $booking = $sb->from( 'bookings' )->service()->insert( [
            'slot_id'               => $data['slot_id'] ?? null,
            'service_id'            => $data['service_id'] ?? null,
            'healer_id'             => $data['healer_id'] ?? null,
            'patient_name'          => sanitize_text_field( $data['patient_name'] ?? '' ),
            'patient_email'         => sanitize_email( $data['patient_email'] ?? '' ),
            'patient_phone'         => sanitize_text_field( $data['patient_phone'] ?? '' ),
            'patient_gender'        => $patient_gender ? $patient_gender : null,
            'patient_nationality'   => sanitize_text_field( $data['patient_nationality'] ?? $data['nationality'] ?? '' ),
            'patient_age'           => ! empty( $data['patient_age'] ) ? (int) $data['patient_age'] : ( ! empty( $data['age'] ) ? (int) $data['age'] : null ),
            'patient_country'       => sanitize_text_field( $data['patient_country'] ?? $data['country'] ?? '' ),
            'patient_marital_status' => $marital_status,
            'patient_previous_ruqya' => $patient_previous_ruqya ? $patient_previous_ruqya : null,
            'patient_can_travel'    => $can_travel,
            'patient_need_type'     => $need_type,
            'patient_notes'         => $patient_notes ? $patient_notes : null,
            'status'                => 'pending',
            'payment_status'        => 'pending',
        ] );

        if ( ! $booking || ! isset( $booking->id ) ) {
            return [ 'success' => false, 'booking_id' => null, 'error' => 'Failed to create booking' ];
        }

        // 2. Update slot capacity
        if ( ! empty( $data['slot_id'] ) && ! empty( $data['slot_current_bookings'] ) ) {
            $new_count = (int) $data['slot_current_bookings'] + 1;
            $max_cap   = (int) ( $data['slot_max_capacity'] ?? 1 );

            $sb->from( 'available_slots' )
                ->eq( 'id', $data['slot_id'] )
                ->service()
                ->update( [
                    'current_bookings' => $new_count,
                    'is_booked'        => $new_count >= $max_cap,
                ] );
        }

        return [ 'success' => true, 'booking_id' => $booking->id, 'error' => null ];
    }

    /**
     * Update booking status.
     */
    public function update_status( string $booking_id, string $status ): bool {
        $sb = Ruqya_Supabase::instance();
        $result = $sb->from( 'bookings' )
            ->eq( 'id', $booking_id )
            ->service()
            ->update( [ 'status' => $status ] );
        return $result !== null;
    }

    /**
     * Update payment status.
     */
    public function update_payment_status( string $booking_id, string $status, ?float $amount = null ): bool {
        $sb   = Ruqya_Supabase::instance();
        $data = [ 'payment_status' => $status ];
        if ( $amount !== null ) {
            $data['payment_amount'] = $amount;
        }
        $result = $sb->from( 'bookings' )
            ->eq( 'id', $booking_id )
            ->service()
            ->update( $data );
        return $result !== null;
    }

    /**
     * Get a booking with related data.
     */
    public function get( string $booking_id ): ?object {
        $sb = Ruqya_Supabase::instance();
        return $sb->from( 'bookings' )
            ->select( '*, services(name), healers(display_name, profile_id), available_slots(slot_date, start_time, end_time)' )
            ->eq( 'id', $booking_id )
            ->service()
            ->single()
            ->get();
    }

    /**
     * Get bookings with filters.
     */
    public function get_list( array $filters = [], int $limit = 50, int $offset = 0 ): array {
        $sb = Ruqya_Supabase::instance();
        $q  = $sb->from( 'bookings' )
            ->select( '*, services(name), healers(display_name), available_slots(slot_date, start_time, end_time)' )
            ->service()
            ->order( 'created_at', 'desc' )
            ->limit( $limit )
            ->offset( $offset );

        if ( ! empty( $filters['status'] ) ) {
            $q = $q->eq( 'status', $filters['status'] );
        }
        if ( ! empty( $filters['healer_id'] ) ) {
            $q = $q->eq( 'healer_id', $filters['healer_id'] );
        }
        if ( ! empty( $filters['payment_status'] ) ) {
            $q = $q->eq( 'payment_status', $filters['payment_status'] );
        }

        $result = $q->get();
        return is_array( $result ) ? $result : [];
    }
}

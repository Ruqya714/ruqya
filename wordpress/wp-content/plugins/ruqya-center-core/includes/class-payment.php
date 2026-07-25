<?php
/**
 * NELS Payment Gateway integration.
 * Ported from Mtjree gateway to support NELS commerce API directly.
 */

defined('ABSPATH') || exit;

final class Ruqya_Payment
{

    private static ?self $instance = null;

    private string $api_key;
    private string $api_secret;
    private string $api_url;

    public static function instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->api_key    = defined('MTJREE_API_KEY') && MTJREE_API_KEY !== '' ? MTJREE_API_KEY : '8e60d8e4-5c6e-4349-82a2-de9ab84e1cb7';
        $this->api_secret = defined('MTJREE_WEBHOOK_SECRET') && MTJREE_WEBHOOK_SECRET !== '' ? MTJREE_WEBHOOK_SECRET : '1be9d63768bb60c9bb2628338e19bfbe7771a8d071390006caea15f8758f7d45';
        $this->api_url    = 'https://mtjree.com';
    }

    /**
     * Create a MTJREE payment link.
     *
     * @return array  [ 'success' => bool, 'redirect_url' => string|null, 'error' => string|null ]
     */
    public function create_payment(array $params): array
    {
        if (empty($this->api_key)) {
            return ['success' => false, 'redirect_url' => null, 'error' => 'Payment gateway not configured'];
        }

        $amount = (float) ($params['amount'] ?? 0);
        $description = $params['description'] ?? 'حجز استشارة';
        $booking_id = $params['booking_id'] ?? '';
        $user_name = $params['user_name'] ?? '';
        $user_email = $params['user_email'] ?? '';
        $user_phone = $params['user_phone'] ?? '';

        // Generate a short, unique track ID (e.g. ruq_172096320012)
        $track_id = 'ruq_' . time() . rand(10, 99);

        // Update admin_notes with the track ID first in Supabase
        $sb = Ruqya_Supabase::instance();
        $sb->from('bookings')->eq('id', $booking_id)->service()->update([
            'admin_notes' => 'NELS_TRACK_ID:' . $track_id
        ]);

        $endpoint = rtrim($this->api_url, '/') . '/api/v1/payments/initiate';

        $merchant_order_id = $track_id;

        $payload = [
            'amount' => $amount,
            'currency' => 'USD',
            'merchant_order_id' => $merchant_order_id,
            'customer_name' => $user_name,
            'customer_email' => $user_email,
            'customer_phone' => $user_phone,
            'return_url' => home_url('/booking/?payment_status=success&booking_id=' . $booking_id),
            'cancel_url' => home_url('/booking/?payment_status=cancelled&booking_id=' . $booking_id),
        ];

        $response = wp_remote_post($endpoint, [
            'headers' => [
                'Content-Type' => 'application/json',
                'X-MTJREE-API-KEY' => $this->api_key,
            ],
            'body' => wp_json_encode($payload),
            'timeout' => 30,
        ]);

        if (is_wp_error($response)) {
            error_log('Ruqya MTJREE API error: ' . $response->get_error_message());
            return ['success' => false, 'redirect_url' => null, 'error' => $response->get_error_message()];
        }

        $http_code = wp_remote_retrieve_response_code($response);
        $raw_body = wp_remote_retrieve_body($response);
        error_log("Ruqya MTJREE HTTP {$http_code}: {$raw_body}");

        $body = json_decode($raw_body, true);

        if ($http_code === 200 && isset($body['success']) && $body['success'] && !empty($body['redirect_url'])) {
            // Save transaction reference & track ID in admin_notes in Supabase for fallback checks
            if (!empty($body['transaction_id'])) {
                $sb->from('bookings')->eq('id', $booking_id)->service()->update([
                    'admin_notes' => "NELS_TRACK_ID:{$track_id} | NELS_SESSION_ID:" . $body['transaction_id']
                ]);
            }
            return ['success' => true, 'redirect_url' => $body['redirect_url'], 'error' => null];
        }

        $error_desc = ($body['error'] ?? 'Failed to initiate payment via MTJREE API') . ' [TrackID: ' . $merchant_order_id . ']';
        return ['success' => false, 'redirect_url' => null, 'error' => $error_desc];
    }

    /**
     * Handle NELS webhook callback.
     */
    public function handle_webhook(array $payload): bool
    {
        // Read raw headers from request (handled via REST API route wrapper or $_SERVER helper)
        $signature = isset($_SERVER['HTTP_X_WEBHOOK_SIGNATURE']) ? sanitize_text_field($_SERVER['HTTP_X_WEBHOOK_SIGNATURE']) : '';
        $timestamp = isset($_SERVER['HTTP_X_WEBHOOK_TIMESTAMP']) ? sanitize_text_field($_SERVER['HTTP_X_WEBHOOK_TIMESTAMP']) : '';

        // Fallbacks for header retrieval under different PHP setups
        if (empty($signature)) {
            $headers = getallheaders();
            $signature = $headers['X-Webhook-Signature'] ?? $headers['x-webhook-signature'] ?? '';
            $timestamp = $headers['X-Webhook-Timestamp'] ?? $headers['x-webhook-timestamp'] ?? '';
        }

        $raw_post = file_get_contents('php://input');
        if (!$this->validate_nels_signature($raw_post, $signature, $timestamp)) {
            error_log('Ruqya NELS Webhook signature verification failed.');
            return false;
        }

        $merchant_order_id = $payload['order']['merchant_order_id'] ?? '';
        $nels_status = $payload['order']['status'] ?? ''; // paid or failed

        if (empty($merchant_order_id)) {
            return false;
        }

        $booking_id = $merchant_order_id;
        $sb = Ruqya_Supabase::instance();

        // Check if merchant_order_id is NOT a direct UUID (fallback for other formats)
        if (strlen($merchant_order_id) !== 36 || strpos($merchant_order_id, '-') === false) {
            $booking = null;

            // Try lookup by NELS_TRACK_ID (numeric format)
            if (is_numeric($merchant_order_id) || (strlen($merchant_order_id) < 20)) {
                $booking = $sb->from('bookings')->ilike('admin_notes', '%NELS_TRACK_ID:' . $merchant_order_id . '%')->service()->single()->get();
            }

            // Try lookup by alphanumeric prefix
            if ((!$booking || !isset($booking->id)) && strlen($merchant_order_id) >= 22 && ctype_alnum($merchant_order_id)) {
                $prefix = substr($merchant_order_id, 0, 12);
                $search_pattern = substr($prefix, 0, 8) . '-' . substr($prefix, 8, 4) . '%';
                $booking = $sb->from('bookings')->ilike('id', $search_pattern)->service()->single()->get();
            }

            // Try lookup by old underscore format
            if (!$booking || !isset($booking->id)) {
                $parts = explode('_', $merchant_order_id);
                $booking_id = $parts[0];
            } else {
                $booking_id = $booking->id;
            }
        }

        $booking_handler = Ruqya_Booking::instance();

        if ('paid' === $nels_status) {
            $amount = (float) ($payload['order']['amount'] ?? 0);
            $booking_handler->update_payment_status($booking_id, 'paid', $amount);
            $booking_handler->update_status($booking_id, 'confirmed');

            // Send booking confirmation emails
            $booking = $booking_handler->get($booking_id);
            if ($booking) {
                Ruqya_Email::instance()->send_booking_emails([
                    'patient_name' => $booking->patient_name ?? '',
                    'patient_email' => $booking->patient_email ?? '',
                    'patient_phone' => $booking->patient_phone ?? '',
                    'service_name' => $booking->services->name ?? '',
                    'date' => $booking->available_slots->slot_date ?? '',
                    'time' => ($booking->available_slots->start_time ?? '') . ' - ' . ($booking->available_slots->end_time ?? ''),
                    'healer_name' => $booking->healers->display_name ?? '',
                ]);
            }
            return true;
        } elseif ('failed' === $nels_status) {
            $booking_handler->update_payment_status($booking_id, 'pending');
            $booking_handler->update_status($booking_id, 'cancelled');
            return true;
        }

        return false;
    }

    /**
     * Check payment status via NELS verification API.
     */
    public function check_status(string $payment_id): ?array
    {
        $url = rtrim($this->api_url, '/') . '/api/v1/payments/verify?session_id=' . urlencode($payment_id);
        $response = wp_remote_get($url, [
            'headers' => [
                'Accept' => 'application/json',
            ],
            'timeout' => 15,
        ]);

        if (is_wp_error($response)) {
            return null;
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }

    /**
     * Verify booking payment status using order id.
     */
    public function verify_booking_payment(string $booking_id): array
    {
        $booking_handler = Ruqya_Booking::instance();
        $booking = $booking_handler->get($booking_id);

        if (!$booking) {
            return ['success' => false, 'error' => 'Booking not found'];
        }

        if (($booking->payment_status ?? '') === 'paid') {
            return ['success' => true, 'payment_status' => 'paid', 'status' => $booking->status ?? ''];
        }

        // Extract session ID from admin_notes fallback
        $session_id = '';
        if (!empty($booking->admin_notes)) {
            if (strpos($booking->admin_notes, 'NELS_SESSION_ID:') === 0) {
                $session_id = str_replace('NELS_SESSION_ID:', '', $booking->admin_notes);
            } elseif (preg_match('/NELS_SESSION_ID:([a-zA-Z0-9-]+)/', $booking->admin_notes, $matches)) {
                $session_id = $matches[1];
            }
        }

        if (!empty($session_id)) {
            $status_data = $this->check_status($session_id);

            if (isset($status_data['status']) && 'paid' === $status_data['status']) {
                $booking_handler->update_payment_status($booking_id, 'paid');
                $booking_handler->update_status($booking_id, 'confirmed');

                // Refresh booking and send emails
                $booking = $booking_handler->get($booking_id);
                if ($booking) {
                    Ruqya_Email::instance()->send_booking_emails([
                        'patient_name' => $booking->patient_name ?? '',
                        'patient_email' => $booking->patient_email ?? '',
                        'patient_phone' => $booking->patient_phone ?? '',
                        'service_name' => $booking->services->name ?? '',
                        'date' => $booking->available_slots->slot_date ?? '',
                        'time' => ($booking->available_slots->start_time ?? '') . ' - ' . ($booking->available_slots->end_time ?? ''),
                        'healer_name' => $booking->healers->display_name ?? '',
                    ]);
                }
                return ['success' => true, 'payment_status' => 'paid', 'status' => 'confirmed'];
            }
        }

        return ['success' => false, 'payment_status' => $booking->payment_status, 'status' => $booking->status ?? ''];
    }

    /**
     * Verify Webhook signature
     */
    private function validate_nels_signature($payload, $received_signature, $timestamp)
    {
        if (empty($received_signature) || empty($timestamp)) {
            return false;
        }
        // Guard against replay attacks (10 minutes margin)
        if (abs(time() - intval($timestamp)) > 600) {
            return false;
        }

        $signing_string = $timestamp . '.' . $payload;
        $expected_signature = hash_hmac('sha256', $signing_string, $this->api_secret);

        return hash_equals($expected_signature, $received_signature);
    }
}

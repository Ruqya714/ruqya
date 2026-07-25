<?php
/**
 * Supabase PHP Client — connects WordPress to the Supabase REST API.
 *
 * Usage:
 *   $sb = Ruqya_Supabase::instance();
 *   $services = $sb->from('services')->select('*')->eq('is_active', 'true')->order('display_order')->get();
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_Supabase {

    private static ?self $instance = null;

    private string $url;
    private string $anon_key;
    private string $service_key;

    /* Current query state */
    private string $table    = '';
    private string $select   = '*';
    private array  $filters  = [];
    private string $order_col = '';
    private string $order_dir = 'asc';
    private int    $limit_val = 0;
    private int    $offset_val = 0;
    private bool   $use_service = false;
    private bool   $single  = false;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->url         = defined( 'SUPABASE_URL' ) ? SUPABASE_URL : '';
        $this->anon_key    = defined( 'SUPABASE_ANON_KEY' ) ? SUPABASE_ANON_KEY : '';
        $this->service_key = defined( 'SUPABASE_SERVICE_KEY' ) ? SUPABASE_SERVICE_KEY : '';
    }

    /* ── Query builder (fluent) ──────────────────────────────── */

    /**
     * Start a new query on a table.
     */
    public function from( string $table ): self {
        $q = clone $this;
        $q->table      = $table;
        $q->select     = '*';
        $q->filters    = [];
        $q->order_col  = '';
        $q->order_dir  = 'asc';
        $q->limit_val  = 0;
        $q->offset_val = 0;
        $q->use_service = false;
        $q->single     = false;
        return $q;
    }

    public function select( string $columns ): self {
        $this->select = $columns;
        return $this;
    }

    public function eq( string $col, string $val ): self {
        $this->filters[] = "{$col}=eq.{$val}";
        return $this;
    }

    public function neq( string $col, string $val ): self {
        $this->filters[] = "{$col}=neq.{$val}";
        return $this;
    }

    public function gt( string $col, string $val ): self {
        $this->filters[] = "{$col}=gt.{$val}";
        return $this;
    }

    public function gte( string $col, string $val ): self {
        $this->filters[] = "{$col}=gte.{$val}";
        return $this;
    }

    public function lt( string $col, string $val ): self {
        $this->filters[] = "{$col}=lt.{$val}";
        return $this;
    }

    public function lte( string $col, string $val ): self {
        $this->filters[] = "{$col}=lte.{$val}";
        return $this;
    }

    public function is( string $col, string $val ): self {
        $this->filters[] = "{$col}=is.{$val}";
        return $this;
    }

    public function in( string $col, array $values ): self {
        $list = '(' . implode( ',', $values ) . ')';
        $this->filters[] = "{$col}=in.{$list}";
        return $this;
    }

    public function ilike( string $col, string $pattern ): self {
        $this->filters[] = "{$col}=ilike.{$pattern}";
        return $this;
    }

    public function order( string $col, string $dir = 'asc' ): self {
        $this->order_col = $col;
        $this->order_dir = $dir;
        return $this;
    }

    public function limit( int $n ): self {
        $this->limit_val = $n;
        return $this;
    }

    public function offset( int $n ): self {
        $this->offset_val = $n;
        return $this;
    }

    /**
     * Use the Service Role key (for admin operations bypassing RLS).
     */
    public function service(): self {
        $this->use_service = true;
        return $this;
    }

    /**
     * Return a single row instead of an array.
     */
    public function single(): self {
        $this->single = true;
        $this->limit_val = 1;
        return $this;
    }

    /* ── Execute queries ─────────────────────────────────────── */

    /**
     * Execute a SELECT query.
     *
     * @return array|object|null  Array of rows, single row object, or null on error.
     */
    public function get(): mixed {
        $url = $this->build_url();
        $headers = $this->headers( 'GET' );

        if ( $this->single ) {
            $headers['Accept']  = 'application/vnd.pgrst.object+json';
            $headers['Prefer']  = 'count=exact';
        }

        $response = wp_remote_get( $url, [
            'headers' => $headers,
            'timeout' => 15,
        ] );

        return $this->parse( $response );
    }

    /**
     * Execute an INSERT query.
     *
     * @param array $data  Row data (associative array).
     * @return object|null  Inserted row or null on error.
     */
    public function insert( array $data ): mixed {
        $url = $this->build_url();
        $this->use_service = true; // inserts always need service key

        $response = wp_remote_post( $url, [
            'headers' => array_merge( $this->headers( 'POST' ), [
                'Prefer' => 'return=representation',
            ] ),
            'body'    => wp_json_encode( $data ),
            'timeout' => 15,
        ] );

        $result = $this->parse( $response );
        return is_array( $result ) && ! empty( $result ) ? $result[0] : $result;
    }

    /**
     * Execute an UPDATE query (requires filters to be set).
     *
     * @param array $data  Fields to update.
     * @return array|null  Updated rows or null on error.
     */
    public function update( array $data ): mixed {
        $url = $this->build_url();
        $this->use_service = true;

        $response = wp_remote_request( $url, [
            'method'  => 'PATCH',
            'headers' => array_merge( $this->headers( 'PATCH' ), [
                'Prefer' => 'return=representation',
            ] ),
            'body'    => wp_json_encode( $data ),
            'timeout' => 15,
        ] );

        return $this->parse( $response );
    }

    /**
     * Execute a DELETE query (requires filters to be set).
     *
     * @return bool  True on success.
     */
    public function delete(): bool {
        $url = $this->build_url();
        $this->use_service = true;

        $response = wp_remote_request( $url, [
            'method'  => 'DELETE',
            'headers' => $this->headers( 'DELETE' ),
            'timeout' => 15,
        ] );

        return ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) < 300;
    }

    /**
     * RPC call — invoke a Supabase database function.
     */
    public function rpc( string $fn, array $params = [] ): mixed {
        $url = rtrim( $this->url, '/' ) . '/rest/v1/rpc/' . $fn;

        $response = wp_remote_post( $url, [
            'headers' => $this->headers( 'POST' ),
            'body'    => wp_json_encode( $params ),
            'timeout' => 15,
        ] );

        return $this->parse( $response );
    }

    /* ── Internal helpers ────────────────────────────────────── */

    private function build_url(): string {
        $base = rtrim( $this->url, '/' ) . '/rest/v1/' . $this->table;
        $params = [];

        $params['select'] = $this->select;

        foreach ( $this->filters as $f ) {
            // Parse "col=op.val" into query param
            $params[] = $f;
        }

        if ( $this->order_col ) {
            $params['order'] = $this->order_col . '.' . $this->order_dir;
        }

        if ( $this->limit_val > 0 ) {
            $params['limit'] = $this->limit_val;
        }

        if ( $this->offset_val > 0 ) {
            $params['offset'] = $this->offset_val;
        }

        // Build query string
        $qs_parts = [ 'select=' . urlencode( $this->select ) ];
        foreach ( $this->filters as $f ) {
            $qs_parts[] = $f;
        }
        if ( $this->order_col ) {
            $qs_parts[] = 'order=' . urlencode( $this->order_col . '.' . $this->order_dir );
        }
        if ( $this->limit_val > 0 ) {
            $qs_parts[] = 'limit=' . $this->limit_val;
        }
        if ( $this->offset_val > 0 ) {
            $qs_parts[] = 'offset=' . $this->offset_val;
        }

        return $base . '?' . implode( '&', $qs_parts );
    }

    private function headers( string $method = 'GET' ): array {
        $key = $this->use_service ? $this->service_key : $this->anon_key;

        $h = [
            'apikey'        => $key,
            'Authorization' => 'Bearer ' . $key,
            'Content-Type'  => 'application/json',
        ];

        return $h;
    }

    private function parse( $response ): mixed {
        if ( is_wp_error( $response ) ) {
            error_log( 'Ruqya Supabase Error: ' . $response->get_error_message() );
            return null;
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = wp_remote_retrieve_body( $response );

        if ( $code >= 400 ) {
            error_log( "Ruqya Supabase HTTP {$code}: {$body}" );
            return null;
        }

        $data = json_decode( $body );

        // If single mode and we got an object, return it directly
        if ( $this->single && is_object( $data ) ) {
            return $data;
        }

        return $data;
    }

    /* ── Convenience shortcuts ───────────────────────────────── */

    /**
     * Get all active services ordered by display_order.
     */
    public function get_services(): array {
        $result = $this->from( 'services' )
            ->select( '*' )
            ->eq( 'is_active', 'true' )
            ->order( 'display_order' )
            ->get();
        return is_array( $result ) ? $result : [];
    }

    /**
     * Get all visible healers ordered by display_order.
     */
    public function get_healers(): array {
        $result = $this->from( 'healers' )
            ->select( '*' )
            ->eq( 'is_visible', 'true' )
            ->order( 'display_order' )
            ->get();
        return is_array( $result ) ? $result : [];
    }

    /**
     * Get visible FAQs ordered by display_order.
     */
    public function get_faqs( int $limit = 0 ): array {
        $q = $this->from( 'faqs' )
            ->select( '*' )
            ->eq( 'is_visible', 'true' )
            ->order( 'display_order' );
        if ( $limit > 0 ) {
            $q = $q->limit( $limit );
        }
        $result = $q->get();
        return is_array( $result ) ? $result : [];
    }

    /**
     * Get visible testimonials.
     */
    public function get_testimonials(): array {
        $result = $this->from( 'testimonials' )
            ->select( '*' )
            ->eq( 'is_visible', 'true' )
            ->order( 'display_order' )
            ->get();
        return is_array( $result ) ? $result : [];
    }

    /**
     * Get published articles.
     */
    public function get_articles( int $limit = 0, string $category = '' ): array {
        $q = $this->from( 'articles' )
            ->select( '*' )
            ->eq( 'is_published', 'true' )
            ->order( 'published_at', 'desc' );
        if ( $category ) {
            $q = $q->eq( 'category', $category );
        }
        if ( $limit > 0 ) {
            $q = $q->limit( $limit );
        }
        $result = $q->get();
        return is_array( $result ) ? $result : [];
    }

    /**
     * Get a single article by slug.
     */
    public function get_article_by_slug( string $slug ): ?object {
        return $this->from( 'articles' )
            ->select( '*' )
            ->eq( 'slug', $slug )
            ->eq( 'is_published', 'true' )
            ->single()
            ->get();
    }

    /**
     * Get site settings as key => value array.
     */
    public function get_settings(): array {
        $result = $this->from( 'site_settings' )->select( 'key,value' )->get();
        $settings = [];
        if ( is_array( $result ) ) {
            foreach ( $result as $row ) {
                $settings[ $row->key ] = $row->value;
            }
        }
        return $settings;
    }

    /**
     * Get a single setting value.
     */
    public function get_setting( string $key, string $default = '' ): string {
        $row = $this->from( 'site_settings' )
            ->select( 'value' )
            ->eq( 'key', $key )
            ->single()
            ->get();
        return $row->value ?? $default;
    }

    /**
     * Get available slots for booking.
     */
    public function get_available_slots( string $min_date = '', string $service_id = '' ): array {
        $q = $this->from( 'available_slots' )
            ->select( 'id,slot_date,start_time,end_time,healer_id,max_capacity,current_bookings,healers(display_name)' )
            ->eq( 'is_booked', 'false' )
            ->order( 'slot_date' );

        if ( $min_date ) {
            $q = $q->gte( 'slot_date', $min_date );
        }

        $result = $q->get();

        // Filter slots with remaining capacity
        if ( is_array( $result ) ) {
            return array_values( array_filter( $result, function( $s ) {
                return ( $s->current_bookings ?? 0 ) < ( $s->max_capacity ?? 1 );
            } ) );
        }
        return [];
    }
}

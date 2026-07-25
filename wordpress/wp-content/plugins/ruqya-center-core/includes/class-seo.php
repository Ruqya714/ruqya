<?php
/**
 * SEO enhancements — Schema.org, meta tags, Open Graph, breadcrumbs.
 */

defined( 'ABSPATH' ) || exit;

final class Ruqya_SEO {

    private static ?self $instance = null;

    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'wp_head', [ $this, 'output_meta_tags' ], 1 );
        add_action( 'wp_head', [ $this, 'output_schema' ], 2 );
        add_action( 'wp_head', [ $this, 'output_og_tags' ], 3 );
    }

    /**
     * Output meta tags.
     */
    public function output_meta_tags(): void {
        $desc = $this->get_description();
        if ( $desc ) {
            echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
        }
        echo '<meta name="robots" content="index, follow">' . "\n";
        echo '<link rel="canonical" href="' . esc_url( $this->get_canonical() ) . '">' . "\n";
    }

    /**
     * Output Open Graph tags.
     */
    public function output_og_tags(): void {
        $title = wp_get_document_title();
        $desc  = $this->get_description();
        $url   = $this->get_canonical();

        echo '<meta property="og:type" content="website">' . "\n";
        echo '<meta property="og:locale" content="ar_SA">' . "\n";
        echo '<meta property="og:site_name" content="مركز الرقية بكلام الرحمن">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
        if ( $desc ) {
            echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . "\n";
        }
        echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . "\n";

        // Twitter Card
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '">' . "\n";
        if ( $desc ) {
            echo '<meta name="twitter:description" content="' . esc_attr( $desc ) . '">' . "\n";
        }
    }

    /**
     * Output Schema.org JSON-LD structured data.
     */
    public function output_schema(): void {
        $schemas = [];

        // Organization schema (always present)
        $schemas[] = [
            '@context'    => 'https://schema.org',
            '@type'       => 'Organization',
            'name'        => 'مركز الرقية بكلام الرحمن لرد كيد الشيطان',
            'description' => 'مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول',
            'url'         => home_url(),
            'logo'        => get_theme_file_uri( 'assets/images/logo.png' ),
            'address'     => [
                '@type'           => 'PostalAddress',
                'addressLocality' => 'إسطنبول',
                'addressCountry'  => 'TR',
            ],
            'sameAs' => [],
        ];

        // WebSite schema with SearchAction
        $schemas[] = [
            '@context'        => 'https://schema.org',
            '@type'           => 'WebSite',
            'name'            => 'مركز الرقية بكلام الرحمن',
            'url'             => home_url(),
            'inLanguage'      => 'ar',
            'potentialAction' => [
                '@type'       => 'SearchAction',
                'target'      => home_url( '/?s={search_term_string}' ),
                'query-input' => 'required name=search_term_string',
            ],
        ];

        // BreadcrumbList
        $breadcrumbs = $this->get_breadcrumbs();
        if ( ! empty( $breadcrumbs ) ) {
            $items = [];
            foreach ( $breadcrumbs as $i => $crumb ) {
                $items[] = [
                    '@type'    => 'ListItem',
                    'position' => $i + 1,
                    'name'     => $crumb['name'],
                    'item'     => $crumb['url'],
                ];
            }
            $schemas[] = [
                '@context'        => 'https://schema.org',
                '@type'           => 'BreadcrumbList',
                'itemListElement' => $items,
            ];
        }

        // FAQPage schema on FAQ page
        if ( is_page( 'faq' ) ) {
            $sb   = Ruqya_Supabase::instance();
            $faqs = $sb->get_faqs();
            if ( ! empty( $faqs ) ) {
                $faq_entities = [];
                foreach ( $faqs as $faq ) {
                    $faq_entities[] = [
                        '@type'          => 'Question',
                        'name'           => $faq->question ?? '',
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text'  => $faq->answer ?? '',
                        ],
                    ];
                }
                $schemas[] = [
                    '@context'   => 'https://schema.org',
                    '@type'      => 'FAQPage',
                    'mainEntity' => $faq_entities,
                ];
            }
        }

        foreach ( $schemas as $schema ) {
            echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT ) . '</script>' . "\n";
        }
    }

    /**
     * Get breadcrumbs for current page.
     */
    public function get_breadcrumbs(): array {
        $crumbs = [
            [ 'name' => __( 'الرئيسية', 'ruqya' ), 'url' => function_exists( 'ruqya_home_url' ) ? ruqya_home_url() : ( function_exists( 'pll_home_url' ) && function_exists( 'pll_current_language' ) ? pll_home_url( pll_current_language() ) : home_url( '/' ) ) ],
        ];

        if ( is_page() && ! is_front_page() ) {
            $crumbs[] = [
                'name' => get_the_title(),
                'url'  => get_permalink(),
            ];
        }

        return $crumbs;
    }

    /**
     * Render breadcrumbs HTML.
     */
    public function render_breadcrumbs(): string {
        $crumbs = $this->get_breadcrumbs();
        if ( count( $crumbs ) <= 1 ) {
            return '';
        }

        $html = '<nav aria-label="breadcrumb" class="breadcrumbs"><ol>';
        foreach ( $crumbs as $i => $crumb ) {
            $is_last = $i === count( $crumbs ) - 1;
            if ( $is_last ) {
                $html .= '<li class="breadcrumb-current">' . esc_html( $crumb['name'] ) . '</li>';
            } else {
                $html .= '<li><a href="' . esc_url( $crumb['url'] ) . '">' . esc_html( $crumb['name'] ) . '</a></li>';
            }
        }
        $html .= '</ol></nav>';
        return $html;
    }

    /* ── Helpers ──────────────────────────────────────────────── */

    private function get_description(): string {
        if ( is_front_page() ) {
            return 'مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول. نقدم استشارات أونلاين، تشخيص روحاني، وعلاج بإشراف خاص.';
        }
        if ( is_page() ) {
            $excerpt = get_the_excerpt();
            return $excerpt ?: '';
        }
        return '';
    }

    private function get_canonical(): string {
        if ( is_front_page() ) {
            return home_url( '/' );
        }
        return get_permalink() ?: home_url( '/' );
    }
}

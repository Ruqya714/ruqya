<?php
/**
 * Ruqya Center Theme — functions.php
 */

defined( 'ABSPATH' ) || exit;

/* ── Theme Setup ─────────────────────────────────── */
add_action( 'after_setup_theme', function() {
    load_theme_textdomain( 'ruqya', get_template_directory() . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', [
        'width'       => 100,
        'height'      => 100,
        'flex-width'  => true,
        'flex-height' => true,
    ] );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ] );

    register_nav_menus( [
        'primary' => __( 'القائمة الرئيسية', 'ruqya' ),
        'footer'  => __( 'قائمة الفوتر', 'ruqya' ),
    ] );
} );

/* ── Enqueue assets ──────────────────────────────── */
add_action( 'wp_enqueue_scripts', function() {
    // Google Fonts — IBM Plex Sans Arabic
    wp_enqueue_style(
        'google-fonts',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
        [],
        null
    );

    // Theme stylesheet
    wp_enqueue_style( 'ruqya-theme', get_stylesheet_uri(), [ 'google-fonts' ], file_exists( get_template_directory() . '/style.css' ) ? filemtime( get_template_directory() . '/style.css' ) : '2.2.0' );

    // Navigation script
    wp_enqueue_script( 'ruqya-nav', get_theme_file_uri( 'assets/js/navigation.js' ), [], file_exists( get_template_directory() . '/assets/js/navigation.js' ) ? filemtime( get_template_directory() . '/assets/js/navigation.js' ) : '2.2.0', true );
} );

/* ── Title separator ─────────────────────────────── */
add_filter( 'document_title_separator', function() {
    return '|';
} );

/* ── Custom title ────────────────────────────────── */
add_filter( 'document_title_parts', function( $title ) {
    if ( is_front_page() ) {
        $title['title'] = 'مركز الرقية بكلام الرحمن لرد كيد الشيطان';
        $title['tagline'] = '';
    }
    return $title;
} );

/* ── Disable WordPress emoji scripts for performance ── */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/* ── Remove WordPress version for security ─────── */
remove_action( 'wp_head', 'wp_generator' );

/* ── Excerpt length ──────────────────────────────── */
add_filter( 'excerpt_length', function() { return 30; } );
add_filter( 'excerpt_more', function() { return '...'; } );

/* ── Helper: Get Supabase instance ───────────────── */
function ruqya_sb(): Ruqya_Supabase {
    return Ruqya_Supabase::instance();
}

/* ── Helper: Get site setting ────────────────────── */
function ruqya_setting( string $key, string $default = '' ): string {
    static $settings = null;
    if ( null === $settings ) {
        $settings = ruqya_sb()->get_settings();
    }
    return $settings[ $key ] ?? $default;
}

/* ── Helper: SVG Icons (inline, no Lucide dependency) */
function ruqya_icon( string $name, int $size = 24 ): string {
    $icons = [
        'phone'       => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        'shield'      => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'heart'       => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        'sparkles'    => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
        'book-open'   => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        'star'        => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        'check-circle' => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'globe'       => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        'users'       => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        'arrow-left'  => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
        'clock'       => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'menu'        => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        'x'           => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        'map-pin'     => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        'mail'        => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        'send'        => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        'calendar'    => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'whatsapp'    => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>',
        'instagram'   => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
        'youtube'     => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
        'facebook'    => '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
    ];

    return $icons[ $name ] ?? '';
}

/**
 * Get translated permalink for a page slug.
 */
function ruqya_page_link( string $slug ): string {
    $page = get_page_by_path( $slug );
    if ( $page ) {
        $post_id = $page->ID;
        if ( function_exists( 'pll_get_post' ) ) {
            $translated_id = pll_get_post( $post_id );
            if ( $translated_id ) {
                $post_id = $translated_id;
            }
        }
        return get_permalink( $post_id );
    }
    return home_url( '/' . trim( $slug, '/' ) . '/' );
}

/* ── Dynamically translate static strings to Turkish without Loco Translate ── */
add_filter( 'gettext', function( $translation, $text, $domain ) {
    if ( 'ruqya' === $domain ) {
        $locale = determine_locale();
        if ( strpos( $locale, 'tr' ) === 0 || ( function_exists( 'pll_current_language' ) && 'tr' === pll_current_language() ) ) {
            static $tr_map = null;
            if ( null === $tr_map ) {
                $tr_file = get_template_directory() . '/languages/tr_mapping.php';
                $tr_map = file_exists( $tr_file ) ? require $tr_file : [];
            }
            if ( isset( $tr_map[ $text ] ) ) {
                return $tr_map[ $text ];
            }
        }
    }
    return $translation;
}, 10, 3 );

/* ── Helper: Get localized home URL ──────────────── */
function ruqya_home_url(): string {
    if ( function_exists( 'pll_home_url' ) && function_exists( 'pll_current_language' ) ) {
        $current_lang = pll_current_language();
        if ( ! empty( $current_lang ) ) {
            return pll_home_url( $current_lang );
        }
    }
    return home_url( '/' );
}

/* ── Hybrid translation with Google Translate fallback ── */
function ruqya_translate( $text ) {
    if ( empty( $text ) ) {
        return '';
    }
    // 1. Try static translation first
    $translated = __( $text, 'ruqya' );
    
    // 2. Check if the active language is Turkish
    $locale = determine_locale();
    $is_turkish = ( strpos( $locale, 'tr' ) === 0 || ( function_exists( 'pll_current_language' ) && 'tr' === pll_current_language() ) );
    
    // 3. If Turkish is active and the text has no static translation
    if ( $is_turkish && $translated === $text ) {
        // Cache the translation in transients to avoid API rate limits and keep it fast
        $cache_key = 'ruqya_gt_' . md5( $text );
        $cached = get_transient( $cache_key );
        if ( false !== $cached ) {
            return $cached;
        }
        
        $url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=tr&dt=t&q=' . urlencode( $text );
        $response = wp_remote_get( $url, [ 'timeout' => 5 ] );
        if ( ! is_wp_error( $response ) ) {
            $body = wp_remote_retrieve_body( $response );
            $data = json_decode( $body, true );
            if ( ! empty( $data[0] ) ) {
                $gt_text = '';
                foreach ( $data[0] as $sentence ) {
                    $gt_text .= $sentence[0] ?? '';
                }
                if ( ! empty( $gt_text ) ) {
                    set_transient( $cache_key, $gt_text, 30 * DAY_IN_SECONDS );
                    return $gt_text;
                }
            }
        }
    }
    
    return $translated;
}


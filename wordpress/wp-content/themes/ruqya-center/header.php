<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="theme-color" content="#1a5c2a">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script>
    (function() {
        var pendingBooking = localStorage.getItem('ruqya_pending_booking');
        if (pendingBooking) {
            var homePath = '/' + '<?php echo esc_js( trim( wp_make_link_relative( home_url( '/' ) ), '/' ) ); ?>';
            homePath = homePath.replace(/\/+/g, '/').replace(/\/$/, '');
            var currentPath = window.location.pathname.replace(/\/$/, '');
            if (currentPath === homePath || currentPath === homePath + '/index.php') {
                localStorage.removeItem('ruqya_pending_booking');
                window.location.href = '<?php echo esc_js( home_url( '/payment-result/' ) ); ?>?booking_id=' + encodeURIComponent(pendingBooking) + '&status=verify';
            }
        }
    })();
    </script>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
    <div class="container">
        <div class="header-inner">
            <!-- Logo -->
            <a href="<?php echo esc_url( ruqya_home_url() ); ?>" class="site-logo" id="site-logo">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php endif; ?>
            </a>

            <!-- Desktop Nav -->
            <nav class="main-nav" id="main-nav">
                <?php
                $nav_links = [
                    '/' => [ 'label' => __( 'الرئيسية', 'ruqya' ), 'url' => ruqya_home_url() ],
                    'about' => [ 'label' => __( 'من نحن', 'ruqya' ), 'url' => ruqya_page_link( 'about' ) ],
                    'services' => [ 'label' => __( 'خدماتنا', 'ruqya' ), 'url' => ruqya_page_link( 'services' ) ],
                    'courses' => [ 'label' => __( 'الكورسات', 'ruqya' ), 'url' => ruqya_page_link( 'courses' ) ],
                    'treatment' => [ 'label' => __( 'الرحلة العلاجية', 'ruqya' ), 'url' => ruqya_page_link( 'treatment' ) ],
                    'blog' => [ 'label' => __( 'المقالات', 'ruqya' ), 'url' => ruqya_page_link( 'blog' ) ],
                    'faq' => [ 'label' => __( 'الأسئلة الشائعة', 'ruqya' ), 'url' => ruqya_page_link( 'faq' ) ],
                    'contact' => [ 'label' => __( 'اتصل بنا', 'ruqya' ), 'url' => ruqya_page_link( 'contact' ) ],
                ];

                echo '<ul>';
                foreach ( $nav_links as $key => $item ) {
                    $active_class = '';
                    $current_path = trim( wp_make_link_relative( get_permalink() ), '/' );
                    $link_path    = trim( parse_url( $item['url'], PHP_URL_PATH ), '/' );
                    if ( ( $key === '/' && is_front_page() ) || ( $key !== '/' && $current_path === $link_path ) ) {
                        $active_class = ' class="current_page_item"';
                    }
                    echo '<li' . $active_class . '><a href="' . esc_url( $item['url'] ) . '">' . esc_html( $item['label'] ) . '</a></li>';
                }
                echo '</ul>';
                ?>
            </nav>

            <!-- Language Switcher & CTA -->
            <div style="display: flex; align-items: center; gap: 12px;">
                <?php if ( function_exists( 'pll_the_languages' ) ) : 
                    $langs = pll_the_languages( [ 'raw' => 1 ] );
                    if ( ! empty( $langs ) ) :
                        $current_lang = null;
                        foreach ( $langs as $l ) {
                            if ( $l['current_lang'] ) {
                                $current_lang = $l;
                                break;
                            }
                        }
                        if ( ! $current_lang ) {
                            $current_lang = reset( $langs );
                        }
                ?>
                    <div class="lang-switcher" style="position: relative;">
                        <button class="lang-btn" style="background: none; border: 1px solid rgba(0,0,0,0.1); padding: 6px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 500; color: inherit; font-family: inherit;">
                            <?php echo ruqya_icon( 'globe', 16 ); ?>
                            <span><?php echo esc_html( $current_lang['name'] ); ?></span>
                        </button>
                        <div class="lang-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; min-width: 120px; margin-top: 4px;">
                            <?php foreach ( $langs as $l ) : ?>
                                <a href="<?php echo esc_url( $l['url'] ); ?>" style="display: block; padding: 8px 12px; text-decoration: none; color: #333; transition: background 0.2s; font-size: 0.9rem;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'">
                                    <?php echo esc_html( $l['name'] ); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        var btn = document.querySelector('.lang-btn');
                        var dropdown = document.querySelector('.lang-dropdown');
                        if (btn && dropdown) {
                            btn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                var isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
                                dropdown.style.display = isHidden ? 'block' : 'none';
                            });
                            document.addEventListener('click', function() {
                                dropdown.style.display = 'none';
                            });
                        }
                    });
                    </script>
                <?php endif; endif; ?>

                <div class="header-cta">
                    <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-primary btn-sm" id="header-cta-btn">
                        <?php echo ruqya_icon( 'calendar', 16 ); ?>
                        <?php _e( 'سجّل حالتك', 'ruqya' ); ?>
                    </a>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="القائمة">
                <?php echo ruqya_icon( 'menu', 24 ); ?>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Navigation Overlay -->
<div class="mobile-nav" id="mobile-nav">
    <div class="mobile-nav-inner">
        <div class="mobile-nav-close">
            <button id="mobile-nav-close-btn" style="background:none;border:none;cursor:pointer;padding:8px;">
                <?php echo ruqya_icon( 'x', 24 ); ?>
            </button>
        </div>
        <ul>
            <?php foreach ( $nav_links as $key => $item ) : ?>
                <li><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['label'] ); ?></a></li>
            <?php endforeach; ?>
            <li style="margin-top: 16px;">
                <a href="<?php echo esc_url( ruqya_page_link( 'booking' ) ); ?>" class="btn btn-primary" style="width:100%;justify-content:center;">
                    <?php _e( 'سجّل حالتك', 'ruqya' ); ?>
                </a>
            </li>
        </ul>
    </div>
</div>

<main id="main-content">

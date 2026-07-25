<?php
/**
 * Ruqya Center — WordPress Configuration
 *
 * Copy this file to 'wp-config.php' and update the values.
 * The Docker container expects this file to exist.
 */

/* ── Supabase Configuration ─────────────────────────────────── */
define( 'SUPABASE_URL',         getenv( 'SUPABASE_URL' )         ?: 'https://your-project.supabase.co' );
define( 'SUPABASE_ANON_KEY',    getenv( 'SUPABASE_ANON_KEY' )    ?: '' );
define( 'SUPABASE_SERVICE_KEY', getenv( 'SUPABASE_SERVICE_KEY' ) ?: '' );

/* ── Payment (Mtjree) ───────────────────────────────────────── */
define( 'MTJREE_API_KEY',       getenv( 'MTJREE_API_KEY' )       ?: '' );
define( 'MTJREE_WEBHOOK_SECRET', getenv( 'MTJREE_WEBHOOK_SECRET' ) ?: '' );

/* ── Email (Resend) ─────────────────────────────────────────── */
define( 'RESEND_API_KEY',       getenv( 'RESEND_API_KEY' )       ?: '' );
define( 'RESEND_FROM_EMAIL',    getenv( 'RESEND_FROM_EMAIL' )    ?: 'noreply@ruqyacenter.com' );

/* ── Site URL ───────────────────────────────────────────────── */
define( 'WP_HOME',    getenv( 'SITE_URL' ) ?: 'http://localhost:8080' );
define( 'WP_SITEURL', getenv( 'SITE_URL' ) ?: 'http://localhost:8080' );

/* ── WordPress Database Settings (from Docker environment) ──── */
define( 'DB_NAME',     getenv( 'WORDPRESS_DB_NAME' )     ?: 'wordpress' );
define( 'DB_USER',     getenv( 'WORDPRESS_DB_USER' )     ?: 'wordpress' );
define( 'DB_PASSWORD', getenv( 'WORDPRESS_DB_PASSWORD' ) ?: 'wordpress' );
define( 'DB_HOST',     getenv( 'WORDPRESS_DB_HOST' )     ?: 'db' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );

/* ── Authentication Keys ────────────────────────────────────── */
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

/* ── Table Prefix ───────────────────────────────────────────── */
$table_prefix = 'wp_';

/* ── Performance & Security ─────────────────────────────────── */
define( 'WP_DEBUG',           getenv( 'WP_DEBUG' ) === 'true' );
define( 'WP_DEBUG_LOG',       WP_DEBUG );
define( 'WP_DEBUG_DISPLAY',   false );
define( 'DISALLOW_FILE_EDIT', true );
define( 'FORCE_SSL_ADMIN',    true );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
define( 'WP_POST_REVISIONS',  5 );
define( 'AUTOSAVE_INTERVAL',  120 );

/* ── Absolute path ──────────────────────────────────────────── */
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

/* ── Load WordPress ─────────────────────────────────────────── */
require_once ABSPATH . 'wp-settings.php';

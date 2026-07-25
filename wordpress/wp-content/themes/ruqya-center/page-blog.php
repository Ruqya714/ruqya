<?php
/**
 * Template Name: المقالات
 * Blog/Articles Archive — displays native WordPress posts.
 */
get_header();

// Fetch native posts
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
$args = [
    'post_type'      => 'post',
    'post_status'    => 'publish',
    'posts_per_page' => 12,
    'paged'          => $paged,
];
$blog_query = new WP_Query( $args );
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php _e( 'المقالات وقصص الشفاء', 'ruqya' ); ?></h1>
        <p><?php _e( 'مقالات متخصصة في الرقية الشرعية وقصص شفاء ملهمة بإذن الله', 'ruqya' ); ?></p>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container">
        <?php echo Ruqya_SEO::instance()->render_breadcrumbs(); ?>

        <?php if ( $blog_query->have_posts() ) : ?>
        <div class="grid grid-3">
            <?php while ( $blog_query->have_posts() ) : $blog_query->the_post();
                $categories = get_the_category();
                $cat_name   = ! empty( $categories ) ? $categories[0]->name : __( 'مقال', 'ruqya' );
                $excerpt    = wp_strip_all_tags( get_the_excerpt() );
                if ( mb_strlen( $excerpt ) > 120 ) {
                    $excerpt = mb_substr( $excerpt, 0, 120 ) . '...';
                }
            ?>
            <a href="<?php the_permalink(); ?>" class="article-card" data-animate>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="article-card-img-wrapper" style="height:200px; overflow:hidden; border-radius:8px 8px 0 0;">
                        <img src="<?php the_post_thumbnail_url( 'medium_large' ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                <?php endif; ?>
                <div class="article-card-body">
                    <span class="badge badge-gold text-xs mb-2"><?php echo esc_html( $cat_name ); ?></span>
                    <h3><?php the_title(); ?></h3>
                    <p><?php echo esc_html( $excerpt ); ?></p>
                    <div class="article-card-meta">
                        <span><?php echo get_the_date(); ?></span>
                    </div>
                </div>
            </a>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>

        <!-- Pagination -->
        <div class="pagination mt-12 text-center">
            <?php
            echo paginate_links( [
                'base'      => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
                'format'    => '?paged=%#%',
                'current'   => max( 1, $paged ),
                'total'     => $blog_query->max_num_pages,
                'prev_text' => __( '« السابق', 'ruqya' ),
                'next_text' => __( 'التالي »', 'ruqya' ),
            ] );
            ?>
        </div>

        <?php else : ?>
        <div class="text-center" style="padding:60px 0;">
            <h3 class="mb-4"><?php _e( 'لا توجد مقالات حالياً', 'ruqya' ); ?></h3>
            <p class="text-secondary"><?php _e( 'سيتم إضافة المقالات قريباً بإذن الله', 'ruqya' ); ?></p>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>

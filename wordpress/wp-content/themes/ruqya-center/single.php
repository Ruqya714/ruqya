<?php
/**
 * Single Post Template — displays individual native blog posts.
 */
get_header();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <h1><?php the_title(); ?></h1>
        <?php endwhile; endif; rewind_posts(); ?>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container-sm">
        <a href="<?php echo esc_url( ruqya_page_link( 'blog' ) ); ?>" class="text-green fw-600 text-sm mb-6" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none;">
            <?php echo ruqya_icon( 'arrow-left', 14 ); ?>
            <?php _e( 'العودة للمقالات', 'ruqya' ); ?>
        </a>

        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); 
            $categories = get_the_category();
            $cat_name   = ! empty( $categories ) ? $categories[0]->name : __( 'مقال', 'ruqya' );
        ?>
        <article class="card" style="padding:32px;">
            <span class="badge badge-gold mb-4" style="display:inline-block;"><?php echo esc_html( $cat_name ); ?></span>
            
            <p class="text-muted text-sm mb-6"><?php echo get_the_date(); ?> | بقلم <?php the_author(); ?></p>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="single-post-thumbnail mb-6" style="border-radius:8px; overflow:hidden;">
                    <?php the_post_thumbnail( 'large', [ 'style' => 'width:100%; height:auto; display:block;' ] ); ?>
                </div>
            <?php endif; ?>

            <div class="prose">
                <?php the_content(); ?>
            </div>
        </article>
        <?php endwhile; endif; ?>
    </div>
</section>

<?php get_footer(); ?>

<?php
/**
 * Main index template — required by WordPress.
 */
get_header();
?>

<section class="section">
    <div class="container">
        <?php if ( have_posts() ) : ?>
        <div class="grid grid-3">
            <?php while ( have_posts() ) : the_post(); ?>
            <div class="article-card">
                <?php if ( has_post_thumbnail() ) : ?>
                    <img class="article-card-img" src="<?php the_post_thumbnail_url( 'medium_large' ); ?>" alt="<?php the_title_attribute(); ?>">
                <?php endif; ?>
                <div class="article-card-body">
                    <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                    <p><?php the_excerpt(); ?></p>
                    <div class="article-card-meta">
                        <span><?php the_date(); ?></span>
                    </div>
                </div>
            </div>
            <?php endwhile; ?>
        </div>
        <?php else : ?>
        <div class="text-center" style="padding:60px 0;">
            <h3><?php _e( 'لا توجد محتويات حالياً', 'ruqya' ); ?></h3>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>

<?php
/**
 * Generic page template — fallback for pages without specific templates.
 */
get_header();
?>

<section class="page-hero gradient-hero">
    <div class="container">
        <h1><?php the_title(); ?></h1>
    </div>
    <div class="wave-sep"><svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="var(--bg)"/></svg></div>
</section>

<section class="section">
    <div class="container-sm">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <div class="card prose" style="padding:32px;">
            <?php the_content(); ?>
        </div>
        <?php endwhile; endif; ?>
    </div>
</section>

<?php get_footer(); ?>

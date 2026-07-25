/**
 * Ruqya Center — Navigation & Interactions (Vanilla JS)
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        /* ── Mobile menu ──────────────────────────────── */
        var menuBtn   = document.getElementById('mobile-menu-btn');
        var nav       = document.getElementById('mobile-nav');
        var closeBtn  = document.getElementById('mobile-nav-close-btn');

        if (menuBtn && nav) {
            menuBtn.addEventListener('click', function() {
                nav.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            function closeMenu() {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (closeBtn) closeBtn.addEventListener('click', closeMenu);

            nav.addEventListener('click', function(e) {
                if (e.target === nav) closeMenu();
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeMenu();
            });
        }

        /* ── Scroll-based header shadow ───────────────── */
        var header = document.getElementById('site-header');
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 10) {
                    header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }, { passive: true });
        }

        /* ── Scroll animations ────────────────────────── */
        var animElements = document.querySelectorAll('[data-animate]');
        if (animElements.length && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slide-up');
                        entry.target.style.opacity = '1';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            animElements.forEach(function(el) {
                el.style.opacity = '0';
                observer.observe(el);
            });
        }

        /* ── FAQ accordion (auto-close siblings) ──────── */
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function(item) {
            item.addEventListener('toggle', function() {
                if (this.open) {
                    faqItems.forEach(function(other) {
                        if (other !== item && other.open) {
                            other.removeAttribute('open');
                        }
                    });
                }
            });
        });

    });
})();

(function () {
    'use strict';

    function initScrollReveal() {
        var els = document.querySelectorAll('[data-reveal]');
        function showAll() {
            els.forEach(function (el) {
                el.classList.add('reveal-visible');
            });
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            showAll();
            return;
        }
        var obs = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px 12% 0px', threshold: 0 }
        );
        els.forEach(function (el) {
            obs.observe(el);
        });
    }

    function initPortfolioCarousel() {
        var root = document.getElementById('portfolio-carousel');
        var track = document.getElementById('portfolio-carousel-track');
        if (!root || !track) return;

        var prevBtn = root.querySelector('[data-carousel-prev]');
        var nextBtn = root.querySelector('[data-carousel-next]');
        var viewport = track.parentElement;
        var slides = Array.prototype.slice.call(
            track.querySelectorAll('[role="group"][aria-roledescription="diapositiva"]')
        );
        if (slides.length === 0) return;

        var index = 0;

        function slidesToShow() {
            return window.matchMedia('(min-width: 768px)').matches ? 2 : 1;
        }

        function lastAllowedIndex() {
            return Math.max(0, slides.length - slidesToShow());
        }

        function offsetFor(i) {
            return slides[i].offsetLeft;
        }

        function update() {
            var last = lastAllowedIndex();
            if (index > last) index = last;
            var x = offsetFor(index);
            track.style.transform = 'translate3d(' + -x + 'px, 0, 0)';
            if (prevBtn) {
                prevBtn.disabled = index <= 0;
                prevBtn.setAttribute('aria-disabled', index <= 0 ? 'true' : 'false');
            }
            if (nextBtn) {
                nextBtn.disabled = index >= last;
                nextBtn.setAttribute('aria-disabled', index >= last ? 'true' : 'false');
            }
        }

        function go(delta) {
            var last = lastAllowedIndex();
            index = Math.max(0, Math.min(last, index + delta));
            update();
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(update, 80);
        });

        var touchStartX = null;
        if (viewport) {
            viewport.addEventListener(
                'touchstart',
                function (e) {
                    touchStartX = e.changedTouches[0].clientX;
                },
                { passive: true }
            );
            viewport.addEventListener(
                'touchend',
                function (e) {
                    if (touchStartX === null) return;
                    var dx = e.changedTouches[0].clientX - touchStartX;
                    touchStartX = null;
                    if (Math.abs(dx) < 40) return;
                    if (dx > 0) go(-1);
                    else go(1);
                },
                { passive: true }
            );
        }

        root.setAttribute('tabindex', '0');
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                go(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                go(1);
            }
        });

        requestAnimationFrame(update);
        window.addEventListener('load', update);
    }

    initScrollReveal();
    initPortfolioCarousel();
})();

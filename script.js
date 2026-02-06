// ================================
// YAMUNA YEAST 2026 - ENHANCED JS
// Parallax, Smooth Scroll, Animations
// ================================

(function () {
    'use strict';

    // ============================================
    // SMOOTH PARALLAX SCROLL EFFECTS
    // ============================================

    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-scroll]');

        if (!parallaxElements.length) return;

        const handleScroll = () => {
            const scrollY = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.dataset.scrollSpeed || 1;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementHeight = rect.height;
                const viewportHeight = window.innerHeight;

                // Only apply parallax when element is in viewport
                if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
                    const distance = scrollY - elementTop;
                    const movement = distance * (speed - 1) * 0.5;
                    el.style.transform = `translateY(${movement}px)`;
                }
            });
        };

        // Throttle scroll event for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        handleScroll(); // Initial call
    }

    // ============================================
    // INTERSECTION OBSERVER - REVEAL ON SCROLL
    // ============================================

    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe section titles and major elements
        document.querySelectorAll('.section-title, .benefit-card, .recipe-card, .pack-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // DOWNLOAD CHECKLIST
    // ============================================

    const downloadBtn = document.getElementById('downloadChecklist');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Add loading state
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Завантаження...</span>';
            downloadBtn.disabled = true;

            setTimeout(() => {
                // Success message
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> <span>Готово!</span>';

                // Alert with recipe info
                alert('🎉 Чеклист успішно завантажено!\n\n📋 Що всередині:\n✓ 15 перевірених рецептів\n✓ Покрокові інструкції\n✓ Професійні поради\n✓ Таблиця мір\n\nДякуємо, що обрали Yamuna!');

                // Reset button
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // ============================================
    // RECIPE CARDS - KEYBOARD NAVIGATION
    // ============================================

    function initRecipeCards() {
        document.querySelectorAll('.recipe-card').forEach(card => {
            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('is-flipped');
                    card.querySelector('.recipe-inner').style.transform =
                        card.classList.contains('is-flipped') ? 'rotateY(180deg)' : '';
                }
            });

            // Touch support for mobile
            let touchStartY = 0;
            card.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            });

            card.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const diff = Math.abs(touchEndY - touchStartY);

                // Only flip if it's a tap, not a scroll
                if (diff < 10) {
                    card.classList.toggle('is-flipped');
                    card.querySelector('.recipe-inner').style.transform =
                        card.classList.contains('is-flipped') ? 'rotateY(180deg)' : '';
                }
            });
        });
    }

    // ============================================
    // TESTIMONIAL ROTATION
    // ============================================

    const testimonials = [
        {
            avatar: '👩‍🍳',
            text: 'Пекла паску на Великдень - вийшла просто казка! Тісто піднялося ідеально, структура пухка. Тепер тільки Yamuna!',
            author: 'Олена К., Київ'
        },
        {
            avatar: '👨‍🍳',
            text: 'Працюю пекарем 10 років. Yamuna - найкращі дріжджі на ринку. Стабільний результат кожного разу!',
            author: 'Андрій М., Львів'
        },
        {
            avatar: '👵',
            text: 'Онука навчила мене користуватися цими дріжджами. Тепер булочки виходять як у молодості, а навіть краще!',
            author: 'Марія П., Полтава'
        }
    ];

    let currentTestimonial = 0;
    const testimonialCard = document.querySelector('.testimonial-card');

    function rotateTestimonials() {
        if (!testimonialCard) return;

        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        const testimonial = testimonials[currentTestimonial];

        // Fade out
        testimonialCard.style.opacity = '0';
        testimonialCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Update content
            const avatarEl = testimonialCard.querySelector('.testimonial-avatar');
            const textEl = testimonialCard.querySelector('.testimonial-text');
            const authorEl = testimonialCard.querySelector('.testimonial-author');

            if (avatarEl && textEl && authorEl) {
                avatarEl.textContent = testimonial.avatar;
                textEl.textContent = `"${testimonial.text}"`;
                authorEl.textContent = testimonial.author;
            }

            // Fade in
            setTimeout(() => {
                testimonialCard.style.opacity = '1';
                testimonialCard.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }

    if (testimonialCard) {
        testimonialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setInterval(rotateTestimonials, 6000);
    }

    // ============================================
    // MAP HOTSPOTS
    // ============================================

    function initMapHotspots() {
        const svgObject = document.getElementById('svgMap');
        const overlay = document.getElementById('mapOverlay');

        if (!svgObject || !overlay) return;

        // Wait for SVG to load
        svgObject.addEventListener('load', () => {
            fetch('hotspots.json')
                .then(res => res.ok ? res.json() : Promise.reject('Hotspots not found'))
                .then(hotspots => {
                    hotspots.forEach(hotspot => {
                        const btn = document.createElement('button');
                        btn.className = 'map-hotspot';
                        btn.setAttribute('data-region', hotspot.id);
                        btn.setAttribute('aria-label', hotspot.name);
                        btn.style.left = hotspot.left;
                        btn.style.top = hotspot.top;
                        btn.textContent = hotspot.name;

                        // Tooltip on hover
                        btn.title = hotspot.message;

                        overlay.appendChild(btn);
                    });
                })
                .catch(err => console.warn('Map hotspots:', err));
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // BENEFIT CARDS - STAGGER ANIMATION
    // ============================================

    function initBenefitCards() {
        const benefitCards = document.querySelectorAll('.benefit-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Cards will animate via CSS animation-delay
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        benefitCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

    // ============================================
    // FLOATING BACKGROUND ELEMENTS
    // ============================================

    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-circle');

        floatingElements.forEach((el, index) => {
            // Random animation duration for variety
            const duration = 15 + Math.random() * 10;
            el.style.animationDuration = `${duration}s`;
            el.style.animationDelay = `${-index * 5}s`;
        });
    }

    // ============================================
    // IMAGE LAZY LOADING ENHANCEMENT
    // ============================================

    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    function optimizePerformance() {
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Re-initialize parallax on resize
                initParallax();
            }, 250);
        });

        // Preload critical images
        const criticalImages = [
            'images/Photo-03.jpg',
            'images/logo.svg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Core features
        initParallax();
        initScrollReveal();
        initRecipeCards();
        initMapHotspots();
        initSmoothScroll();
        initBenefitCards();
        initFloatingElements();
        initLazyLoading();
        optimizePerformance();
        initRecipeAccordion();
        initRecipeVideoAutoplay();

        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');

        console.log('🎉 Yamuna Yeast 2026 - Loaded successfully!');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // RECIPE ACCORDION - FIXED
    // ============================================

    function initRecipeAccordion() {
        const accordionItems = document.querySelectorAll('.recipe-accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.recipe-accordion-header');

            if (!header) return;

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Закрити всі інші акордеони в тій же секції
                const parentSection = item.closest('.recipes-desktop, .recipes-mobile');
                if (parentSection) {
                    parentSection.querySelectorAll('.recipe-accordion-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherHeader = otherItem.querySelector('.recipe-accordion-header');
                            if (otherHeader) {
                                otherHeader.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                }

                // Toggle поточний акордеон
                item.classList.toggle('active');
                header.setAttribute('aria-expanded', !isOpen);

                // Auto-scroll при відкритті
                if (!isOpen) {
                    setTimeout(() => {
                        const rect = header.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetScroll = rect.top + scrollTop - 120;

                        window.scrollTo({
                            top: targetScroll,
                            behavior: 'smooth'
                        });
                    }, 400);
                }
            });

            // Keyboard support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    }

    // ============================================
    // RECIPE VIDEO AUTO-PLAY
    // ============================================

    function initRecipeVideoAutoplay() {
        const videoWrapper = document.querySelector('.recipe-video-wrapper');
        const video = videoWrapper ? videoWrapper.querySelector('video') : null;

        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.warn('Autoplay failed:', e));
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(videoWrapper);
    }

})();
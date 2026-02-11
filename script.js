// ================================
// YAMUNA YEAST 2026 - OPTIMIZED JS
// Performance-first, debounced, efficient
// ================================

(function () {
    'use strict';

    // ============================================
    // UTILITIES
    // ============================================

    // Debounce function to limit event firing
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function for scroll events
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ============================================
    // SMOOTH PARALLAX SCROLL - OPTIMIZED
    // ============================================

    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-scroll]');
        if (!parallaxElements.length) return;

        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            const viewportHeight = window.innerHeight;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.scrollSpeed) || 1;
                if (speed === 1) return; // Skip if no parallax effect
                
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                
                // Only calculate if element is near viewport (optimization)
                if (scrollY + viewportHeight > elementTop - 200 && scrollY < elementTop + rect.height + 200) {
                    const distance = scrollY - elementTop;
                    const movement = distance * (speed - 1) * 0.5;
                    el.style.transform = `translateY(${movement}px)`;
                }
            });
        };

        // Use throttled scroll for better performance
        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true }); // ~60fps
        handleScroll(); // Initial call
    }

    // ============================================
    // INTERSECTION OBSERVER - UNIFIED
    // ============================================

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Start animations for benefit cards and logos
                    if (entry.target.classList.contains('benefit-card') || 
                        entry.target.classList.contains('logo-card')) {
                        entry.target.style.animationPlayState = 'running';
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.section-title, .benefit-card, .logo-card, .pack-item'
        );
        
        animatedElements.forEach(el => {
            // Pause CSS animations initially
            if (el.classList.contains('benefit-card') || el.classList.contains('logo-card')) {
                el.style.animationPlayState = 'paused';
            }
            observer.observe(el);
        });
    }

    // ============================================
    // RECIPE ACCORDION
    // ============================================

    function initRecipeAccordion() {
        const accordionItems = document.querySelectorAll('.recipe-accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.recipe-accordion-header');
            if (!header) return;

            const handleClick = () => {
                const isOpen = item.classList.contains('active');
                const parentSection = item.closest('.recipes-desktop');

                // Close all other accordions
                if (parentSection) {
                    parentSection.querySelectorAll('.recipe-accordion-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherHeader = otherItem.querySelector('.recipe-accordion-header');
                            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                        }
                    });
                }

                // Toggle current
                item.classList.toggle('active');
                header.setAttribute('aria-expanded', !isOpen);

                // Smooth scroll to accordion if opening
                if (!isOpen) {
                    setTimeout(() => {
                        const rect = header.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        window.scrollTo({
                            top: rect.top + scrollTop - 120,
                            behavior: 'smooth'
                        });
                    }, 400);
                }
            };

            header.addEventListener('click', handleClick);
            
            // Keyboard support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            });
        });
    }

    // ============================================
    // VIDEO AUTO-PLAY ON SCROLL
    // ============================================

    function initRecipeVideoAutoplay() {
        const video = document.querySelector('.recipe-video-wrapper video');
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {}); // Silently fail if autoplay blocked
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(video.closest('.recipe-video-wrapper'));
    }

    // ============================================
    // TESTIMONIAL ROTATION
    // ============================================

    function initTestimonialRotation() {
        const testimonials = [
            {
                avatar: '👩‍🍳',
                text: 'Пекла паску на Великдень - вийшла просто казка! Тісто піднялося ідеально, структура пухка. Тепер тільки Ямуна!',
                author: 'Олена К., Київ'
            },
            {
                avatar: '👨‍🍳',
                text: 'Працюю пекарем 10 років. Ямуна - найкращі дріжджі на ринку. Стабільний результат кожного разу!',
                author: 'Андрій М., Львів'
            },
            {
                avatar: '👵',
                text: 'Онука навчила мене користуватися цими дріжджами. Тепер булочки виходять як у молодості, а навіть краще!',
                author: 'Марія П., Полтава'
            }
        ];

        const testimonialCard = document.querySelector('.testimonial-card');
        if (!testimonialCard) return;

        let currentIndex = 0;
        testimonialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        const rotateTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            const testimonial = testimonials[currentIndex];

            testimonialCard.style.opacity = '0';
            testimonialCard.style.transform = 'translateY(20px)';

            setTimeout(() => {
                const avatarEl = testimonialCard.querySelector('.testimonial-avatar');
                const textEl = testimonialCard.querySelector('.testimonial-text');
                const authorEl = testimonialCard.querySelector('.testimonial-author');

                if (avatarEl) avatarEl.textContent = testimonial.avatar;
                if (textEl) textEl.textContent = `"${testimonial.text}"`;
                if (authorEl) authorEl.textContent = testimonial.author;

                setTimeout(() => {
                    testimonialCard.style.opacity = '1';
                    testimonialCard.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
        };

        setInterval(rotateTestimonial, 6000);
    }

    // ============================================
    // DOWNLOAD BUTTON
    // ============================================

    function initDownloadButton() {
        const downloadBtn = document.getElementById('downloadChecklist');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Завантаження...</span>';
            downloadBtn.disabled = true;

            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> <span>Готово!</span>';
                
                alert('🎉 Чеклист успішно завантажено!\n\n📋 Що всередині:\n✓ 15 перевірених рецептів\n✓ Покрокові інструкції\n✓ Професійні поради\n✓ Таблиця мір\n\nДякуємо, що обрали Ямуна!');

                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                }, 2000);
            }, 1500);
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

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================

    function optimizePerformance() {
        // Debounced resize handler
        const handleResize = debounce(() => {
            // Recalculate parallax on resize
            const parallaxElements = document.querySelectorAll('[data-scroll]');
            if (parallaxElements.length) {
                parallaxElements.forEach(el => {
                    el.style.transform = 'translateY(0)';
                });
            }
        }, 250);

        window.addEventListener('resize', handleResize, { passive: true });

        // Preload critical resources
        const criticalImages = [
            'images/logo.svg'
        ];

        if ('connection' in navigator && navigator.connection.effectiveType !== 'slow-2g') {
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        }

        // Defer non-critical animations
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                const floatingElements = document.querySelectorAll('.float-circle');
                floatingElements.forEach((el, index) => {
                    const duration = 15 + Math.random() * 10;
                    el.style.animationDuration = `${duration}s`;
                    el.style.animationDelay = `${-index * 5}s`;
                });
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Core features
        initScrollAnimations();
        initRecipeAccordion();
        initRecipeVideoAutoplay();
        initTestimonialRotation();
        initDownloadButton();
        initSmoothScroll();
        initParallax();
        optimizePerformance();

        // Mark as loaded
        document.body.classList.add('loaded');
    }

    // Run when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
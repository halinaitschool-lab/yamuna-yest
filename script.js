// Consolidated site behaviour (modal, video, parallax, reveal, smooth scroll, testimonials)
(function () {
    'use strict';

    // Modal and video control
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');

    window.openVideo = function (videoId) {
        if (!iframe || !modal) return;
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.style.display = 'flex';
        // optional: prevent background scroll
        document.documentElement.style.overflow = 'hidden';
    };

    window.closeVideo = function () {
        if (!iframe || !modal) return;
        iframe.src = '';
        modal.style.display = 'none';
        document.documentElement.style.overflow = '';
    };

    // Close modal when clicking outside content or pressing Escape
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeVideo();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                window.closeVideo();
            }
        });
    }

    // Download checklist button (progressive enhancement)
    const downloadBtn = document.getElementById('downloadChecklist');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Placeholder behaviour — replace with real file download when available
            window.alert('Чеклист з пасхальними рецептами завантажується...\n\n✓ 15 перевірених рецептів\n✓ Покрокові інструкції\n✓ Фото кожної страви\n✓ Поради від професіоналів\n\nДякуємо, що обрали Yamuna! 🎉');
        });
    }

    // IntersectionObserver for fade-in reveals
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
    } else {
        // fallback: reveal all
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }

    // Testimonial rotation (graceful if missing)
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
    const testimonialEl = document.querySelector('.testimonial');

    function rotateTestimonials() {
        if (!testimonialEl) return;
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        const t = testimonials[currentTestimonial];

        const avatarEl = testimonialEl.querySelector('.testimonial-avatar');
        const textEl = testimonialEl.querySelector('.testimonial-text');
        const authorEl = testimonialEl.querySelector('.testimonial-author');

        if (!avatarEl || !textEl || !authorEl) return;

        testimonialEl.style.opacity = '0';
        setTimeout(() => {
            avatarEl.textContent = t.avatar;
            textEl.textContent = `"${t.text}"`;
            authorEl.textContent = t.author;
            testimonialEl.style.opacity = '1';
        }, 300);
    }

    if (testimonialEl) {
        testimonialEl.style.transition = 'opacity 0.3s ease';
        setInterval(rotateTestimonials, 5000);
    }

    // Map hotspots using Map_of_Ukraine.svg
    function initSvgMapHotspots() {
        const obj = document.getElementById('svgMap');
        const overlay = document.getElementById('mapOverlay');
        if (!obj || !overlay) return;

        fetch('hotspots.json')
            .then(res => res.json())
            .then(hotspots => {
                // create buttons positioned by left/top percent
                hotspots.forEach(h => {
                    const btn = document.createElement('button');
                    btn.className = 'map-hotspot';
                    btn.setAttribute('data-region', h.id);
                    btn.setAttribute('aria-label', h.name);
                    btn.style.left = h.left;
                    btn.style.top = h.top;
                    btn.innerHTML = `<span class="label">${h.name}</span><span class="map-tooltip">${h.message}</span>`;
                    overlay.appendChild(btn);

                    // btn.addEventListener('mouseenter', () => showIndicator(h.message));
                    // btn.addEventListener('focus', () => showIndicator(h.message));
                    btn.addEventListener('mouseleave', () => hideIndicator());
                    btn.addEventListener('blur', () => hideIndicator());
                });
            })
            .catch(err => console.error('hotspots load failed', err));
    }

    function showIndicator(text) {
        let ind = document.querySelector('.map-indicator');
        if (!ind) {
            ind = document.createElement('div');
            ind.className = 'map-indicator';
            document.body.appendChild(ind);
        }
        ind.textContent = text;
        ind.style.opacity = '1';
    }

    function hideIndicator() {
        const ind = document.querySelector('.map-indicator');
        if (ind) ind.style.opacity = '0';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSvgMapHotspots);
    } else {
        initSvgMapHotspots();
    }

    // Card flip keyboard support: toggle flip on Enter/Space
    function initRecipeCardKeyboard() {
        document.querySelectorAll('.recipe-tile').forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.querySelector('.card-inner').classList.toggle('flipped');
                }
            });
        });
    }

    // Staggered reveal for recipes
    function staggerReveal() {
        const items = document.querySelectorAll('.recipes-grid .recipe-tile');
        items.forEach((it, i) => {
            setTimeout(() => it.classList.add('visible'), i * 120);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { initRecipeCardKeyboard(); staggerReveal(); });
    } else {
        initRecipeCardKeyboard(); staggerReveal();
    }

})();

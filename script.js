function openVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = 'flex';
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = '';
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideo();
    }
}

function downloadChecklist(event) {
    event.preventDefault();
    alert('Чеклист з пасхальними рецептами завантажується...\n\n✓ 15 перевірених рецептів\n✓ Покрокові інструкції\n✓ Фото кожної страви\n✓ Поради від професіоналів\n\nДякуємо, що обрали Yamuna! 🎉');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Testimonial rotation
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

function rotateTestimonials() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    const t = testimonials[currentTestimonial];

    const testimonial = document.querySelector('.testimonial');
    testimonial.style.opacity = '0';

    setTimeout(() => {
        document.querySelector('.testimonial-avatar').textContent = t.avatar;
        document.querySelector('.testimonial-text').textContent = `"${t.text}"`;
        document.querySelector('.testimonial-author').textContent = t.author;
        testimonial.style.opacity = '1';
    }, 300);
}

document.querySelector('.testimonial').style.transition = 'opacity 0.3s ease';
setInterval(rotateTestimonials, 5000);

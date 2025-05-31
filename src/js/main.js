document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('section, .timeline-item');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const closeModalBtn = document.querySelector('.modal-close');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    // Initialize functions
    initMenuToggle();
    initSmoothScroll();
    initScrollEffects();
    initIntersectionObserver();
    initGalleryModal();
    initScrollToTop();
    initBackgroundAnimation();

    // Menu Toggle Functionality
    function initMenuToggle() {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth Scroll Functionality
    function initSmoothScroll() {
        scrollLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Effects (Header and Parallax)
    function initScrollEffects() {
        window.addEventListener('scroll', () => {
            // Header effect
            header.classList.toggle('scrolled', window.scrollY > 50);

            // Parallax effect
            hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
        });
    }

    // Intersection Observer for Animations
    function initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Gallery Modal Functionality
    function initGalleryModal() {
        // Preload images for smoother modal transitions
        function preloadGalleryImages() {
            galleryItems.forEach(item => {
                const img = new Image();
                img.src = item.querySelector('img').getAttribute('src');
            });
        }

        // Open modal with clicked image
        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const imgElement = this.querySelector('img');
                modalImg.src = imgElement.src;
                modalImg.alt = imgElement.alt;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal function
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Close modal events
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.style.display === 'flex' && closeModal());

        // Initialize preloading
        window.addEventListener('load', preloadGalleryImages);
    }

    // Scroll to Top Button
    function initScrollToTop() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.className = 'scroll-top-btn';
        Object.assign(scrollTopBtn.style, {
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: '#f5c518',
            color: '#003087',
            border: '2px solid #003087',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            zIndex: '1000'
        });
        document.body.appendChild(scrollTopBtn);

        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            scrollTopBtn.style.opacity = show ? '0.8' : '0';
            scrollTopBtn.style.transform = show ? 'scale(1)' : 'scale(0.8)';
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Background Animation with Ornaments
    function initBackgroundAnimation() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '0',
            pointerEvents: 'none'
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Ornament {
            constructor() {
                this.reset();
                this.size = Math.random() * 30 + 20;
                this.speed = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.angle += this.speed;
                this.y += Math.sin(this.angle) * 0.5;
                this.x += Math.cos(this.angle) * 0.5;

                // Wrap around edges
                if (this.x < 0) this.x += canvas.width;
                if (this.x > canvas.width) this.x -= canvas.width;
                if (this.y < 0) this.y += canvas.height;
                if (this.y > canvas.height) this.y -= canvas.height;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = `rgba(245, 197, 24, ${this.opacity})`;
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                for (let i = 0; i < 8; i++) {
                    ctx.lineTo(0, -this.size / 4);
                    ctx.rotate(Math.PI / 8);
                    ctx.lineTo(0, -this.size / 2);
                    ctx.rotate(Math.PI / 8);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        const ornaments = Array.from({ length: 20 }, () => new Ornament());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ornaments.forEach(ornament => {
                ornament.update();
                ornament.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        animate();
    }
});
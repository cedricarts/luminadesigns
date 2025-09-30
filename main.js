document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".learn-more");
    button.addEventListener("click", function () {
        alert("More details coming soon!");
    });
});

// Custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Interactive hover effects
document.querySelectorAll('.service-card, .portfolio-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    card.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Portfolio item click effect
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        // Add a subtle pulse effect
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'scale(1.05)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        }, 100);
    });
});

//Zoom in 

// Image Lightbox with Zoom Functionality
class ImageLightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        this.init();
    }

    init() {
        // Create lightbox HTML
        this.createLightbox();

        // Get all portfolio images
        this.images = Array.from(document.querySelectorAll('.portfolio-item img'));

        // Add click listeners to portfolio items
        this.images.forEach((img, index) => {
            img.parentElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.open(index);
            });

            // Add pointer cursor
            img.parentElement.style.cursor = 'pointer';
        });
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#10094;</button>
                <button class="lightbox-next">&#10095;</button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-controls">
                    <button class="lightbox-zoom-in">+</button>
                    <button class="lightbox-zoom-out">-</button>
                    <button class="lightbox-reset">Reset</button>
                    <span class="lightbox-counter">1 / 1</span>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Get elements
        this.lightbox = lightbox;
        this.lightboxImg = lightbox.querySelector('.lightbox-image');
        this.lightboxContainer = lightbox.querySelector('.lightbox-image-container');
        this.counter = lightbox.querySelector('.lightbox-counter');

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());

        // Navigation buttons
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());

        // Zoom controls
        this.lightbox.querySelector('.lightbox-zoom-in').addEventListener('click', () => this.zoomIn());
        this.lightbox.querySelector('.lightbox-zoom-out').addEventListener('click', () => this.zoomOut());
        this.lightbox.querySelector('.lightbox-reset').addEventListener('click', () => this.resetZoom());

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === '+' || e.key === '=') this.zoomIn();
            if (e.key === '-') this.zoomOut();
            if (e.key === '0') this.resetZoom();
        });

        // Mouse wheel zoom
        this.lightboxContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // Drag to pan when zoomed
        this.lightboxImg.addEventListener('mousedown', (e) => this.startDrag(e));
        this.lightboxImg.addEventListener('mousemove', (e) => this.drag(e));
        this.lightboxImg.addEventListener('mouseup', () => this.endDrag());
        this.lightboxImg.addEventListener('mouseleave', () => this.endDrag());

        // Touch support for mobile
        this.lightboxImg.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        this.lightboxImg.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        this.lightboxImg.addEventListener('touchend', () => this.endDrag());
    }

    open(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateImage();
        this.resetZoom();
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.resetZoom();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
        this.resetZoom();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
        this.resetZoom();
    }

    updateImage() {
        this.lightboxImg.src = this.images[this.currentIndex].src;
        this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    zoomIn() {
        this.scale = Math.min(this.scale + 0.25, 4);
        this.updateTransform();
    }

    zoomOut() {
        this.scale = Math.max(this.scale - 0.25, 1);
        if (this.scale === 1) {
            this.posX = 0;
            this.posY = 0;
        }
        this.updateTransform();
    }

    resetZoom() {
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        this.updateTransform();
    }

    startDrag(e) {
        if (this.scale <= 1) return;
        this.isDragging = true;
        this.startX = e.clientX - this.posX;
        this.startY = e.clientY - this.posY;
        this.lightboxImg.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        this.posX = e.clientX - this.startX;
        this.posY = e.clientY - this.startY;
        this.updateTransform();
    }

    endDrag() {
        this.isDragging = false;
        this.lightboxImg.style.cursor = this.scale > 1 ? 'grab' : 'default';
    }

    updateTransform() {
        this.lightboxImg.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
        this.lightboxImg.style.cursor = this.scale > 1 ? 'grab' : 'default';
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageLightbox();
});
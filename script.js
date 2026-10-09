// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Smooth scroll for anchor links
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

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Parallax: Seasonal Landscape Care Services background moves on scroll
const seasonalParallax = document.querySelector('.seasonal-parallax');
const seasonalParallaxBg = document.querySelector('.seasonal-parallax-bg');
if (seasonalParallax && seasonalParallaxBg) {
    function updateSeasonalParallax() {
        const rect = seasonalParallax.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const offset = (viewportCenter - sectionCenter) * 0.35;
        seasonalParallaxBg.style.transform = 'translateY(' + offset + 'px)';
    }
    window.addEventListener('scroll', updateSeasonalParallax, { passive: true });
    window.addEventListener('resize', updateSeasonalParallax);
    updateSeasonalParallax();
}

// Scroll animations disabled per request – content visible immediately

// Scroll to top button
const scrollToTopBtn = document.querySelector('.scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Project Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Initialize project items with transition
projectItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// Service Card Carousel Rotation
const serviceCardCarousels = document.querySelectorAll('.service-card-carousel');
serviceCardCarousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.service-card-image-item');
    if (images.length > 1) {
        let currentIndex = 0;
        
        function rotateServiceCard() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }
        
        // Rotate every 3 seconds for service cards
        setInterval(rotateServiceCard, 3000);
    }
});

// Image Carousel Rotation
const carouselImages = document.querySelectorAll('.carousel-image');
if (carouselImages.length > 0) {
    let currentIndex = 0;
    let carouselInterval;
    
    function showImage(index) {
        // Remove active class from current image
        carouselImages[currentIndex].classList.remove('active');
        
        // Update current index
        currentIndex = index;
        
        // Add active class to new image
        carouselImages[currentIndex].classList.add('active');
    }
    
    function nextImage() {
        const nextIndex = (currentIndex + 1) % carouselImages.length;
        showImage(nextIndex);
    }
    
    function prevImage() {
        const prevIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(prevIndex);
    }
    
    function startCarousel() {
        carouselInterval = setInterval(nextImage, 3500);
    }
    
    function stopCarousel() {
        clearInterval(carouselInterval);
    }
    
    // Arrow navigation
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            stopCarousel();
            prevImage();
            startCarousel();
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            stopCarousel();
            nextImage();
            startCarousel();
        });
    }
    
    // Start automatic rotation
    startCarousel();
}

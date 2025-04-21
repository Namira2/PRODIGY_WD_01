// script.js
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileMenu = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section');
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Scroll event listener
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
            
            // Shrink nav a bit more when scrolling down
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.style.padding = '0.7rem 0';
            } else {
                nav.style.padding = '1.2rem 0';
            }
        } else {
            nav.classList.remove('scrolled');
            nav.style.padding = '1.2rem 0';
        }
        
        lastScroll = currentScroll;
        
        // Active section highlight
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Hover effect with animation
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992) { // Only on desktop
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Smooth scrolling with offset
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize - check if page is already scrolled
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    }
    
    // Gallery item animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
            this.querySelector('.gallery-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = '';
            this.querySelector('.gallery-overlay').style.opacity = '0';
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});

let lastScroll = 0;
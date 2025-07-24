// assets/js/script.js

/**
 * Portfolio JavaScript
 * Author: Sandip Budha
 * Description: Interactive features for the portfolio website
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeUtilities();
    initializePageSpecific();
    initializePerformanceMonitoring();
    initializeLazyLoading();
    console.log('🚀 Portfolio loaded successfully!');
});

/**
 * Navigation Functions
 */
function initializeNavigation() {
    // Smooth scrolling for anchor links
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

    // Mobile menu toggle (vertical, with close button)
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navClose = document.querySelector('.nav-close');
    if (mobileMenu && navLinks && navClose) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        navClose.addEventListener('click', () => {
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Active page highlighting
    highlightActivePage();
}

function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Animation Functions
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = "fadeInUp 1s ease forwards";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".skill-card, .project-card, .certificate-card, .timeline-item").forEach((el) => {
        observer.observe(el);
    });

    // Animate contact items on scroll
    document.querySelectorAll(".contact-item").forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateX(-30px)";
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Animate timeline items
    document.querySelectorAll(".timeline-item").forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "translateX(-20px)";
        item.style.transition = "all 0.6s ease";
        observer.observe(item);
    });

    // Animate stats on scroll
    document.querySelectorAll('.stats-section').forEach(section => {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach(stat => {
                        const finalValue = stat.textContent;
                        const numericValue = parseInt(finalValue);
                        if (!isNaN(numericValue)) {
                            animateCounter(stat, numericValue, finalValue);
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(section);
    });

    // Typing animation for hero text (if present)
    initializeTypingAnimation();

    // Counter animations for stats (if present)
    initializeCounterAnimations();
}

function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    const texts = ['Full Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Innovation Seeker'];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();
}

function initializeCounterAnimations() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target, finalText) {
    target = target || parseInt(element.getAttribute('data-target') || element.textContent);
    finalText = finalText || element.textContent;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (finalText.includes('+') ? '+' : '');
        }
    }, 16);
}

/**
 * Form Handling Functions
 */
function initializeFormHandling() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }

    // Newsletter subscription (if exists)
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }

    // Form validation
    initializeFormValidation();

    // Real-time email validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.addEventListener("input", function () {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = "#dc3545";
            } else {
                this.style.borderColor = "#28a745";
            }
        });
    }

    // Character counter for message
    const messageTextarea = document.getElementById("message");
    if (messageTextarea) {
        messageTextarea.addEventListener("input", function () {
            const maxChars = 500;
            const currentChars = this.value.length;
            if (currentChars > maxChars) {
                this.value = this.value.substring(0, maxChars);
            }
        });
    }
}

async function handleContactFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (successMessage) {
        successMessage.classList.add('show');
        setTimeout(() => successMessage.classList.remove('show'), 5000);
    }
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
}

async function handleNewsletterSubmission(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    await new Promise(resolve => setTimeout(resolve, 1000));
    showNotification('Successfully subscribed to newsletter!', 'success');
    e.target.reset();
}

function initializeFormValidation() {
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    let isValid = true;
    let errorMessage = '';
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

/**
 * Utility Functions
 */
function initializeUtilities() {
    // Theme toggle (if implemented)
    initializeThemeToggle();
    // Print functionality
    initializePrintFunctionality();
    // Copy to clipboard functionality
    initializeCopyToClipboard();
    // Loading states
    initializeLoadingStates();
    // Error handling
    initializeErrorHandling();
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initializePrintFunctionality() {
    document.querySelectorAll('.print-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Print')) {
                e.preventDefault();
                window.print();
            }
        });
    });
}

function initializeCopyToClipboard() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.getAttribute('data-copy') || btn.parentNode.textContent;
            try {
                await navigator.clipboard.writeText(text);
                showNotification('Copied to clipboard!', 'success');
            } catch (error) {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Copied to clipboard!', 'success');
            }
        });
    });
}

function initializeLoadingStates() {
    window.showLoading = function(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        element.style.position = 'relative';
        element.appendChild(loader);
    };
    window.hideLoading = function(element) {
        const loader = element.querySelector('.loading-overlay');
        if (loader) loader.remove();
    };
}

function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        showNotification('An error occurred. Check console for details.', 'error');
    });
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Page Specific Initializations
 */
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    switch (currentPage) {
        case 'projects.html':
            initializeProjectFiltering();
            break;
        case 'certificates.html':
            initializeCertificateModals();
            break;
        case 'resume.html':
            initializeSkillBars();
            break;
    }
}

// Project filtering (for projects page)
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterButtons.length || !projectCards.length) return;
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Certificate modal functionality
function initializeCertificateModals() {
    const modal = document.getElementById('certificateModal');
    if (!modal) return;
    window.openModal = function(title, issuer) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalIssuer').textContent = issuer;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    window.closeModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Skill bars animation (for resume page)
function initializeSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                }
            });
        }, { threshold: 0.3 });
        skillObserver.observe(bar);
    });
}

/**
 * Performance Monitoring
 */
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);
        });
    }
}

/**
 * Lazy Loading for Images
 */
function initializeLazyLoading() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        imageObserver.observe(img);
    });
}

/**
 * Social Links Hover Effects
 */
document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-3px) scale(1.1)";
    });
    link.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
    });
});

/**
 * Export functions for use in other scripts
 */
window.portfolioJS = {
    showNotification,
    showLoading: window.showLoading,
    hideLoading: window.hideLoading,
    openModal: window.openModal,
    closeModal: window.closeModal
};

/**
 * Analytics tracking (replace with your analytics code)
 */
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('click', 'button', 'primary-button');
    } else if (e.target.matches('.project-link')) {
        trackEvent('click', 'project', 'project-link');
    } else if (e.target.matches('.social-link')) {
        trackEvent('click', 'social', 'social-link');
    }
});

console.log('📁 Portfolio JavaScript loaded successfully!');
// assets/js/script.js

/**
 * Portfolio JavaScript
 * Author: Sandip Budha
 * Description: Interactive features for the portfolio website
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeUtilities();
    
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

    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            mobileMenu.innerHTML = navLinks.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Active page highlighting
    highlightActivePage();
}

/**
 * Animation Functions
 */
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                // Add stagger effect for multiple elements
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .project-card, .certificate-card, .skill-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Typing animation for hero text
    initializeTypingAnimation();
    
    // Counter animations
    initializeCounterAnimations();
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

/**
 * Specific Implementation Functions
 */

// Highlight active page in navigation
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

// Typing animation
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = ['Full Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Innovation Seeker'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

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
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Counter animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Contact form submission
async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    const successMessage = document.getElementById('successMessage');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Simulate API call (replace with actual form handling)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        if (successMessage) {
            successMessage.classList.add('show');
            setTimeout(() => successMessage.classList.remove('show'), 5000);
        }
        
        // Reset form
        form.reset();
        
        // Show notification
        showNotification('Message sent successfully!', 'success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Newsletter subscription
async function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Successfully subscribed to newsletter!', 'success');
        e.target.reset();
    } catch (error) {
        showNotification('Subscription failed. Please try again.', 'error');
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error states
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    
    // Validation rules
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

// Theme toggle
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

// Print functionality
function initializePrintFunctionality() {
    const printButtons = document.querySelectorAll('.print-btn, .download-btn');
    
    printButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Download') || btn.textContent.includes('Print')) {
                e.preventDefault();
                window.print();
            }
        });
    });
}

// Copy to clipboard
function initializeCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.getAttribute('data-copy') || btn.parentNode.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                showNotification('Copied to clipboard!', 'success');
            } catch (error) {
                // Fallback for older browsers
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

// Loading states
function initializeLoadingStates() {
    // Show loading spinner for async operations
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

// Error handling
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // Optionally show user-friendly error message
        if (process.env.NODE_ENV === 'development') {
            showNotification('An error occurred. Check console for details.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

// Notification system
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Project filtering (for projects page)
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
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
    
    // Open modal function
    window.openModal = function(title, issuer) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalIssuer').textContent = issuer;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    // Close modal function
    window.closeModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Initialize page-specific functionality
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

// Skill bars animation (for resume page)
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.3 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);
            
            // Report Core Web Vitals if available
            if ('web-vital' in window) {
                // Implement Core Web Vitals reporting
            }
        });
    }
}

// Initialize page-specific functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializePageSpecific();
    initializePerformanceMonitoring();
});

// Service Worker registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for use in other scripts
window.portfolioJS = {
    showNotification,
    showLoading: window.showLoading,
    hideLoading: window.hideLoading,
    openModal: window.openModal,
    closeModal: window.closeModal
};

// Analytics tracking (replace with your analytics code)
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('click', 'button', 'primary-button');
    } else if (e.target.matches('.project-link')) {
        trackEvent('click', 'project', 'project-link');
    } else if (e.target.matches('.social-link')) {
        trackEvent('click', 'social', 'social-link');
    }
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

console.log('📁 Portfolio JavaScript loaded successfully!');
// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Handle mobile navigation
    setupMobileNav();

    // Handle scroll animations
    setupScrollAnimations();

    // Handle FAQ toggles
    setupFaqToggles();

    // Navigation scroll effect
    handleNavScroll();

    // Initialize stat counters
    initCounters();
});

function setupMobileNav() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
                setTimeout(() => {
                    navMenu.style.opacity = '1';
                    navMenu.style.transform = 'translateY(0)';
                }, 10);
                mobileMenuBtn.innerHTML = '';
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'x');
                icon.className = 'w-6 h-6';
                mobileMenuBtn.appendChild(icon);
            } else {
                navMenu.style.opacity = '0';
                navMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    navMenu.style.display = 'none';
                }, 300);
                mobileMenuBtn.innerHTML = '';
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'menu');
                icon.className = 'w-6 h-6';
                mobileMenuBtn.appendChild(icon);
            }

            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        navMenu.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navMenu.classList.remove('active');
                    navMenu.style.opacity = '0';
                    navMenu.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        navMenu.style.display = 'none';
                    }, 300);

                    mobileMenuBtn.innerHTML = '';
                    const icon = document.createElement('i');
                    icon.setAttribute('data-lucide', 'menu');
                    icon.className = 'w-6 h-6';
                    mobileMenuBtn.appendChild(icon);

                    // Re-initialize Lucide icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // Add styles for mobile menu
    if (navMenu) {
        navMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
}

function setupScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-animation');
    const statItems = document.querySelectorAll('.stat-item');
    const featureItems = document.querySelectorAll('.feature-item');

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });

    // Observe stat items with delay
    statItems.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });

    // Observe feature items with delay
    featureItems.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });

    // Add visible class when element is in view
    document.addEventListener('scroll', () => {
        revealElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('reveal-visible')) {
                element.classList.add('reveal-visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });

        statItems.forEach((element, index) => {
            if (isElementInViewport(element) && !element.classList.contains('reveal-visible')) {
                element.classList.add('reveal-visible');
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });

        featureItems.forEach((element, index) => {
            if (isElementInViewport(element) && !element.classList.contains('reveal-visible')) {
                element.classList.add('reveal-visible');
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

function setupFaqToggles() {
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('[data-lucide="chevron-down"]');

            // Close all other FAQs
            document.querySelectorAll('.faq-content').forEach(item => {
                if (item !== content && !item.classList.contains('hidden')) {
                    item.style.maxHeight = null;
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);

                    // Reset all other icons
                    const otherIcon = item.previousElementSibling.querySelector('[data-lucide="chevron-down"]');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });

            // Toggle current FAQ
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                content.style.maxHeight = '0px';
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }, 10);

                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            } else {
                content.style.maxHeight = null;
                setTimeout(() => {
                    content.classList.add('hidden');
                }, 300);

                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

function handleNavScroll() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            nav.classList.add('bg-card', 'shadow-md');
            nav.classList.remove('bg-card/80');
        } else {
            nav.classList.remove('bg-card', 'shadow-md');
            nav.classList.add('bg-card/80');
        }

        lastScrollTop = scrollTop;
    });
}

function initCounters() {
    const countElements = document.querySelectorAll('.stat-item h3');
    let countStarted = false;

    function startCounting() {
        if (countStarted) return;
        countStarted = true;

        countElements.forEach(el => {
            const target = el.textContent;
            let suffix = '';

            // Extract numeric value and suffix
            if (target.includes('+')) {
                suffix = '+';
            }
            if (target.includes('M')) {
                suffix += 'M';
            }
            if (target.includes('B')) {
                suffix += 'B';
            }
            if (target.includes('%')) {
                suffix += '%';
            }

            // Extract numeric value
            let value = parseFloat(target.replace(/[^0-9.]/g, ''));

            // For dollar values
            let prefix = '';
            if (target.includes('$')) {
                prefix = '$';
            }

            // Animate the counter
            let startValue = 0;
            const duration = 2000;
            const increment = value / (duration / 16);

            el.textContent = prefix + '0' + suffix;

            const updateCounter = () => {
                startValue += increment;
                if (startValue < value) {
                    if (suffix.includes('%') || !suffix.includes('M') && !suffix.includes('B')) {
                        el.textContent = prefix + Math.floor(startValue) + suffix;
                    } else {
                        el.textContent = prefix + startValue.toFixed(1) + suffix;
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = prefix + value + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    // Start counting when stats are in viewport
    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounting();
                observer.unobserve(statsSection);
            }
        }, {
            threshold: 0.1
        });

        observer.observe(statsSection);
    }
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add toast notification functionality
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // Set toast color based on type
    let iconName = 'info';
    let bgColor = 'bg-primary';

    switch (type) {
        case 'success':
            iconName = 'check-circle';
            bgColor = 'bg-green-500';
            break;
        case 'error':
            iconName = 'alert-circle';
            bgColor = 'bg-red-500';
            break;
        case 'warning':
            iconName = 'alert-triangle';
            bgColor = 'bg-yellow-500';
            break;
    }

    toast.classList.add(bgColor);

    toast.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${iconName}" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
            <button class="ml-auto">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Initialize Lucide icons within the toast
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            icons: {
                'check-circle': lucide.icons['check-circle'],
                'alert-circle': lucide.icons['alert-circle'],
                'alert-triangle': lucide.icons['alert-triangle'],
                'info': lucide.icons['info'],
                'x': lucide.icons['x']
            },
            attrs: {
                class: ["stroke-current"]
            }
        }, toast);
    }

    // Animate toast in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // Set up close button
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });
    }

    // Auto remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';

    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Add global toast function to window for use in other scripts
window.showToast = showToast;
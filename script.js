import { gsap } from 'gsap';

// DOM Elements
const main = document.querySelector('main');
const panels = document.querySelectorAll('.panel');
const sceneIndicators = document.querySelectorAll('.scene-indicator');
const videoItems = document.querySelectorAll('.video-item');
const videoModal = document.getElementById('videoModal');
const closeModal = document.querySelector('.close-modal');
const parallaxLayers = document.querySelectorAll('.parallax-layer');

// Init state
let currentPanel = 0;
let isScrolling = false;
let lastScrollTime = 0;

// Initialize the scene
function init() {
    setupScrolling();
    setupParallaxEffect();
    setupVideoInteractions();
    setupSceneNavigation();
    animateIntro();
    setupMobileOptimizations();
}

// Set up smooth scrolling between panels
function setupScrolling() {
    // Set initial state with first scene indicator active
    sceneIndicators[0].classList.add('active');
    
    // Handle scroll events
    main.addEventListener('scroll', () => {
        if (!isScrolling) {
            const now = Date.now();
            if (now - lastScrollTime > 50) { // Throttle scroll events
                lastScrollTime = now;
                checkVisiblePanel();
            }
        }
    });
    
    // Add horizontal scroll indicators for all screen sizes
    const videoGrids = document.querySelectorAll('.video-grid');
    videoGrids.forEach(grid => {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<span>← SCROLL →</span>';
        grid.parentNode.insertBefore(scrollIndicator, grid.nextSibling);
        
        // Add animation to the scroll indicator
        setTimeout(() => {
            gsap.to(scrollIndicator, {
                opacity: 0,
                duration: 2,
                delay: 3,
                ease: 'power2.inOut'
            });
        }, 2000);
        
        // Add scroll fade effect for edges
        grid.addEventListener('scroll', () => {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            const scrollPosition = grid.scrollLeft;
            
            if (scrollPosition > 10) {
                grid.classList.add('scrolled-right');
            } else {
                grid.classList.remove('scrolled-right');
            }
            
            if (scrollPosition < maxScroll - 10) {
                grid.classList.add('scrolled-left');
            } else {
                grid.classList.remove('scrolled-left');
            }
            
            // Show scroll indicator again when user scrolls
            gsap.to(scrollIndicator, {
                opacity: 0.7,
                duration: 0.3
            });
            
            // Hide it again after a delay
            clearTimeout(grid.scrollTimer);
            grid.scrollTimer = setTimeout(() => {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    duration: 1
                });
            }, 1500);
        });
        
        // Add keyboard navigation for accessibility
        grid.tabIndex = 0;
        grid.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                grid.scrollLeft += 320;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                grid.scrollLeft -= 320;
                e.preventDefault();
            }
        });
    });
}

// Check which panel is currently visible
function checkVisiblePanel() {
    const scrollPosition = main.scrollTop;
    const windowHeight = window.innerHeight;
    
    panels.forEach((panel, index) => {
        const panelTop = panel.offsetTop;
        const panelHeight = panel.offsetHeight;
        
        if (scrollPosition >= panelTop - windowHeight / 2 && 
            scrollPosition < panelTop + panelHeight - windowHeight / 2) {
            if (currentPanel !== index) {
                currentPanel = index;
                updateNavigation(index);
                animatePanel(panel);
            }
        }
    });
}

// Update navigation indicators
function updateNavigation(index) {
    sceneIndicators.forEach(indicator => indicator.classList.remove('active'));
    sceneIndicators[index].classList.add('active');
}

// Animate elements when panel becomes visible
function animatePanel(panel) {
    const panelId = panel.id;
    
    if (panelId === 'watch') {
        animateWatchPanel();
    } else if (panelId === 'about') {
        animateAboutPanel();
    } else if (panelId === 'contact') {
        animateContactPanel();
    }
}

// Animate intro panel elements
function animateIntro() {
    gsap.fromTo('.intro-text h1', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );
    
    gsap.fromTo('.contact-btn', 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out', delay: 2 }
    );
}

// Animate Watch panel
function animateWatchPanel() {
    gsap.fromTo('#watch h2', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    gsap.fromTo('.video-item', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
    );
}

// Animate About panel
function animateAboutPanel() {
    gsap.fromTo('.about-image', 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    gsap.fromTo('.about-text', 
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 }
    );
}

// Animate Contact panel
function animateContactPanel() {
    gsap.fromTo('#contact h2', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    gsap.fromTo('.email-display', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
    );
}

// Set up parallax effect for intro section
function setupParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            const x = mouseX * 100 * speed;
            const y = mouseY * 100 * speed;
            
            gsap.to(layer, {
                x: x,
                y: y,
                duration: 1,
                ease: 'power1.out'
            });
        });
    });
}

// Set up video interactions
function setupVideoInteractions() {
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const youtubePlayer = document.getElementById('youtubePlayer');
            youtubePlayer.src = 'https://www.youtube.com/embed/B7XgOXTtwFs?autoplay=1';
            
            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                gsap.fromTo('.modal-content', 
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
            }, 50);
        });
    });
    
    closeModal.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
}

// Close video modal
function closeVideoModal() {
    gsap.to('.modal-content', {
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            videoModal.style.display = 'none';
            document.body.style.overflow = '';
            const youtubePlayer = document.getElementById('youtubePlayer');
            youtubePlayer.src = '';
        }
    });
}

// Set up scene navigation
function setupSceneNavigation() {
    sceneIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            isScrolling = true;
            
            const targetScene = indicator.getAttribute('data-scene');
            const targetPanel = document.getElementById(targetScene);
            
            if (targetPanel) {
                main.scrollTo({
                    top: targetPanel.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop,
                    behavior: 'smooth'
                });
                
                updateNavigation(index);
                currentPanel = index;
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });
    
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactPanel = document.getElementById('contact');
            if (contactPanel) {
                main.scrollTo({
                    top: contactPanel.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop,
                    behavior: 'smooth'
                });
                
                const contactIndex = Array.from(panels).findIndex(panel => panel.id === 'contact');
                updateNavigation(contactIndex);
                currentPanel = contactIndex;
            }
        });
    }
}

// Add this new function after the setupForm function
function setupMobileOptimizations() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile) {
        // Optimize video grid scrolling for mobile
        const videoGrids = document.querySelectorAll('.video-grid');
        videoGrids.forEach(grid => {
            // Add momentum scrolling for iOS
            grid.style.webkitOverflowScrolling = 'touch';
            grid.style.scrollBehavior = 'smooth';
            
            // Improve scroll performance
            let scrollTimeout;
            grid.addEventListener('scroll', () => {
                grid.classList.add('is-scrolling');
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    grid.classList.remove('is-scrolling');
                }, 150);
            }, { passive: true });
            
            // Add touch feedback for video items
            const videoItems = grid.querySelectorAll('.video-item');
            videoItems.forEach(item => {
                item.addEventListener('touchstart', () => {
                    item.style.transform = 'scale(0.98)';
                    item.style.transition = 'transform 0.1s ease';
                }, { passive: true });
                
                item.addEventListener('touchend', () => {
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 50);
                }, { passive: true });
                
                item.addEventListener('touchcancel', () => {
                    item.style.transform = 'scale(1)';
                }, { passive: true });
            });
        });
        
        // Optimize form inputs for mobile
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // Prevent zoom on iOS
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                
                // Scroll the element into view when focused
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
        });
        
        // Improve scroll performance for main container
        let mainScrollTimeout;
        main.addEventListener('scroll', () => {
            if (!document.body.classList.contains('is-scrolling')) {
                document.body.classList.add('is-scrolling');
            }
            
            clearTimeout(mainScrollTimeout);
            mainScrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });
        
        // Add safe area padding for newer phones
        if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
            document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
        }
    }
    
    // Optimize for all touch devices
    if ('ontouchstart' in window) {
        // Add touch class to body
        document.body.classList.add('has-touch');
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    init();
    
    // Add viewport height CSS custom property for mobile browsers
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
    
    if ('ontouchstart' in window) {
        document.body.addEventListener('touchstart', function() {}, {passive: true});
    }
    
    if (isMobile) {
        const wrestlingRingBg = document.querySelector('.wrestling-ring-bg');
        if (wrestlingRingBg) {
            wrestlingRingBg.style.backgroundSize = 'cover';
            wrestlingRingBg.style.backgroundPosition = 'center center';
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {

    // --- Core Element Selections ---
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const homeText = document.querySelector('#home .text');
    const typewriterElement = document.getElementById('typewriter-text');
    const scrollTopBtn = document.querySelector('.scrolltotop');

    // Mobile Menu elements
    const menuToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    // Carousel elements
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotContainer = document.querySelector('.carousel-pagination');

    let isScrolling = false; // Flag to prevent scroll interruption (used by customSmoothScroll)
    let scrollTicking = false; // Flag to throttle the main scroll handler

    
    // 🛑 REMOVED: The old 'forceRedraw' function was deleted here. 
    // It was causing the navbar to lose its centering (translateX) and jump.

    // --- Glitch Fix: Native Scroll Suppression ---
    const preventNativeScroll = (e) => {
        if (isScrolling) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const enableNativeScroll = () => {
        document.removeEventListener('wheel', preventNativeScroll, { passive: false });
        document.removeEventListener('touchmove', preventNativeScroll, { passive: false });
        isScrolling = false;
    };

    const disableNativeScroll = () => {
        document.addEventListener('wheel', preventNativeScroll, { passive: false });
        document.addEventListener('touchmove', preventNativeScroll, { passive: false });
        isScrolling = true;
    };


    // ----------------------------------------------------------------------
    // --- 0. Custom Smooth Scroll Function (Fast Start, Slow End) ---
    // ----------------------------------------------------------------------
    const customSmoothScroll = (targetPosition, duration) => {
        if (isScrolling) return;

        disableNativeScroll(); // Stop user/browser input from fighting the script

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Easing function for Fast Start, Slow End (Ease-Out Cubic)
        const easeOutCubic = (t) => {
            return (--t) * t * t + 1;
        };

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;

            const progress = easeOutCubic(Math.min(1, timeElapsed / duration));

            window.scrollTo(0, startPosition + distance * progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                window.scrollTo(0, targetPosition);
                enableNativeScroll(); // Re-enable user/browser input
            }
        }
        requestAnimationFrame(animation);
    };

    // --- 1. Initial Home Text Load Animation ---
    if (homeText) {
        setTimeout(() => {
            homeText.classList.add('loaded');
        }, 100);
    }

    // --- 2. Mobile Menu Toggle Logic ---
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // --- 2.1. Navigation Link Click (Custom Scroll) ---
    const scrollDuration = 500; // Total scroll time is set to 500ms

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offset = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetElement.offsetTop - offset;

                    customSmoothScroll(targetPosition, scrollDuration);
                }
            }

            // Menu closing logic
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // --- 3. Scroll Event Handler (Scroll Spy, Navbar Shadow, Menu Blur) ---
    // ----------------------------------------------------------------------
    const handleScrollEvents = () => {
        // A. Scroll Spy Logic
        // Scroll Spy is suspended while custom scrolling is active (prevents flicker)
        if (!isScrolling) {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 80);
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') && a.getAttribute('href').substring(1) === current) {
                    a.classList.add('active');
                }
            });
        }

        // B. Navbar Scroll Shadow/Blur Logic (Handles main navbar and mobile menu)
        if (window.scrollY > 50) {
            // No forceRedraw calls here anymore. CSS now handles translateZ(0).
            if (navbar && !navbar.classList.contains('scrolled')) {
                navbar.classList.add('scrolled');
            }
            if (navMenu && !navMenu.classList.contains('scrolled')) {
                navMenu.classList.add('scrolled');
            }
        } else {
            navbar && navbar.classList.remove('scrolled');
            navMenu && navMenu.classList.remove('scrolled');
        }

        // C. Scroll-to-Top Button Visibility
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    };
    
    // FIX: Throttle the scroll listener using requestAnimationFrame
    const throttleScrollEvents = () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleScrollEvents();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };

    window.addEventListener('scroll', throttleScrollEvents); // Use the throttled function
    handleScrollEvents(); // Initial run on load

    // Scroll-to-Top Button Logic (Uses custom smooth scroll)
    scrollTopBtn?.addEventListener('click', function() {
        customSmoothScroll(0, 500); // 500ms for a quick return to top
    });


    // --- 4. General Scroll Animation Observer ---
    const generalObserverOptions = { threshold: 0.05 };

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // observer.unobserve(entry.target); // Uncomment to run animation only once
            }
        });
    }, generalObserverOptions);

    document.querySelectorAll(
        '.card, .cardo, .leader-card, .service-category, .contact-form, ' +
        '#services h1, .leadership-section h1, .project-gallery-section h2, .gallery-item'
    ).forEach(element => {
        generalObserver.observe(element);
    });

    // --- 5. Typewriter Effect Logic (Core Values) ---
    if (typewriterElement) {
        const coreValues = [
            "1.Integrity & Commitment",
            "2.Safety & Quality",
            "3.Long-term Partnerships.",
            "4.Innovation & Continuous Improvement"
        ];
        let valueIndex = 0;
        const delayBeforeNext = 1500;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        let isTyping = false;
        let observerTriggered = false;

        function typeValue(text, callback) {
            let i = 0;
            isTyping = true;
            typewriterElement.classList.remove('blinking');
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    typewriterElement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    typewriterElement.classList.add('blinking');
                    isTyping = false;
                    setTimeout(callback, delayBeforeNext);
                }
            }, typingSpeed);
        }

        function deleteValue(callback) {
            let text = typewriterElement.textContent;
            isTyping = true;
            typewriterElement.classList.remove('blinking');
            const deletingInterval = setInterval(() => {
                if (text.length > 0) {
                    text = text.substring(0, text.length - 1);
                    typewriterElement.textContent = text;
                } else {
                    clearInterval(deletingInterval);
                    typewriterElement.classList.add('blinking');
                    isTyping = false;
                    setTimeout(callback, 500);
                }
            }, deletingSpeed);
        }

        function startTypewriter() {
            if (!isTyping) {
                const value = coreValues[valueIndex];
                typeValue(value, () => {
                    deleteValue(() => {
                        valueIndex = (valueIndex + 1) % coreValues.length;
                        startTypewriter();
                    });
                });
            }
        }

        const typewriterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !observerTriggered) {
                    observerTriggered = true;
                    startTypewriter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const aboutSection = document.getElementById('about');
        aboutSection && typewriterObserver.observe(aboutSection);
    }

    // --- 6. Carousel Functionality (Infinite Loop & Animation) ---
    if (carousel) {
        const originalHicards = document.querySelectorAll('.carousel > .hicard:not(.is-clone)');
        const cloneCount = 2;
        const totalItems = originalHicards.length;
        let currentIndex = cloneCount;
        const transitionTime = 500;
        const dots = [];

        let isTransitioning = false;

        // --- CLONING LOGIC ---
        for (let i = 0; i < cloneCount; i++) {
            const cloneEnd = originalHicards[totalItems - 1 - i].cloneNode(true);
            cloneEnd.classList.add('is-clone', 'show');
            cloneEnd.classList.remove('slide-from-left', 'slide-from-right');
            carousel.prepend(cloneEnd);

            const cloneStart = originalHicards[i].cloneNode(true);
            cloneStart.classList.add('is-clone', 'show');
            cloneStart.classList.remove('slide-from-left', 'slide-from-right');
            carousel.append(cloneStart);
        }

        // --- DOT CREATION LOGIC ---
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            const slideIndexToMoveTo = i + cloneCount;

            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                moveToSlide(slideIndexToMoveTo);
            });
            dotContainer.appendChild(dot);
            dots.push(dot);
        }

        // --- MOVEMENT & TELEPORT LOGIC ---
        const getSlidePosition = (index) => {
            const allSlides = document.querySelectorAll('.carousel > .hicard');
            const firstSlide = allSlides[0];

            if (!firstSlide || firstSlide.offsetWidth === 0) return 0;

            const style = getComputedStyle(carousel);
            const gap = parseFloat(style.gap) || 0;
            const itemWidth = firstSlide.offsetWidth + gap;
            return index * itemWidth;
        }

        const updateCarousel = (smoothTransition = true) => {
            const offset = getSlidePosition(currentIndex);

            carousel.style.transition = smoothTransition ? `transform ${transitionTime / 1000}s ease-out` : 'none';
            carousel.style.transform = `translateX(-${offset}px)`;

            if (smoothTransition) {
                isTransitioning = true;
                setTimeout(() => {
                    isTransitioning = false;
                }, transitionTime);
            }

            let activeIndex = (currentIndex - cloneCount) % totalItems;
            if (activeIndex < 0) {
                activeIndex += totalItems;
            }

            // Carousel card visibility logic
            const allSlides = document.querySelectorAll('.carousel > .hicard:not(.is-clone)');

            allSlides.forEach((card, index) => {
                card.classList.remove('show', 'slide-from-left', 'slide-from-right');

                if (index === activeIndex) {
                    card.classList.add('show');
                } else {
                    if (index % 2 === 0) {
                        card.classList.add('slide-from-left');
                    } else {
                        card.classList.add('slide-from-right');
                    }
                }
            });
            // End card visibility logic

            dots.forEach(dot => dot.classList.remove('active'));
            dots[activeIndex] && dots[activeIndex].classList.add('active');
        };

        const checkTeleport = () => {
            if (currentIndex >= totalItems + cloneCount) {
                currentIndex = cloneCount;
                updateCarousel(false);
            }
            else if (currentIndex < cloneCount) {
                currentIndex = totalItems + cloneCount - 1;
                updateCarousel(false);
            }
        }

        const moveToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
            setTimeout(checkTeleport, transitionTime);
        };

        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex--;
            updateCarousel();
            setTimeout(checkTeleport, transitionTime);
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex++;
            updateCarousel();
            setTimeout(checkTeleport, transitionTime);
        });

        // --- INITIALIZATION ---
        const initializeCarouselPosition = () => {
            updateCarousel(false);
        }

        window.addEventListener('load', initializeCarouselPosition);
        setTimeout(initializeCarouselPosition, 500);

        window.addEventListener('resize', () => {
            updateCarousel(false);
        });

    }
});

// ----------------------------------------------------------------------
// --- Anchor Smooth Scrolling for Service Cards (Native Centered View) ---
// ----------------------------------------------------------------------
document.querySelectorAll('.service-detail-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Native smooth scroll is used here because 'block: center' is reliable here.
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
});
// --- End Anchor Smooth Scrolling ---
   
const homeSection = document.querySelector("#home");
const body = document.body;

window.addEventListener("scroll", () => {
    const rect = homeSection.getBoundingClientRect();

    if (rect.bottom <= 80) {
        body.classList.remove("home-active");
    } else {
        body.classList.add("home-active");
    }
});

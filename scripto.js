document.addEventListener('DOMContentLoaded', () => { // Ensures the script runs only after the entire HTML structure is loaded

    // --- Core Element Selections ---
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const homeText = document.querySelector('#home .text');
    const typewriterElement = document.getElementById('typewriter-text');

    // Mobile Menu elements
    const menuToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    // Carousel elements
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotContainer = document.querySelector('.carousel-pagination');

    // --- 1. Initial Home Text Load Animation ---
    if (homeText) { 
        setTimeout(() => { 
            homeText.classList.add('loaded'); 
        }, 100);
    }

    // --- 2. Mobile Menu Toggle Logic & Staggered Links ---
    menuToggle.addEventListener('click', () => { 
        const isMenuOpen = navMenu.classList.toggle('active'); 
        menuToggle.classList.toggle('active'); 

        if (isMenuOpen) { 
            document.querySelectorAll('.navbar-menu li').forEach((link, index) => { 
                link.style.transitionDelay = `${index * 0.1}s`; 
            });
        } else { 
            document.querySelectorAll('.navbar-menu li').forEach(link => { 
                link.style.transitionDelay = '0s'; 
            });
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => { 
        link.addEventListener('click', () => { 
            if (navMenu.classList.contains('active')) { 
                navMenu.classList.remove('active'); 
                menuToggle.classList.remove('active'); 
            }
        });
    });

    // --- 3. Scroll Event Handler (Scroll Spy, Navbar Shadow, Scroll-to-Top Button) ---
    const handleScrollEvents = () => { 
        // A. Scroll Spy Logic
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

        // B. Navbar Scroll Shadow/Blur Logic
        if (window.scrollY > 50) { 
            navbar && navbar.classList.add('scrolled'); 
        } else {
            navbar && navbar.classList.remove('scrolled'); 
        }

        // C. Scroll-to-Top Button Visibility
        const scrollTopBtn = document.querySelector('.scrolltotop'); 
        if (scrollTopBtn) { 
            if (window.scrollY > 300) { 
                scrollTopBtn.classList.add('visible'); 
            } else {
                scrollTopBtn.classList.remove('visible'); 
            }
        }
    };

    window.addEventListener('scroll', handleScrollEvents); 
    handleScrollEvents(); 

    // Scroll-to-Top Button Logic
    document.querySelector('.scrolltotop')?.addEventListener('click', function() { 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    });


    // --- 4. General Scroll Animation Observer ---
    const generalObserverOptions = { threshold: 0.05 }; 

    const generalObserver = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                entry.target.classList.add('show'); 
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

    // ----------------------------------------------------------------------
    // --- Anchor Smooth Scrolling for Service Cards (Centered View) ---
    // ----------------------------------------------------------------------
    document.querySelectorAll('.service-detail-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 1. Get the height of the fixed navbar (for top offset)
                const navHeight = navbar ? navbar.offsetHeight : 0; 
                
                // 2. Get the element's top position relative to the document
                const elementTop = targetElement.offsetTop;
                
                // 3. Get the element's height and the viewport's height
                const elementHeight = targetElement.offsetHeight;
                const viewportHeight = window.innerHeight;

                // 4. Calculate the desired scroll position for centering:
                // Scroll position = Element's top position - (Half of viewport height - Half of element height) - Nav Height
                const scrollToPosition = elementTop - (viewportHeight / 2) + (elementHeight / 2) - navHeight;

                window.scrollTo({
                    top: scrollToPosition, 
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- End Anchor Smooth Scrolling ---


    // ----------------------------------------------------------------------
    // --- 6. Carousel Functionality (SCROLL-SNAP STABLE VERSION) ---
    // ----------------------------------------------------------------------
    if (carousel) { 
        const allSlides = document.querySelectorAll('.carousel > .hicard'); 
        const totalItems = allSlides.length;
        const dots = [];

        if (totalItems === 0) return; 

        // --- DOT CREATION LOGIC ---
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            const slideIndex = i; 

            dot.addEventListener('click', () => {
                // Use native scroll to move the carousel smoothly to the corresponding slide
                allSlides[slideIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
            dotContainer.appendChild(dot);
            dots.push(dot);
        }

        // --- CORE NAVIGATION FUNCTIONS ---
        // Stabilized getCurrentSlideIndex: Finds the slide whose center is closest to the carousel's view center.
        const getCurrentSlideIndex = () => {
            const centerLine = carousel.scrollLeft + (carousel.offsetWidth / 2);
            let closestIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < totalItems; i++) {
                const slide = allSlides[i];
                // Calculate the center of the current slide relative to the carousel's start
                const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
                
                // Calculate distance from the carousel's visible center to the slide's center
                const distance = Math.abs(centerLine - slideCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = i;
                }
            }
            return closestIndex;
        };
        
        const updateDots = (currentIndex) => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex]?.classList.add('active');
        };

        const handleNavigation = (event, direction) => {
            event.preventDefault(); // Stop browser default behavior

            let currentIndex = getCurrentSlideIndex(); 
            let nextIndex = currentIndex;
            
            // Determine next index based on direction
            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % totalItems;
            } else if (direction === 'prev') {
                nextIndex = (currentIndex - 1 + totalItems) % totalItems;
            }

            // Move the scroll
            allSlides[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            
            // Optimistically update the dot immediately (the scroll listener handles the final position)
            updateDots(nextIndex);
        };

        // --- EVENT LISTENERS ---
        prevBtn.addEventListener('click', (e) => {
            handleNavigation(e, 'prev');
        });

        nextBtn.addEventListener('click', (e) => {
            handleNavigation(e, 'next');
        });

        // --- SYNCHRONIZE DOTS WITH SCROLL ---
        let isScrolling;
        carousel.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            
            // Wait briefly for the smooth scroll/snap to complete before updating the index.
            isScrolling = setTimeout(() => {
                const visibleIndex = getCurrentSlideIndex();
                updateDots(visibleIndex);
            }, 66); 
        });

        // --- INITIALIZATION ---
        const initializeCarousel = () => {
            // Use 'auto' behavior to instantly snap to the first slide on load
            allSlides[0].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            updateDots(0); 
        }
        
        // Initial setup
        window.addEventListener('load', initializeCarousel);
        setTimeout(initializeCarousel, 500); 
        
        window.addEventListener('resize', () => {
            // Re-snap on resize instantly (no smooth)
            const currentSnapIndex = getCurrentSlideIndex();
            allSlides[currentSnapIndex].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            updateDots(currentSnapIndex);
        });
    }
});



// ======================================================================= // 🛑 SCROLL FIX: ENSURE PAGE ALWAYS OPENS AT THE TOP (0, 0) // ======================================================================= // This is the solution for the page jumping issue. if (window.location.hash) { // Remove the fragment from the URL without triggering a full page reload or scroll jump history.replaceState(null, null, ' '); } // Explicitly set the scroll position to the top immediately. window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // ==============================

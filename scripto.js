document.addEventListener('DOMContentLoaded', () => { // Ensures the script runs only after the entire HTML structure is loaded

    // --- Core Element Selections ---
    const navbar = document.querySelector('.navbar'); // Selects the main navigation bar element
    const sections = document.querySelectorAll('section'); // Selects all <section> elements (used for Scroll Spy)
    const homeText = document.querySelector('#home .text'); // Selects the main text element in the home section
    const typewriterElement = document.getElementById('typewriter-text'); // Selects the element for the Typewriter effect
    
    // Mobile Menu elements
    const menuToggle = document.querySelector('.navbar-toggle'); // Selects the hamburger/menu icon button
    const navMenu = document.querySelector('.navbar-menu'); // Selects the actual menu list container
    // Targets the actual anchor tags
    const navLinks = document.querySelectorAll('.navbar-menu a'); // Selects all links inside the navigation menu

    // Carousel elements
    const carousel = document.querySelector('.carousel'); // Selects the carousel track/container
    const prevBtn = document.querySelector('.prev-btn'); // Selects the previous slide button
    const nextBtn = document.querySelector('.next-btn'); // Selects the next slide button
    const dotContainer = document.querySelector('.carousel-pagination'); // Selects the container for navigation dots
    
    // --- 1. Initial Home Text Load Animation ---
    if (homeText) { // Checks if the home text element exists on the page
        // Use a slight delay to ensure CSS transitions are ready
        setTimeout(() => { // Sets a short delay before applying the loading class
            homeText.classList.add('loaded'); // Adds a class to trigger the initial fade-in animation
        }, 100); 
    }

    // --- 2. Mobile Menu Toggle Logic & Staggered Links ---
    menuToggle.addEventListener('click', () => { // Adds an event listener for when the menu toggle button is clicked
        const isMenuOpen = navMenu.classList.toggle('active'); // Toggles the 'active' class on the menu (returns true if active is now present)
        menuToggle.classList.toggle('active'); // Toggles the 'active' class on the menu button (for the 'X' animation)
        
        // Staggered Link Logic
        if (isMenuOpen) { // If the menu is now open
            document.querySelectorAll('.navbar-menu li').forEach((link, index) => { // Loop through each list item in the menu
                link.style.transitionDelay = `${index * 0.1}s`; // Applies a staggered delay to each link for a visual effect
            });
        } else { // If the menu is now closed
             document.querySelectorAll('.navbar-menu li').forEach(link => { // Loop through all list items
                 link.style.transitionDelay = '0s'; // Resets the transition delay immediately
             });
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => { // Loops through all navigation links
        link.addEventListener('click', () => { // Adds a click listener to each link
            if (navMenu.classList.contains('active')) { // If the menu is currently open
                navMenu.classList.remove('active'); // Closes the menu container
                menuToggle.classList.remove('active'); // Resets the menu toggle icon
            }
        });
    });

    // --- 3. Scroll Event Handler (Scroll Spy, Navbar Shadow, Scroll-to-Top Button) ---
    const handleScrollEvents = () => { // Defines the function that runs on every scroll event
        // A. Scroll Spy Logic
        let current = ''; // Variable to hold the ID of the currently active section
        sections.forEach(section => { // Loop through all section elements
            // Offset for fixed navbar height
            const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 80); // Calculates the top position of the section, accounting for the navbar height
            if (window.scrollY >= sectionTop) { // Checks if the scroll position is past the top of the section
                current = section.getAttribute('id'); // Sets the current active section ID
            }
        });

        navLinks.forEach(a => { // Loop through all navigation links
            a.classList.remove('active'); // Removes the 'active' class from all links
            // Check if href starts with '#' and matches current section ID
            if (a.getAttribute('href') && a.getAttribute('href').substring(1) === current) { // Checks if the link's anchor matches the current section ID
                a.classList.add('active'); // Adds the 'active' class to the corresponding link
            }
        });

        // B. Navbar Scroll Shadow/Blur Logic
        if (window.scrollY > 50) { // Checks if the user has scrolled more than 50 pixels
            navbar && navbar.classList.add('scrolled'); // Adds the 'scrolled' class to the navbar (for shadow/blur CSS)
        } else {
            navbar && navbar.classList.remove('scrolled'); // Removes the 'scrolled' class if near the top
        }
        
        // C. Scroll-to-Top Button Visibility
        const scrollTopBtn = document.querySelector('.scrolltotop'); // Selects the scroll-to-top button
        if (scrollTopBtn) { // Checks if the button exists
            if (window.scrollY > 300) { // Checks if scrolled past 300 pixels
                scrollTopBtn.classList.add('visible'); // Makes the button visible (using CSS)
            } else {
                scrollTopBtn.classList.remove('visible'); // Hides the button
            }
        }
    };

    window.addEventListener('scroll', handleScrollEvents); // Attaches the function to the global scroll event
    handleScrollEvents(); // Run once on load to set initial states (like active link and navbar shadow)
    
    // Scroll-to-Top Button Logic
    document.querySelector('.scrolltotop')?.addEventListener('click', function() { // Adds click listener to the scroll-to-top button
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls the window smoothly to the top (position 0)
    });


    // --- 4. General Scroll Animation Observer ---
    // Lowered threshold to 0.05 for easier triggering on mobile/short sections (Fix for Projects/Leadership)
    const generalObserverOptions = { threshold: 0.05 }; // Defines options for IntersectionObserver, triggering when 5% of the element is visible

    const generalObserver = new IntersectionObserver((entries, observer) => { // Creates a new IntersectionObserver instance
        entries.forEach(entry => { // Loop through all observed elements that have changed intersection state
            if (entry.isIntersecting) { // Checks if the element is currently visible in the viewport
                entry.target.classList.add('show'); // Adds the 'show' class to trigger the CSS animation (e.g., fade in)
                // observer.unobserve(entry.target); // Uncomment to run animation only once
            } 
        });
    }, generalObserverOptions);

    // Elements to observe for the standard 'show' animation (includes all cards, headings, and the contact form)
    document.querySelectorAll( // Selects all elements that should animate into view on scroll
        '.card, .cardo, .leader-card, .service-category, .contact-form, ' +
        '#services h1, .leadership-section h1, .project-gallery-section h2, .gallery-item'
    ).forEach(element => {
        generalObserver.observe(element); // Starts observing each selected element
    });

    // --- 5. Typewriter Effect Logic (Core Values) ---
    if (typewriterElement) { // Checks if the typewriter element exists
        const coreValues = [ // Array of strings to be typed out
            "1.Integrity & Commitment",
            "2.Safety & Quality",
            "3.Long-term Partnerships.",
            "4.Innovation & Continuous Improvement"
        ];
        let valueIndex = 0; // Tracks the current value being typed (index in the coreValues array)
        const delayBeforeNext = 1500; // Time (ms) to pause before deleting a completed word
        const typingSpeed = 100; // Delay (ms) between typing each character
        const deletingSpeed = 50; // Delay (ms) between deleting each character
        let isTyping = false; // Flag to prevent multiple typing processes from running simultaneously
        let observerTriggered = false; // Flag to ensure the effect only starts once

        function typeValue(text, callback) { // Function to type out a string
            let i = 0; // Character index counter
            isTyping = true;
            typewriterElement.classList.remove('blinking'); // Stops the blinking cursor while typing
            const typingInterval = setInterval(() => { // Sets up a repeating interval for typing
                if (i < text.length) { // If there are still characters to type
                    typewriterElement.textContent += text.charAt(i); // Appends the next character to the text
                    i++;
                } else { // Typing is complete
                    clearInterval(typingInterval); // Stops the typing interval
                    typewriterElement.classList.add('blinking'); // Starts the blinking cursor
                    isTyping = false;
                    setTimeout(callback, delayBeforeNext); // Calls the callback (usually deleteValue) after a delay
                }
            }, typingSpeed);
        }

        function deleteValue(callback) { // Function to delete the current string
            let text = typewriterElement.textContent; // Gets the current text content
            isTyping = true;
            typewriterElement.classList.remove('blinking'); // Stops the blinking cursor while deleting
            const deletingInterval = setInterval(() => { // Sets up a repeating interval for deleting
                if (text.length > 0) { // If there are still characters to delete
                    text = text.substring(0, text.length - 1); // Removes the last character
                    typewriterElement.textContent = text; // Updates the displayed text
                } else { // Deletion is complete
                    clearInterval(deletingInterval); // Stops the deleting interval
                    typewriterElement.classList.add('blinking'); // Starts the blinking cursor
                    isTyping = false;
                    setTimeout(callback, 500); // Calls the callback (usually startTypewriter) after a short pause
                }
            }, deletingSpeed);
        }

        function startTypewriter() { // Main function to manage the typing loop
            if (!isTyping) { // Only proceeds if a typing/deleting process isn't already running
                const value = coreValues[valueIndex]; // Gets the current value from the array
                typeValue(value, () => { // Starts typing the value
                    deleteValue(() => { // When typing is done, starts deleting
                        valueIndex = (valueIndex + 1) % coreValues.length; // Moves to the next index in a loop (wraps around)
                        startTypewriter(); // Recursively calls itself to start the cycle again
                    });
                });
            }
        }

        const typewriterObserver = new IntersectionObserver((entries, observer) => { // Observer to trigger the effect when the section comes into view
            entries.forEach(entry => {
                if (entry.isIntersecting && !observerTriggered) { // If the section is visible AND the effect hasn't started yet
                    observerTriggered = true; // Sets the flag to true
                    startTypewriter(); // Starts the typewriter effect
                    observer.unobserve(entry.target); // Stops observing the section (runs only once)
                }
            });
        }, { threshold: 0.2 }); // Triggers when 20% of the element is visible

        const aboutSection = document.getElementById('about'); // Gets the section element containing the typewriter
        aboutSection && typewriterObserver.observe(aboutSection); // Starts observing the section if it exists
    }

    

    // --- 6. Carousel Functionality (Infinite Loop & Animation) ---
    if (carousel) { // Checks if the carousel element exists
        const originalHicards = document.querySelectorAll('.carousel > .hicard:not(.is-clone)'); // Selects the original slides
        const cloneCount = 2; // Number of slides to clone at the beginning and end for the infinite loop illusion
        const totalItems = originalHicards.length; // Total number of original slides
        let currentIndex = cloneCount; // Initial index, set to the first original slide (after the clones)
        const transitionTime = 500; // Duration of the CSS transition (in ms)
        const dots = []; // Array to store the pagination dot elements
        
        // ⭐ ADDED: State flag to prevent rapid clicks during transition ⭐
        let isTransitioning = false; 
        
        // --- CLONING LOGIC ---
        for (let i = 0; i < cloneCount; i++) { // Loop to create clones
            const cloneEnd = originalHicards[totalItems - 1 - i].cloneNode(true); // Clones slides from the end of the original list
            cloneEnd.classList.add('is-clone', 'show'); // Marks it as a clone and keeps it visible
            cloneEnd.classList.remove('slide-from-left', 'slide-from-right'); // Removes animation classes
            carousel.prepend(cloneEnd); // Places the clones at the beginning of the carousel track

            const cloneStart = originalHicards[i].cloneNode(true); // Clones slides from the beginning of the original list
            cloneStart.classList.add('is-clone', 'show'); // Marks it as a clone and keeps it visible
            cloneStart.classList.remove('slide-from-left', 'slide-from-right'); // Removes animation classes
            carousel.append(cloneStart); // Places the clones at the end of the carousel track
        }

        // --- DOT CREATION LOGIC ---
        for (let i = 0; i < totalItems; i++) { // Loop to create dots corresponding to original slides
            const dot = document.createElement('div'); // Creates a new dot element
            dot.classList.add('pagination-dot');
            const slideIndexToMoveTo = i + cloneCount; // Calculates the index of the corresponding original slide (including clones)

            dot.addEventListener('click', () => { // Adds click listener to the dot
                if (isTransitioning) return; // Prevent movement during transition
                moveToSlide(slideIndexToMoveTo); // Moves the carousel to the correct original slide
            }); 
            dotContainer.appendChild(dot); // Appends the dot to its container
            dots.push(dot); // Adds the dot element to the dots array
        }
        
        // --- MOVEMENT & TELEPORT LOGIC ---
        const getSlidePosition = (index) => { // Calculates the pixel offset needed to move to a specific slide index
            const allSlides = document.querySelectorAll('.carousel > .hicard'); // Gets all slides (including clones)
            const firstSlide = allSlides[0];

            if (!firstSlide || firstSlide.offsetWidth === 0) return 0; // Returns 0 if no slides or width is zero
            
            // Calculates the total width of one slide (slide width + gap)
            const itemWidth = firstSlide.offsetWidth + (parseFloat(getComputedStyle(carousel).gap) || 0);
            return index * itemWidth; // Returns the calculated offset
        }

        const updateCarousel = (smoothTransition = true) => { // Updates the carousel's position and active state
            const offset = getSlidePosition(currentIndex); // Gets the offset for the current index
            
            // Sets or removes the transition property based on whether a smooth transition is needed (e.g., set to 'none' for instant "teleport")
            carousel.style.transition = smoothTransition ? `transform ${transitionTime / 1000}s ease-out` : 'none';
            carousel.style.transform = `translateX(-${offset}px)`; // Moves the carousel track

            // ⭐ ADDED: Set the state flag if a smooth transition is starting
            if (smoothTransition) {
                isTransitioning = true;
                setTimeout(() => {
                    isTransitioning = false; // Reset the flag after transition time
                }, transitionTime);
            }
            
            let activeIndex = (currentIndex - cloneCount) % totalItems; // Calculates the index for the dot (relative to original slides)
            if (activeIndex < 0) {
                activeIndex += totalItems; // Handles negative index wrap-around
            }

            // 🚀 UNIFIED ANIMATION LOGIC 🚀
            const allSlides = document.querySelectorAll('.carousel > .hicard:not(.is-clone)'); // Selects only the original slides
            
            allSlides.forEach((card, index) => { // Loop through original slides
                // Reset all non-clone cards
                card.classList.remove('show', 'slide-from-left', 'slide-from-right'); // Removes all animation classes
                
                // Apply 'show' to the active slide(s) to make them visible and reset transform
                if (index === activeIndex) { // If this is the currently active original slide
                    card.classList.add('show'); // Apply 'show' to make it fully visible (resets initial transform)
                } else {
                    // Apply hidden animation state to non-active slides (for staggered entry when they become active)
                    if (index % 2 === 0) {
                        card.classList.add('slide-from-left'); // Set hidden state 1 (left)
                    } else {
                        card.classList.add('slide-from-right'); // Set hidden state 2 (right)
                    }
                }
            });
            // END UNIFIED ANIMATION LOGIC

            dots.forEach(dot => dot.classList.remove('active')); // Removes 'active' class from all dots
            dots[activeIndex] && dots[activeIndex].classList.add('active'); // Sets 'active' class on the correct dot
        };

        const checkTeleport = () => { // Handles the infinite loop by instantly jumping from a clone to the corresponding original slide
            if (currentIndex >= totalItems + cloneCount) { // Checks if the carousel has moved past the last clone
                currentIndex = cloneCount; // Resets index to the first original slide
                updateCarousel(false); // Teleports instantly (no smooth transition)
            } 
            else if (currentIndex < cloneCount) { // Checks if the carousel has moved past the first clone (into the end clones)
                currentIndex = totalItems + cloneCount - 1; // Resets index to the last original slide's clone index
                updateCarousel(false); // Teleports instantly
            }
        }

        const moveToSlide = (index) => { // General function to move to a specific index (used by dots)
            currentIndex = index;
            updateCarousel(); // Moves the carousel smoothly
            setTimeout(checkTeleport, transitionTime); // Checks for teleportation after the smooth transition finishes
        };

        prevBtn.addEventListener('click', () => { // Previous button click handler
            if (isTransitioning) return; // Prevent movement during transition
            currentIndex--; // Decrements index
            updateCarousel();
            setTimeout(checkTeleport, transitionTime);
        });

        nextBtn.addEventListener('click', () => { // Next button click handler
            if (isTransitioning) return; // Prevent movement during transition
            currentIndex++; // Increments index
            updateCarousel();
            setTimeout(checkTeleport, transitionTime);
        });

        // --- INITIALIZATION ---
        const initializeCarouselPosition = () => { // Sets the initial position of the carousel to the first original slide
            updateCarousel(false); // Instant update on load
        }
        
        window.addEventListener('load', initializeCarouselPosition); // Runs initialization after all resources are loaded
        setTimeout(initializeCarouselPosition, 500); // Also runs after a small delay as a fallback

        window.addEventListener('resize', () => { // Recalculates and updates position when the window is resized
            updateCarousel(false); // Instant update (no transition needed on resize)
        });

    }
});

// ----------------------------------------------------------------------
    // --- Anchor Smooth Scrolling for Service Cards (Centered View) ---
    // ----------------------------------------------------------------------
    document.querySelectorAll('.service-detail-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Use scrollIntoView with 'center' block alignment for smooth scrolling
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' // This centers the element in the viewport
                });
                
                // NOTE: To prevent the fixed navbar from overlapping, you would typically 
                // use CSS 'scroll-margin-top' on the target service sections, 
                // set to the height of the fixed navbar.
                // Example CSS: #solar-epc { scroll-margin-top: 80px; }
            }
        });
    });
    // --- End Anchor Smooth Scrolling ---

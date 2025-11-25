document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 1. SCROLL FIX: Ensure the page starts at the top
    // ===========================================

    // Check if the URL has a hash (fragment identifier like #contact)
    if (window.location.hash) {
        // Remove the hash from the URL without triggering a full page reload or scroll jump
        history.replaceState(null, null, ' ');
    }

    // Explicitly set the scroll position to the top immediately upon loading
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' 
    });


    // ===========================================
    // 2. NAVBAR TOGGLE: For Mobile Menu Functionality
    // ===========================================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    navbarToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');
        navbarToggle.setAttribute('aria-expanded', navbarMenu.classList.contains('active'));
    });

    // Close menu when a link is clicked (useful for single-page navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ===========================================
    // 3. CAROUSEL/GALLERY LOGIC
    // ===========================================
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.hicard');
    
    // Define how many cards should be visible at once (adjust based on CSS)
    const cardsPerView = 3; 
    let currentIndex = 0;

    function updateCarousel() {
        // Calculate the translation distance: card width * current index
        // We use scrollLeft for smooth scrolling instead of transform
        const cardWidth = cards[0].offsetWidth; // Get the width of one card
        const scrollDistance = currentIndex * cardWidth;
        
        carousel.scrollTo({
            left: scrollDistance,
            behavior: 'smooth'
        });

        // Update button visibility (optional but good for UX)
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= (cards.length - cardsPerView);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < (cards.length - cardsPerView)) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initial update when the page loads
    updateCarousel(); 
    
    // Recalculate on window resize
    window.addEventListener('resize', updateCarousel);


    // ===========================================
    // 4. TYPEWRITER EFFECT LOGIC (from your HTML)
    // ===========================================
    const values = [
        "Quality, Safety, and Speed.", 
        "Innovation and Technical Excellence.", 
        "Integrity and Transparency.",
        "Commitment to Sustainability."
    ];
    let valueIndex = 0;
    let charIndex = 0;
    const typewriterElement = document.getElementById('typewriter-text');
    const typingSpeed = 70;
    const erasingSpeed = 40;
    const delay = 1500;

    function type() {
        if (valueIndex < values.length) {
            if (charIndex < values[valueIndex].length) {
                typewriterElement.textContent += values[valueIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, delay);
            }
        } else {
            // Loop back to the first value
            valueIndex = 0;
            setTimeout(type, typingSpeed);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typewriterElement.textContent = values[valueIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            valueIndex++;
            setTimeout(type, typingSpeed + 500); // Slight delay before typing next word
        }
    }

    // Start the typewriter effect when the DOM is ready
    type();


    // ===========================================
    // 5. SCROLL-TO-TOP BUTTON VISIBILITY
    // ===========================================
    const scrolltotop = document.querySelector('.scrolltotop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrolltotop.style.display = 'flex';
        } else {
            scrolltotop.style.display = 'none';
        }
    });

    scrolltotop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

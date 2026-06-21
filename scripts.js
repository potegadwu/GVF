/* -------------------------------------------------------------
   VILLA FOKSAL GROUP - INTERACTIVE SCRIPTS
   Handles Bilingual Switching, Drawer Menu, Brand Overlays (Subpages),
   and the Group Launch Announcement Pop-up.
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LANGUAGE SWITCHING SYSTEM ---
    const langPlBtn = document.getElementById('lang-pl');
    const langEnBtn = document.getElementById('lang-en');
    let currentLang = 'pl';

    function setLanguage(lang) {
        if (lang === currentLang) return;
        currentLang = lang;

        // Toggle button states
        if (lang === 'pl') {
            langPlBtn.classList.add('active');
            langEnBtn.classList.remove('active');
            document.documentElement.setAttribute('lang', 'pl');
            document.title = "Villa Foksal Group | Prestiż, tradycja, nowoczesność";
        } else {
            langEnBtn.classList.add('active');
            langPlBtn.classList.remove('active');
            document.documentElement.setAttribute('lang', 'en');
            document.title = "Villa Foksal Group | Prestige, Tradition, Modernity";
        }

        // Translate elements with the '.translation' class
        const translatableElements = document.querySelectorAll('.translation');
        translatableElements.forEach(element => {
            const translationText = element.getAttribute(`data-${lang}`);
            if (translationText) {
                // If the element is a button value or has complex text, we replace it safely
                if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                    element.value = translationText;
                } else {
                    element.innerHTML = translationText;
                }
            }
        });
    }

    langPlBtn.addEventListener('click', () => setLanguage('pl'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));


    // --- 2. NAVIGATION DRAWER MENU ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const navItems = document.querySelectorAll('.nav-item');

    function toggleMenu() {
        const isOpen = sideMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open', isOpen);
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
    }

    menuToggleBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    // Close menu when mouse leaves the side menu container (hover out)
    sideMenu.addEventListener('mouseleave', closeMenu);

    // Close menu when clicking on any nav link
    navItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (sideMenu.classList.contains('open') && 
            !sideMenu.contains(e.target) && 
            !menuToggleBtn.contains(e.target)) {
            closeMenu();
        }
    });


    // --- 3. BRAND DETAILS OVERLAYS (SUBPAGES) ---
    const brandBtns = document.querySelectorAll('.brand-btn');
    const closeOverlayBtns = document.querySelectorAll('.close-overlay');
    const overlays = document.querySelectorAll('.brand-overlay');

    function openBrandOverlay(brandId) {
        const targetOverlay = document.getElementById(`overlay-${brandId}`);
        if (targetOverlay) {
            targetOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling the main page
        }
    }

    function closeAllOverlays() {
        overlays.forEach(overlay => {
            overlay.classList.remove('open');
        });
        document.body.style.overflow = ''; // Restore scrolling
    }

    brandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = btn.getAttribute('data-brand');
            openBrandOverlay(brand);
        });
    });

    // Support clicking anywhere on the brand column column on mobile devices or as fallback
    const brandColumns = document.querySelectorAll('.brand-column');
    brandColumns.forEach(col => {
        col.addEventListener('click', (e) => {
            // Check if the button was clicked directly (to avoid double calls)
            if (e.target.tagName !== 'BUTTON') {
                const btn = col.querySelector('.brand-btn');
                if (btn) {
                    const brand = btn.getAttribute('data-brand');
                    openBrandOverlay(brand);
                }
            }
        });
    });

    closeOverlayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllOverlays();
        });
    });

    // Zespół overlay nav button trigger
    const navZespolBtn = document.getElementById('nav-zespol-btn');
    if (navZespolBtn) {
        navZespolBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            openBrandOverlay('zespol');
        });
    }

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllOverlays();
            closeMenu();
        }
    });


    // --- 4. DYNAMIC ANNOUNCEMENT POP-UP ---
    const infoPopup = document.getElementById('info-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupCtaBtn = document.getElementById('popup-cta');

    // Show pop-up after 2.5 seconds
    setTimeout(() => {
        // Only show if the user hasn't closed it in a previous session
        if (!localStorage.getItem('vfg-popup-closed')) {
            infoPopup.classList.add('show');
        }
    }, 2500);

    function closePopup() {
        infoPopup.classList.remove('show');
        localStorage.setItem('vfg-popup-closed', 'true');
    }

    closePopupBtn.addEventListener('click', closePopup);
    popupCtaBtn.addEventListener('click', () => {
        closePopup();
        // Smoothly scroll to the brands section
        const brandsSection = document.getElementById('marki');
        if (brandsSection) {
            brandsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- 5. BRAND COLUMNS HOVER INTERACTION (Pause others on hover) ---
    const brandCols = document.querySelectorAll('.brand-column');
    
    brandCols.forEach(col => {
        col.addEventListener('mouseenter', () => {
            brandCols.forEach(otherCol => {
                if (otherCol !== col) {
                    // Pause video
                    const video = otherCol.querySelector('.brand-column-video');
                    if (video) {
                        video.pause();
                    }
                    // Pause slideshow
                    const slideshow = otherCol.querySelector('.brand-column-slideshow');
                    if (slideshow) {
                        slideshow.classList.add('paused');
                    }
                    // Dim slightly for focus
                    otherCol.style.opacity = '0.5';
                }
            });
        });
        
        col.addEventListener('mouseleave', () => {
            brandCols.forEach(otherCol => {
                // Play video
                const video = otherCol.querySelector('.brand-column-video');
                if (video) {
                    video.play().catch(() => {});
                }
                // Resume slideshow
                const slideshow = otherCol.querySelector('.brand-column-slideshow');
                if (slideshow) {
                    slideshow.classList.remove('paused');
                }
                // Restore opacity
                otherCol.style.opacity = '';
            });
        });
    });
    // --- 6. SCROLL DETECTOR FOR COMPACT HEADER ---
    function handleScroll() {
        if (window.scrollY > 37) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- 7. SCROLL TO TOP BUTTON (HANDLES MAIN PAGE AND OVERLAYS) ---
    const scrollTopBtn = document.getElementById('scroll-to-top-btn');
    
    function updateScrollTopVisibility() {
        let shouldShow = window.scrollY > 300;
        
        // Also check if any open overlay is scrolled
        overlays.forEach(overlay => {
            if (overlay.classList.contains('open') && overlay.scrollTop > 300) {
                shouldShow = true;
            }
        });
        
        if (shouldShow) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
     }
    
    window.addEventListener('scroll', updateScrollTopVisibility);
    
    // Add scroll event listener to each overlay container
    overlays.forEach(overlay => {
        overlay.addEventListener('scroll', () => {
            // Auto-shrink fullscreen video when scrolling down
            const fullscreenContainer = overlay.querySelector('.video-container.fullscreen');
            if (fullscreenContainer && overlay.scrollTop > 40) {
                const video = fullscreenContainer.querySelector('.overlay-video');
                fullscreenContainer.classList.remove('fullscreen');
                document.body.classList.remove('fullscreen-video-active');
                if (video) {
                    video.pause();
                }
            }
            updateScrollTopVisibility();
        });
    });
    
    scrollTopBtn.addEventListener('click', () => {
        // If an overlay is open, scroll the overlay container to top
        const openOverlay = Array.from(overlays).find(o => o.classList.contains('open'));
        if (openOverlay) {
            openOverlay.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // --- 8. FULLSCREEN VIDEO PLAYER IN OVERLAYS ---
    const overlayVideos = document.querySelectorAll('.overlay-video');
    overlayVideos.forEach(video => {
        const container = video.closest('.video-container');
        if (!container) return;
        const closeBtn = container.querySelector('.video-close-btn');

        // Play event opens fullscreen mode
        video.addEventListener('play', () => {
            if (!container.classList.contains('fullscreen')) {
                container.classList.add('fullscreen');
                document.body.classList.add('fullscreen-video-active');
                video.setAttribute('controls', 'true');
            }
        });

        function closeFullscreenVideo() {
            container.classList.remove('fullscreen');
            document.body.classList.remove('fullscreen-video-active');
            video.pause();
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeFullscreenVideo();
            });
        }

        // Tapping/clicking on video/container close actions
        container.addEventListener('click', (e) => {
            if (container.classList.contains('fullscreen')) {
                const isMobile = window.innerWidth <= 768;
                // If on mobile (max 768px), tap anywhere to close.
                // If on desktop, tap only on background backdrop to close (not video/controls).
                if (isMobile || e.target === container || e.target === video) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeFullscreenVideo();
                }
            }
        });
    });

});

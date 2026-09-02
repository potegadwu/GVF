/* -------------------------------------------------------------
   VILLA FOKSAL GROUP - INTERACTIVE SCRIPTS
   Handles Bilingual Switching, Drawer Menu, Brand Overlays (Subpages),
   and the Group Launch Announcement Pop-up.
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LANGUAGE SWITCHING SYSTEM ---
    let currentLang = 'pl';

    function setLanguage(lang) {
        if (lang === currentLang) return;
        currentLang = lang;

        // Toggle all button states across main footer and all overlay footers
        const plButtons = document.querySelectorAll('.lang-btn-pl, #lang-pl');
        const enButtons = document.querySelectorAll('.lang-btn-en, #lang-en');

        if (lang === 'pl') {
            plButtons.forEach(btn => btn.classList.add('active'));
            enButtons.forEach(btn => btn.classList.remove('active'));
            document.documentElement.setAttribute('lang', 'pl');
            document.title = "Villa Foksal Group | Prestiż, tradycja, nowoczesność";
        } else {
            enButtons.forEach(btn => btn.classList.add('active'));
            plButtons.forEach(btn => btn.classList.remove('active'));
            document.documentElement.setAttribute('lang', 'en');
            document.title = "Villa Foksal Group | Prestige, Tradition, Modernity";
        }

        // Translate elements with the '.translation' class
        const translatableElements = document.querySelectorAll('.translation');
        translatableElements.forEach(element => {
            const translationText = element.getAttribute(`data-${lang}`);
            if (translationText) {
                if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                    element.value = translationText;
                } else {
                    element.innerHTML = translationText;
                }
            }
        });
    }

    document.querySelectorAll('.lang-btn-pl, #lang-pl').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('pl'));
    });
    document.querySelectorAll('.lang-btn-en, #lang-en').forEach(btn => {
        btn.addEventListener('click', () => setLanguage('en'));
    });


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


    // --- 3. BRAND DETAILS OVERLAYS (SUBPAGES) & UNIQUE URL HASH ROUTING ---
    const closeOverlayBtns = document.querySelectorAll(".close-overlay");
    const overlays = document.querySelectorAll(".brand-overlay");

    const BRAND_HASH_MAP = {
        "vf": "villa-foksal",
        "lu": "lookup",
        "cvf": "catering",
        "zespol": "zespol",
        "omnie": "o-mnie"
    };

    const HASH_BRAND_MAP = {
        "villa-foksal": "vf",
        "villafoksal": "vf",
        "vf": "vf",
        "lookup": "lu",
        "lu": "lu",
        "catering": "cvf",
        "cvf": "cvf",
        "catering-villa-foksal": "cvf",
        "cateringvillafoksal": "cvf",
        "zespol": "zespol",
        "o-mnie": "omnie",
        "omnie": "omnie"
    };

    function openBrandOverlay(brandId, updateUrl = true) {
        overlays.forEach(overlay => {
            if (overlay.id !== `overlay-${brandId}`) {
                overlay.classList.remove("open");
            }
        });

        const targetOverlay = document.getElementById(`overlay-${brandId}`);
        if (targetOverlay) {
            targetOverlay.classList.add("open");
            targetOverlay._openedAt = Date.now();
            document.body.style.overflow = "hidden";
            targetOverlay.scrollTop = 0;

            if (updateUrl && BRAND_HASH_MAP[brandId]) {
                const targetHash = `#${BRAND_HASH_MAP[brandId]}`;
                if (window.location.hash !== targetHash) {
                    history.pushState({ overlay: brandId }, "", targetHash);
                }
            }
        }
    }

    function closeAllOverlays(updateUrl = true) {
        let wasOpen = false;
        overlays.forEach(overlay => {
            if (overlay.classList.contains("open")) {
                wasOpen = true;
                overlay.classList.remove("open");
            }
        });
        document.body.style.overflow = "";

        if (updateUrl && wasOpen) {
            const currentHash = window.location.hash.substring(1).toLowerCase();
            if (HASH_BRAND_MAP[currentHash]) {
                history.pushState(null, "", window.location.pathname + window.location.search);
            }
        }
    }

    // Footer Brand Items with logos
    const footerBrandItems = document.querySelectorAll(".footer-brand-item[data-brand]");
    footerBrandItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const brand = item.getAttribute("data-brand");
            if (brand) {
                e.preventDefault();
                openBrandOverlay(brand);
            }
        });
    });

    // Direct Cards on Homepage
    const directBrandCards = document.querySelectorAll(".brand-direct-card");
    directBrandCards.forEach(card => {
        card.addEventListener("click", (e) => {
            const brand = card.getAttribute("data-brand");
            if (brand) {
                e.preventDefault();
                openBrandOverlay(brand);
            }
        });
    });

    // Buttons and links with data-brand
    const brandBtns = document.querySelectorAll(".brand-btn, .cucinelli-card-link[data-brand]");
    brandBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const brand = btn.getAttribute("data-brand");
            if (brand) {
                openBrandOverlay(brand);
            }
        });
    });

    // Support clicking anywhere on brand columns in #marki (intermediate looping videos) as alternative transition
    const brandColumns = document.querySelectorAll(".brand-column");
    brandColumns.forEach(col => {
        col.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") {
                const btn = col.querySelector(".brand-btn");
                if (btn) {
                    const brand = btn.getAttribute("data-brand");
                    if (brand) {
                        openBrandOverlay(brand);
                    }
                }
            }
        });
    });

    // Close buttons on overlays
    closeOverlayBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAllOverlays();
        });
    });

    // Close overlays by clicking anywhere in the layer field (not only on close X)
    overlays.forEach(overlay => {
        let pointerStartX = 0;
        let pointerStartY = 0;

        overlay.addEventListener("pointerdown", (e) => {
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
        }, { passive: true });

        overlay.addEventListener("click", (e) => {
            // Guard against instant closure right after opening
            if (Date.now() - (overlay._openedAt || 0) < 250) {
                return;
            }

            // Ignore drag or swipe gesture (if moved > 10px)
            const moveDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
            if (moveDist > 10) {
                return;
            }

            // Ignore text selection
            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 0) {
                return;
            }

            // If clicked on close button, close
            if (e.target.closest(".close-overlay")) {
                e.preventDefault();
                e.stopPropagation();
                closeAllOverlays();
                return;
            }

            // If clicked on an interactive element (link, button, video, etc.), let it perform its action
            const isInteractive = e.target.closest(
                "a, button, video, input, textarea, select, " +
                ".scroll-to-top, #scroll-to-top-btn, " +
                ".lang-btn, .language-switcher, " +
                ".footer-brand-item, [data-brand]"
            );
            if (isInteractive) {
                return;
            }

            // Clicked anywhere else in the field of the layer -> close the overlay!
            closeAllOverlays();
        });
    });

    // Brand sub-nav links in drawer menu
    const brandNavLinks = document.querySelectorAll(".brand-nav-link");
    brandNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            const brand = link.getAttribute("data-brand");
            if (brand) {
                openBrandOverlay(brand);
            }
        });
    });

    // Zespol overlay nav button trigger
    const navZespolBtn = document.getElementById("nav-zespol-btn");
    if (navZespolBtn) {
        navZespolBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            openBrandOverlay("zespol");
        });
    }

    // O mnie (Founder) overlay nav button trigger
    const navOmnieBtn = document.getElementById("nav-omnie-btn");
    const cardOmnieBtn = document.getElementById("card-omnie-btn");
    [navOmnieBtn, cardOmnieBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
                openBrandOverlay("omnie");
            });
        }
    });

    // Close overlay on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllOverlays();
            closeMenu();
        }
    });

    // URL Hash Routing support (Direct URLs: /#villa-foksal, /#lookup, /#catering)
    function checkInitialHash() {
        const rawHash = window.location.hash.substring(1).toLowerCase();
        if (HASH_BRAND_MAP[rawHash]) {
            setTimeout(() => {
                openBrandOverlay(HASH_BRAND_MAP[rawHash], false);
            }, 60);
        }
    }

    window.addEventListener("popstate", () => {
        const rawHash = window.location.hash.substring(1).toLowerCase();
        if (HASH_BRAND_MAP[rawHash]) {
            openBrandOverlay(HASH_BRAND_MAP[rawHash], false);
        } else {
            closeAllOverlays(false);
        }
    });

    window.addEventListener("hashchange", () => {
        const rawHash = window.location.hash.substring(1).toLowerCase();
        if (HASH_BRAND_MAP[rawHash]) {
            openBrandOverlay(HASH_BRAND_MAP[rawHash], false);
        }
    });

    checkInitialHash();

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

    // Close info-popup by clicking anywhere on the popup layer (except the CTA button)
    if (infoPopup) {
        infoPopup.addEventListener('click', (e) => {
            if (e.target.closest('#popup-cta') || e.target.closest('.info-popup-cta')) {
                return;
            }
            closePopup();
        });
    }

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
        const thresholdAdd = 80;
        const thresholdRemove = 20;
        if (window.scrollY > thresholdAdd) {
            document.body.classList.add('scrolled');
        } else if (window.scrollY < thresholdRemove) {
            document.body.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- 7. SCROLL TO TOP BUTTON (HANDLES MAIN PAGE AND OVERLAYS) ---
    const scrollTopBtn = document.getElementById('scroll-to-top-btn');
    
    function updateScrollTopColor() {
        if (!scrollTopBtn) return;
        const btnRect = scrollTopBtn.getBoundingClientRect();
        if (btnRect.width === 0) return;

        let isOnNavy = false;
        const footers = document.querySelectorAll('.main-footer');
        footers.forEach(footer => {
            const fRect = footer.getBoundingClientRect();
            // Check if arrow overlaps footer in the viewport
            if (btnRect.bottom > fRect.top && btnRect.top < fRect.bottom && fRect.top < window.innerHeight && fRect.bottom > 0) {
                isOnNavy = true;
            }
        });

        if (isOnNavy) {
            scrollTopBtn.classList.add('on-navy');
        } else {
            scrollTopBtn.classList.remove('on-navy');
        }
    }

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

        updateScrollTopColor();
    }
    
    // --- Mobile: show arrow only when user STOPS scrolling ---
    const isMobile = () => window.innerWidth <= 768;
    let scrollTimeout = null;
    
    function handleScrollArrow() {
        if (isMobile()) {
            // On mobile: hide immediately while scrolling
            scrollTopBtn.classList.remove('show');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Show after user stops scrolling for 1.2s
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('show');
                }
                // Check overlays too
                overlays.forEach(overlay => {
                    if (overlay.classList.contains('open') && overlay.scrollTop > 300) {
                        scrollTopBtn.classList.add('show');
                    }
                });
                updateScrollTopColor();
            }, 1200);
        } else {
            // On desktop: normal behavior
            updateScrollTopVisibility();
        }
    }
    
    window.addEventListener('scroll', handleScrollArrow);
    
    // Add scroll event listener to each overlay container
    overlays.forEach(overlay => {
        overlay.addEventListener('scroll', () => {
            updateScrollTopColor();
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
            handleScrollArrow();
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

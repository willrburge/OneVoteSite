document.addEventListener("DOMContentLoaded", function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------------------------------------------------------------
    // Scroll reveal
    // ---------------------------------------------------------------
    function initReveal() {
        if (reduceMotion) return;
        const targets = document.querySelectorAll(
            ".section, .shows-card, .cast-card, .playwright-card, .merch-card, " +
            ".gallery-item, .group-photo, .contact-card, .donate-card, .sponsors-grid > *, .hero__inner"
        );
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

        targets.forEach((el, i) => {
            el.classList.add("reveal");
            // small stagger for items inside the same grid
            if (el.parentElement && el.parentElement.children.length > 1) {
                el.style.transitionDelay = Math.min((i % 6) * 60, 300) + "ms";
            }
            io.observe(el);
        });

        // Safety net: never leave content hidden if the observer misbehaves
        setTimeout(() => {
            targets.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
            });
        }, 1200);
    }

    // ---------------------------------------------------------------
    // Navbar wiring (runs after nav.html is injected)
    // ---------------------------------------------------------------
    function initNav() {
        const navbar = document.getElementById("navbar");
        const menuToggle = document.getElementById("menu-toggle");
        const navLinks = document.getElementById("nav-links");
        if (!navbar || !navLinks) return;

        // Mark the current page
        const here = location.pathname.split("/").pop() || "index.html";
        navLinks.querySelectorAll("a").forEach((a) => {
            const href = (a.getAttribute("href") || "").split("/").pop();
            if (href === here && !a.classList.contains("nav-cta")) {
                a.setAttribute("aria-current", "page");
            }
        });

        // Mobile toggle
        if (menuToggle) {
            menuToggle.addEventListener("click", function (e) {
                e.stopPropagation();
                const open = navLinks.classList.toggle("active");
                menuToggle.classList.toggle("open", open);
                menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
            });

            navLinks.querySelectorAll("a").forEach((a) => {
                a.addEventListener("click", () => {
                    navLinks.classList.remove("active");
                    menuToggle.classList.remove("open");
                    menuToggle.setAttribute("aria-expanded", "false");
                });
            });

            document.addEventListener("click", (e) => {
                if (!navbar.contains(e.target) && navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                    menuToggle.classList.remove("open");
                    menuToggle.setAttribute("aria-expanded", "false");
                }
            });
        }

        // Shrink-on-scroll
        const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Load navbar
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (navPlaceholder) {
        fetch("nav.html")
            .then((response) => response.text())
            .then((data) => {
                navPlaceholder.innerHTML = data;
                initNav();
            })
            .catch((err) => console.error("Navbar load failed:", err));
    }

    // Load footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch("footer.html")
            .then((response) => response.text())
            .then((data) => {
                footerPlaceholder.innerHTML = data;
            })
            .catch((err) => console.error("Footer load failed:", err));
    }

    initReveal();

    // ---------------------------------------------------------------
    // Store slideshow (click to advance, double-click to enlarge)
    // ---------------------------------------------------------------
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    document.querySelectorAll(".slideshow").forEach((slideshow) => {
        const slides = slideshow.querySelectorAll(".slide");
        let index = 0;

        if (slides.length > 0) {
            slideshow.addEventListener("click", () => {
                slides[index].classList.remove("active");
                index = (index + 1) % slides.length;
                slides[index].classList.add("active");
            });

            slides.forEach((img) => {
                img.addEventListener("dblclick", (e) => {
                    e.stopPropagation();
                    if (modal && modalImage) {
                        modalImage.src = img.src;
                        modal.classList.add("show");
                    }
                });
            });
        }
    });

    if (modal) {
        modal.onclick = function () {
            this.classList.remove("show");
        };
    }

    // ---------------------------------------------------------------
    // Gallery lightbox listeners (only if #lightbox exists)
    // ---------------------------------------------------------------
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.addEventListener("click", function (e) {
            if (e.target.id === "lightbox") {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (e) {
            if (!lightbox.classList.contains("show")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") changeSlide(-1);
            if (e.key === "ArrowRight") changeSlide(1);
        });
    }
});

// ===== GALLERY LIGHTBOX =====
// Only runs on pages that have a #lightbox element (e.g. gallery.html)
const galleryImages = ["images/ONEVOTE0726-1.jpg", "images/ONEVOTE0726-2.jpg", "images/ONEVOTE0726-3.jpg", "images/ONEVOTE0726-4.jpg", "images/ONEVOTE0726-5.jpg", "images/ONEVOTE0726-6.jpg", "images/ONEVOTE0726-7.jpg", "images/ONEVOTE0726-8.jpg", "images/ONEVOTE0726-9.jpg", "images/ONEVOTE0726-10.jpg", "images/ONEVOTE0726-11.jpg", "images/ONEVOTE0726-12.jpg", "images/ONEVOTE0726-13.jpg", "images/ONEVOTE0726-14.jpg", "images/ONEVOTE0726-15.jpg", "images/ONEVOTE0726-16.jpg", "images/ONEVOTE0726-17.jpg", "images/ONEVOTE0726-18.jpg", "images/ONEVOTE0726-19.jpg", "images/ONEVOTE0726-20.jpg", "images/ONEVOTE0726-21.jpg", "images/ONEVOTE0726-22.jpg", "images/ONEVOTE0726-23.jpg", "images/ONEVOTE0726-24.jpg", "images/ONEVOTE0726-25.jpg", "images/ONEVOTE0726-26.jpg", "images/ONEVOTE0726-27.jpg", "images/ONEVOTE0726-28.jpg", "images/ONEVOTE0726-29.jpg", "images/ONEVOTE0726-30.jpg", "images/ONEVOTE0726-31.jpg", "images/ONEVOTE0726-32.jpg", "images/ONEVOTE0726-33.jpg", "images/ONEVOTE0726-34.jpg", "images/ONEVOTE0726-35.jpg", "images/ONEVOTE0726-36.jpg", "images/ONEVOTE0726-37.jpg", "images/ONEVOTE0726-38.jpg", "images/ONEVOTE0726-39.jpg", "images/ONEVOTE0726-40.jpg", "images/ONEVOTE0726-41.jpg", "images/ONEVOTE0726-42.jpg", "images/ONEVOTE0726-43.jpg", "images/ONEVOTE0726-44.jpg", "images/ONEVOTE0726-45.jpg", "images/ONEVOTE0726-46.jpg", "images/ONEVOTE0726-47.jpg", "images/ONEVOTE0726-48.jpg", "images/ONEVOTE0726-49.jpg", "images/ONEVOTE0726-50.jpg", "images/ONEVOTE0726-51.jpg", "images/ONEVOTE0726-52.jpg", "images/ONEVOTE0726-53.jpg", "images/ONEVOTE0726-54.jpg", "images/ONEVOTE0726-55.jpg", "images/ONEVOTE0726-56.jpg", "images/ONEVOTE0726-57.jpg", "images/ONEVOTE0726-58.jpg", "images/ONEVOTE0726-59.jpg", "images/ONEVOTE0726-60.jpg", "images/ONEVOTE0726-61.jpg", "images/ONEVOTE0726-62.jpg", "images/ONEVOTE0726-63.jpg", "images/ONEVOTE0726-64.jpg", "images/ONEVOTE0726-65.jpg", "images/ONEVOTE0726-66.jpg", "images/ONEVOTE0726-67.jpg", "images/ONEVOTE0726-68.jpg", "images/ONEVOTE0726-69.jpg", "images/ONEVOTE0726-70.jpg", "images/ONEVOTE0726-71.jpg", "images/ONEVOTE0726-72.jpg", "images/ONEVOTE0726-73.jpg", "images/ONEVOTE0726-74.jpg", "images/ONEVOTE0726-75.jpg", "images/ONEVOTE0726-76.jpg", "images/ONEVOTE0726-77.jpg", "images/ONEVOTE0726-78.jpg", "images/ONEVOTE0726-79.jpg", "images/ONEVOTE0726-80.jpg", "images/ONEVOTE0726-81.jpg", "images/ONEVOTE0726-82.jpg", "images/ONEVOTE0726-83.jpg", "images/ONEVOTE0726-84.jpg", "images/ONEVOTE0726-85.jpg", "images/ONEVOTE0726-86.jpg", "images/ONEVOTE0726-87.jpg", "images/ONEVOTE0726-88.jpg", "images/ONEVOTE0726-89.jpg", "images/ONEVOTE0726-90.jpg", "images/ONEVOTE0726-91.jpg", "images/ONEVOTE0726-92.jpg", "images/ONEVOTE0726-93.jpg", "images/ONEVOTE0726-94.jpg", "images/ONEVOTE0726-95.jpg", "images/ONEVOTE0726-96.jpg", "images/ONEVOTE0726-97.jpg", "images/ONEVOTE0726-98.jpg", "images/ONEVOTE0726-99.jpg", "images/ONEVOTE0726-100.jpg", "images/ONEVOTE0726-101.jpg", "images/ONEVOTE0726-102.jpg", "images/ONEVOTE0726-103.jpg", "images/ONEVOTE0726-104.jpg", "images/ONEVOTE0726-105.jpg", "images/ONEVOTE0726-106.jpg", "images/ONEVOTE0726-107.jpg", "images/ONEVOTE0726-108.jpg", "images/ONEVOTE0726-109.jpg", "images/ONEVOTE0726-110.jpg", "images/ONEVOTE0726-111.jpg", "images/ONEVOTE0726-112.jpg", "images/ONEVOTE0726-113.jpg", "images/ONEVOTE0726-114.jpg", "images/ONEVOTE0726-115.jpg", "images/ONEVOTE0726-116.jpg", "images/ONEVOTE0726-117.jpg", "images/ONEVOTE0726-118.jpg", "images/ONEVOTE0726-119.jpg", "images/ONEVOTE0726-120.jpg", "images/ONEVOTE0726-121.jpg", "images/ONEVOTE0726-122.jpg", "images/ONEVOTE0726-123.jpg", "images/ONEVOTE0726-124.jpg", "images/ONEVOTE0726-125.jpg", "images/ONEVOTE0726-126.jpg", "images/ONEVOTE0726-127.jpg", "images/ONEVOTE0726-128.jpg", "images/ONEVOTE0726-129.jpg", "images/ONEVOTE0726-130.jpg", "images/ONEVOTE0726-131.jpg", "images/ONEVOTE0726-132.jpg", "images/ONEVOTE0726-133.jpg"];
let currentGalleryIndex = 0;

function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.classList.add("show");
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.classList.remove("show");
}

function changeSlide(direction) {
    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = galleryImages.length - 1;
    if (currentGalleryIndex >= galleryImages.length) currentGalleryIndex = 0;
    updateLightbox();
}

function updateLightbox() {
    const img = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    if (img) img.src = galleryImages[currentGalleryIndex];
    if (counter) counter.textContent = (currentGalleryIndex + 1) + " / " + galleryImages.length;
}

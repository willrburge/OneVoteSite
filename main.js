document.addEventListener("DOMContentLoaded", function () {
    // Load navbar
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (navPlaceholder) {
        fetch("nav.html")
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;

                const menuToggle = document.getElementById("menu-toggle");
                const navLinks = document.getElementById("nav-links");

                if (menuToggle && navLinks) {
                    menuToggle.addEventListener("click", function () {
                        navLinks.classList.toggle("active");
                    });
                }
            })
            .catch(err => console.error("Navbar load failed:", err));
    }

    // Load footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(err => console.error("Footer load failed:", err));
    }

    // Slideshow
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    document.querySelectorAll(".slideshow").forEach(slideshow => {
        let slides = slideshow.querySelectorAll(".slide");
        let index = 0;

        if (slides.length > 0) {
            slideshow.addEventListener("click", () => {
                slides[index].classList.remove("active");
                index = (index + 1) % slides.length;
                slides[index].classList.add("active");
            });

            slides.forEach(img => {
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

    // Close modal
    if (modal) {
        modal.onclick = function () {
            this.classList.remove("show");
        };
    }
});
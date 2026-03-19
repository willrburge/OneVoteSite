// Load navbar
fetch("nav.html")
  .then(response => response.text())
  .then(data => {
      document.getElementById("nav-placeholder").innerHTML = data;

      // Grab elements AFTER navbar is inserted
      const toggle = document.getElementById("menu-toggle");
      const navLinks = document.getElementById("nav-links");

      if (toggle && navLinks) { // safety check
          toggle.addEventListener("click", () => {
              navLinks.classList.toggle("active");
          });
      }
  })
  .catch(err => console.error("Navbar load failed:", err));

// Load footer
fetch("footer.html")
  .then(response => response.text())
  .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
  })
  .catch(err => console.error("Footer load failed:", err));

  //Slideshow
/* SLIDESHOW CLICK FUNCTION */
const modal = document.getElementById("imageModal");
document.querySelectorAll(".slideshow").forEach(slideshow => {
    let slides = slideshow.querySelectorAll(".slide");
    let index = 0;

    slideshow.addEventListener("click", () => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    });

    /* IMAGE ENLARGE */
    slides.forEach(img => {
        img.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            document.getElementById("modalImage").src = img.src;
            document.getElementById("imageModal").classList.add("show");
        });
    });
});

/* CLOSE MODAL */
document.getElementById("imageModal").onclick = function() {
    this.classList.remove("show");
};
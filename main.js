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
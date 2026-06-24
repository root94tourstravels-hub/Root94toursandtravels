/* ============================================================
   ROot94 TOURS & TRAVELS — ANIMATION CONTROLLER
   AOS Initialization | Scroll-Triggered Effects | Parallax
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. INITIALIZE AOS (Animate On Scroll) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 80,
        delay: 0,
        anchorPlacement: "top-bottom"
      });
    }
  });

  /* Refresh AOS after dynamic content changes (e.g. gallery filter) */
  window.refreshAOS = function () {
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  };

  /* ---------- 2. NAVBAR LOGO / LINK SUBTLE ENTRANCE ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var navbarBrand = document.querySelector(".navbar-brand");
    if (navbarBrand) {
      navbarBrand.classList.add("anim-fade-in");
    }
  });

  /* ---------- 3. FALLBACK SCROLL-REVEAL (For elements without AOS, using IntersectionObserver) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (!revealElements.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  });

  /* ---------- 4. PARALLAX EFFECT FOR PAGE HEADERS & HERO ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var parallaxEls = document.querySelectorAll(".page-header, .hero-slide");
    if (!parallaxEls.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = 0.35;
        var offset = scrollY * speed;
        if (scrollY < window.innerHeight * 1.2) {
          el.style.backgroundPosition = "center " + (-offset * 0.3) + "px";
        }
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  });

  /* ---------- 6. ICON HOVER WIGGLE TRIGGER (Adds class for animation.css keyframe) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var wiggleIcons = document.querySelectorAll(".service-card .service-icon, .why-choose-card .icon-circle, .value-card .icon-circle");
    wiggleIcons.forEach(function (icon) {
      icon.classList.add("anim-wiggle");
    });
  });

  /* ---------- 7. TESTIMONIAL CAROUSEL AUTO-PLAY ENHANCEMENT (Bootstrap Carousel) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var testimonialCarouselEl = document.getElementById("testimonialCarousel");
    if (testimonialCarouselEl && window.bootstrap) {
      new bootstrap.Carousel(testimonialCarouselEl, {
        interval: 4500,
        wrap: true,
        pause: "hover",
        touch: true
      });
    }
  });

  /* ---------- 8. COUNT-UP TRIGGER FOR ELEMENTS WITH data-aos (Stats already handled in script.js, this adds AOS sync) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var statBoxes = document.querySelectorAll(".stat-box");
    statBoxes.forEach(function (box, index) {
      box.setAttribute("data-aos", "zoom-in");
      box.setAttribute("data-aos-delay", index * 120);
    });
  });

  /* ---------- 9. TYPING TEXT EFFECT FOR HERO SUBTITLE (Optional Enhancement) ---------- */
  function typeWriterEffect(element, text, speed) {
    if (!element) return;
    element.textContent = "";
    var i = 0;

    function typing() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    }
    typing();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var typingTargets = document.querySelectorAll(".js-typewriter");
    typingTargets.forEach(function (el) {
      var originalText = el.getAttribute("data-text") || el.textContent.trim();
      typeWriterEffect(el, originalText, 35);
    });
  });

  /* ---------- 10. IMAGE LAZY FADE-IN ON LOAD ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var lazyImages = document.querySelectorAll("img[loading='lazy']");
    lazyImages.forEach(function (img) {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.6s ease";

      if (img.complete) {
        img.style.opacity = "1";
      } else {
        img.addEventListener("load", function () {
          img.style.opacity = "1";
        });
      }
    });
  });

  /* ---------- 11. GALLERY ITEM ANIMATION RE-TRIGGER ON FILTER (Synced with script.js gallery filter) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var filterBtns = document.querySelectorAll(".gallery-filter-btns button");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTimeout(function () {
          window.refreshAOS();
        }, 100);
      });
    });
  });

  /* ---------- 12. MOUSE-MOVE TILT EFFECT FOR GLASS CARDS (Subtle 3D Effect) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var tiltCards = document.querySelectorAll(".tilt-effect");

    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  });

  /* ---------- 13. PROGRESS BAR ANIMATION (If used on About page skill bars) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var progressBars = document.querySelectorAll(".progress-bar-animated");
    if (!progressBars.length || !("IntersectionObserver" in window)) return;

    var progressObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            var targetWidth = bar.getAttribute("data-width") || "0";
            bar.style.width = targetWidth + "%";
            progressObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );

    progressBars.forEach(function (bar) {
      progressObserver.observe(bar);
    });
  });

  /* ---------- 14. CURSOR-FOLLOW GLOW EFFECT FOR CTA SECTIONS (Subtle Premium Touch) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var ctaSections = document.querySelectorAll(".cta-section");
    ctaSections.forEach(function (cta) {
      cta.addEventListener("mousemove", function (e) {
        var rect = cta.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        cta.style.setProperty("--mouse-x", x + "px");
        cta.style.setProperty("--mouse-y", y + "px");
      });
    });
  });
})();

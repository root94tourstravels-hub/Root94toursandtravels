/* ============================================================
   ROOT94 TOURS & TRAVELS — MAIN SCRIPT
   Core site functionality: navbar, slider, dark mode, etc.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. LOADING SCREEN ---------- */
  /* Hides the loader as soon as the DOM is ready (does not wait on slow/blocked
     external CDN assets like fonts, Bootstrap, AOS, EmailJS), and includes a
     hard-timeout safety net so the loader is GUARANTEED to disappear even in
     the worst case (slow network, blocked CDN, or any later script error). */
  (function setupLoader() {
    var loaderHidden = false;

    function hideLoader() {
      if (loaderHidden) return;
      loaderHidden = true;
      var loader = document.getElementById("loading-screen");
      if (loader) {
        loader.classList.add("loaded");
        setTimeout(function () {
          loader.style.display = "none";
        }, 700);
      }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(hideLoader, 400);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(hideLoader, 400);
      });
    }

    // Safety net: never let the loader stay on screen for more than 5 seconds,
    // no matter what (slow assets, network issues, etc.)
    setTimeout(hideLoader, 5000);
  })();

  // Initialize EmailJS with the correct Public Key.
  // Guarded so that if the EmailJS CDN script is blocked/slow/fails to load,
  // this does not throw and halt the rest of script.js (which would otherwise
  // also stop the navbar, slider, dark mode, and form logic below from running).
  try {
    if (window.emailjs) {
      emailjs.init("wD3FJZtPeubZ7PbPi");
    } else {
      console.warn("EmailJS SDK not available — contact/booking forms will fall back to WhatsApp only.");
    }
  } catch (err) {
    console.error("EmailJS init failed:", err);
  }

  /* ---------- 2. STICKY NAVBAR ON SCROLL ---------- */
  var navbar = document.getElementById("mainNavbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  /* ---------- 3. AUTO-CLOSE MOBILE NAV ON LINK CLICK ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll(".navbar-collapse .nav-link");
    var navbarCollapseEl = document.querySelector(".navbar-collapse");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbarCollapseEl && navbarCollapseEl.classList.contains("show")) {
          if (window.bootstrap) {
            var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseEl) ||
              new bootstrap.Collapse(navbarCollapseEl, { toggle: false });
            bsCollapse.hide();
          }
        }
      });
    });
  });

  /* ---------- 4. ACTIVE NAV LINK BASED ON CURRENT PAGE ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navAnchors = document.querySelectorAll(".navbar-nav .nav-link");

    navAnchors.forEach(function (anchor) {
      var href = anchor.getAttribute("href");
      if (href === currentPage) {
        anchor.classList.add("active");
      } else {
        anchor.classList.remove("active");
      }
    });
  });

  /* ---------- 5. BACK TO TOP BUTTON ---------- */
  var backToTopBtn = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleBackToTop);

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 6. DARK MODE TOGGLE ---------- */
  var darkToggleBtns = document.querySelectorAll(".dark-toggle-btn");
  var htmlEl = document.documentElement;
  var savedTheme = localStorage.getItem("root94-theme");

  function applyTheme(theme) {
    if (theme === "dark") {
      htmlEl.setAttribute("data-theme", "dark");
      darkToggleBtns.forEach(function (btn) {
        var icon = btn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        }
      });
    } else {
      htmlEl.removeAttribute("data-theme");
      darkToggleBtns.forEach(function (btn) {
        var icon = btn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
      });
    }
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  }

  darkToggleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isDark = htmlEl.getAttribute("data-theme") === "dark";
      var newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("root94-theme", newTheme);
    });
  });

  /* ---------- 7. HERO SLIDER ---------- */
  var heroSlides = document.querySelectorAll(".hero-slide");
  var heroDotsWrap = document.getElementById("heroDots");
  var currentSlide = 0;
  var slideInterval;

  function showSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === index);
    });

    if (heroDotsWrap) {
      var dots = heroDotsWrap.querySelectorAll(".hero-dot");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    currentSlide = index;
  }

  function nextSlide() {
    var next = (currentSlide + 1) % heroSlides.length;
    showSlide(next);
  }

  function startSlider() {
    if (heroSlides.length <= 1) return;
    slideInterval = setInterval(nextSlide, 5500);
  }

  function resetSliderInterval() {
    clearInterval(slideInterval);
    startSlider();
  }

  if (heroSlides.length) {
    showSlide(0);

    if (heroDotsWrap) {
      heroSlides.forEach(function (_, i) {
        var dot = document.createElement("span");
        dot.className = "hero-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("data-slide-index", i);
        dot.addEventListener("click", function () {
          showSlide(i);
          resetSliderInterval();
        });
        heroDotsWrap.appendChild(dot);
      });
    }

    startSlider();
  }

  /* ---------- 8. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.addEventListener("click", function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var targetId = anchor.getAttribute("href");
    if (targetId === "#" || targetId === "") return;
    var targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      var offset = 90;
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  });

  /* ---------- 9. STATS COUNTER ANIMATION ---------- */
  var counters = document.querySelectorAll(".counter-value");
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated || !counters.length) return;

    var statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    var rect = statsSection.getBoundingClientRect();
    var isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (!isVisible) return;

    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute("data-target"), 10) || 0;
      var duration = 1800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        counter.textContent = value.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString() + (counter.getAttribute("data-suffix") || "");
        }
      }

      requestAnimationFrame(step);
    });
  }

  window.addEventListener("scroll", animateCounters);
  window.addEventListener("load", animateCounters);

  /* ---------- 10. GALLERY FILTER ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var filterBtns = document.querySelectorAll(".gallery-filter-btns button");
    var galleryItems = document.querySelectorAll(".gallery-grid-item");

    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        var filterValue = btn.getAttribute("data-filter");

        galleryItems.forEach(function (item) {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
            item.classList.add("anim-zoom-in");
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  });

  /* ---------- 11. GALLERY LIGHTBOX (Simple) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var galleryImgs = document.querySelectorAll(".gallery-item img");
    var lightboxModal = document.getElementById("lightboxModal");
    var lightboxImg = document.getElementById("lightboxImage");
    var lightboxCaption = document.getElementById("lightboxCaption");

    if (!lightboxModal || !lightboxImg) return;

    galleryImgs.forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.setAttribute("src", img.getAttribute("src"));
        if (lightboxCaption) {
          lightboxCaption.textContent = img.getAttribute("alt") || "";
        }
        if (window.bootstrap) {
          var modal = new bootstrap.Modal(lightboxModal);
          modal.show();
        }
      });
    });
  });

  /* ---------- 12. FLOATING WHATSAPP & CALL BUTTON DATA ---------- */
  var WHATSAPP_NUMBER = "918015514116"; 
  var CALL_NUMBER = "+918015514116"; 

  document.addEventListener("DOMContentLoaded", function () {
    var whatsappFloatBtn = document.getElementById("floatWhatsapp");
    var callFloatBtn = document.getElementById("floatCall");

    if (whatsappFloatBtn) {
      var defaultMsg = encodeURIComponent(
        "Hello ROOT94 TOURS & TRAVELS! I would like to enquire about your services."
      );
      whatsappFloatBtn.setAttribute(
        "href",
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + defaultMsg
      );
    }

    if (callFloatBtn) {
      callFloatBtn.setAttribute("href", "tel:" + CALL_NUMBER);
    }
  });

  /* ---------- 13. NEWSLETTER FORM (Footer) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var newsletterForm = document.getElementById("newsletterForm");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector("input[type='email']");
      var feedbackEl = document.getElementById("newsletterFeedback");

      if (emailInput && emailInput.value.trim() !== "") {
        if (feedbackEl) {
          feedbackEl.textContent = "Thank you for subscribing!";
          feedbackEl.classList.remove("d-none");
        }
        newsletterForm.reset();
      }
    });
  });

  /* ---------- 14. CONTACT FORM SUBMISSION (EmailJS Fixed) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("contactName").value.trim();
      var email = document.getElementById("contactEmail").value.trim();
      var phone = document.getElementById("contactPhone").value.trim();
      var subject = document.getElementById("contactSubject").value.trim();
      var message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !phone || !message) {
        showContactAlert("danger", "Please fill in all required fields.");
        return;
      }

      var submitBtn = document.getElementById("contactSubmitBtn");
      var originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Actual EmailJS Integration
      // Guarded: if the EmailJS SDK failed to load (blocked/slow CDN), fall
      // back to the same WhatsApp-assisted flow instead of throwing an
      // uncaught error and leaving the submit button stuck on "Sending...".
      if (!window.emailjs) {
        console.warn("EmailJS SDK not available — falling back to WhatsApp.");
        showContactAlert("danger", "Email service is unavailable right now. Please use WhatsApp below to reach us instantly.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        var fallbackMsg = encodeURIComponent(
          "Hello ROOT94 TOURS & TRAVELS,\n\nName: " + name +
          "\nEmail: " + email +
          "\nPhone: " + phone +
          "\nSubject: " + (subject || "General Enquiry") +
          "\nMessage: " + message
        );
        var fallbackWaLink = document.getElementById("contactWhatsappFallback");
        if (fallbackWaLink) {
          fallbackWaLink.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + fallbackMsg);
          fallbackWaLink.classList.remove("d-none");
        }
        return;
      }

      emailjs.send("service_xzu2sss", "template_yqo6xcp", {
        from_name: name,
        from_email: email,
        from_phone: phone,
        subject: subject || "General Enquiry",
        message: message
      })
      .then(function () {
        showContactAlert("success", "Message sent successfully! We will get back to you shortly.");
        contactForm.reset();

        // Offer WhatsApp fallback for instant response
        var waMsg = encodeURIComponent(
          "Hello ROOT94 TOURS & TRAVELS,\n\nName: " + name +
          "\nEmail: " + email +
          "\nPhone: " + phone +
          "\nSubject: " + (subject || "General Enquiry") +
          "\nMessage: " + message
        );
        var waLink = document.getElementById("contactWhatsappFallback");
        if (waLink) {
          waLink.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + waMsg);
          waLink.classList.remove("d-none");
        }
      })
      .catch(function (error) {
        console.error("EmailJS Error:", error);
        showContactAlert("danger", "Something went wrong. Please try again or contact us via WhatsApp.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  });

  function showContactAlert(type, message) {
    var alertBox = document.getElementById("contactFormAlert");
    if (!alertBox) return;
    alertBox.className = "alert alert-" + type + " mt-3";
    alertBox.textContent = message;
    alertBox.classList.remove("d-none");

    setTimeout(function () {
      alertBox.classList.add("d-none");
    }, 6000);
  }

  /* ---------- 15. QUICK BOOKING STRIP ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var quickBookingForm = document.getElementById("quickBookingForm");
    if (!quickBookingForm) return;

    quickBookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var pickup = document.getElementById("quickPickup").value.trim();
      var destination = document.getElementById("quickDestination").value.trim();
      var date = document.getElementById("quickDate").value;
      var vehicle = document.getElementById("quickVehicle").value;

      var params = new URLSearchParams();
      if (pickup) params.set("pickup", pickup);
      if (destination) params.set("destination", destination);
      if (date) params.set("date", date);
      if (vehicle) params.set("vehicle", vehicle);

      window.location.href = "booking.html?" + params.toString();
    });
  });

  /* ---------- 16. PRE-FILL BOOKING FORM ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    var urlParams = new URLSearchParams(window.location.search);
    var pickupField = document.getElementById("pickupLocation");
    var destinationField = document.getElementById("destination");
    var dateField = document.getElementById("travelDate");
    var vehicleField = document.getElementById("vehicleType");

    if (pickupField && urlParams.get("pickup")) {
      pickupField.value = urlParams.get("pickup");
    }
    if (destinationField && urlParams.get("destination")) {
      destinationField.value = urlParams.get("destination");
    }
    if (dateField && urlParams.get("date")) {
      dateField.value = urlParams.get("date");
    }
    if (vehicleField && urlParams.get("vehicle")) {
      vehicleField.value = urlParams.get("vehicle");
    }
  });

  /* ---------- 17. SET MINIMUM DATE ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var dateInputs = document.querySelectorAll("input[type='date']");
    var today = new Date().toISOString().split("T")[0];

    dateInputs.forEach(function (input) {
      input.setAttribute("min", today);
    });
  });

  /* ---------- 18. FAQ SEARCH FILTER ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var faqSearchInput = document.getElementById("faqSearchInput");
    if (!faqSearchInput) return;

    faqSearchInput.addEventListener("input", function () {
      var searchTerm = faqSearchInput.value.toLowerCase();
      var faqItems = document.querySelectorAll(".faq-accordion .accordion-item");

      faqItems.forEach(function (item) {
        var question = item.querySelector(".accordion-button").textContent.toLowerCase();
        var answer = item.querySelector(".accordion-body").textContent.toLowerCase();

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  /* ---------- 19. AUTO-YEAR ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var yearSpans = document.querySelectorAll(".current-year");
    var currentYear = new Date().getFullYear();
    yearSpans.forEach(function (span) {
      span.textContent = currentYear;
    });
  });
})();
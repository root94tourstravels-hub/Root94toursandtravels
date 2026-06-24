/* ============================================================
   ROOT94 TOURS & TRAVELS — BOOKING SCRIPT
   ============================================================ */

(function () {
  "use strict";

  var ROOT94_WHATSAPP_NUMBER = "918015514116"; 
  
  // Initialize EmailJS here as well for booking page.
  // Guarded so a blocked/slow EmailJS CDN script doesn't throw and stop the
  // rest of this file (vehicle selector, passenger counter, validation, etc.)
  // from running.
  try {
    if (window.emailjs) {
      emailjs.init("wD3FJZtPeubZ7PbPi");
    } else {
      console.warn("EmailJS SDK not available — booking form will fall back to WhatsApp only.");
    }
  } catch (err) {
    console.error("EmailJS init failed:", err);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var bookingForm = document.getElementById("bookingForm");
    if (!bookingForm) return;

    /* ---------- 2. PASSENGER COUNTER ---------- */
    var passengerInput = document.getElementById("passengers");
    var decreaseBtn = document.getElementById("passengerDecrease");
    var increaseBtn = document.getElementById("passengerIncrease");

    if (decreaseBtn && passengerInput) {
      decreaseBtn.addEventListener("click", function () {
        var current = parseInt(passengerInput.value, 10) || 1;
        if (current > 1) {
          passengerInput.value = current - 1;
        }
      });
    }

    if (increaseBtn && passengerInput) {
      increaseBtn.addEventListener("click", function () {
        var current = parseInt(passengerInput.value, 10) || 1;
        if (current < 50) {
          passengerInput.value = current + 1;
        }
      });
    }

    /* ---------- 3. FORM VALIDATION HELPERS ---------- */
    function setFieldError(fieldId, message) {
      var field = document.getElementById(fieldId);
      var errorEl = document.getElementById(fieldId + "Error");
      if (field) field.classList.add("is-invalid");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove("d-none");
      }
    }

    function clearFieldError(fieldOrErrorId) {
      var errorEl = document.getElementById(fieldOrErrorId) || document.getElementById(fieldOrErrorId + "Error");
      if (errorEl) errorEl.classList.add("d-none");
      var field = document.getElementById(fieldOrErrorId.replace("Error", ""));
      if (field) field.classList.remove("is-invalid");
    }

    function clearAllErrors() {
      var errorEls = bookingForm.querySelectorAll(".invalid-feedback");
      errorEls.forEach(function (el) {
        el.classList.add("d-none");
      });
      var invalidFields = bookingForm.querySelectorAll(".is-invalid");
      invalidFields.forEach(function (el) {
        el.classList.remove("is-invalid");
      });
    }

    /* ---------- 4. FORM SUBMISSION (EmailJS Fixed) ---------- */
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearAllErrors();

      var isValid = true;

      var customerName = document.getElementById("customerName").value.trim();
      var customerPhone = document.getElementById("customerPhone").value.trim();
      var pickupLocation = document.getElementById("pickupLocation").value.trim();
      var destination = document.getElementById("destination").value.trim();
      var travelDate = document.getElementById("travelDate").value;
      var passengers = document.getElementById("passengers").value;
      var specialMessage = document.getElementById("specialMessage").value.trim();

      if (!customerName) { setFieldError("customerName", "Name is required."); isValid = false; }
      if (!customerPhone || customerPhone.length < 10) { setFieldError("customerPhone", "Valid phone required."); isValid = false; }
      if (!pickupLocation) { setFieldError("pickupLocation", "Pickup required."); isValid = false; }
      if (!destination) { setFieldError("destination", "Destination required."); isValid = false; }
      if (!travelDate) { setFieldError("travelDate", "Date required."); isValid = false; }
      if (!isValid) return;

      var bookingRefId = generateBookingRefId();
      var submitBtn = document.getElementById("bookingSubmitBtn");
      var originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      // Store data for WhatsApp resend button
      var bookingData = {
        refId: bookingRefId,
        customer_name: customerName,
        customer_phone: customerPhone,
        pickup_location: pickupLocation,
        destination: destination,
        travel_date: formatDateForDisplay(travelDate),
        passengers: passengers,
        special_message: specialMessage || "None"
      };
      window._root94LastBooking = bookingData;

      // Actual EmailJS Sending
      // Guarded: if the EmailJS SDK failed to load (blocked/slow CDN), skip
      // straight to the existing WhatsApp fallback instead of throwing an
      // uncaught error and leaving the submit button stuck on "Processing...".
      if (!window.emailjs) {
        console.warn("EmailJS SDK not available — booking will proceed via WhatsApp only.");
        showBookingSuccessModal(bookingData);
        var fallbackWhatsappURL = buildWhatsAppURL(bookingData);
        setTimeout(function () {
          window.open(fallbackWhatsappURL, "_blank");
        }, 800);
        bookingForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }

      emailjs.send("service_xzu2sss", "template_snzkwug", bookingData)
      .then(function () {
        showBookingSuccessModal(bookingData);

        // Auto-open WhatsApp
        var whatsappURL = buildWhatsAppURL(bookingData);
        setTimeout(function () {
          window.open(whatsappURL, "_blank");
        }, 800);

        bookingForm.reset();
      })
      .catch(function (err) {
        console.error("Booking Error:", err);
        alert("Email service failed, but you can still complete your booking via WhatsApp.");
        window.open(buildWhatsAppURL(bookingData), "_blank");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    });

    function generateBookingRefId() {
      var now = new Date();
      return "R94-" + now.getTime().toString().slice(-6);
    }

    function formatDateForDisplay(dateStr) {
      if (!dateStr) return "N/A";
      var dateObj = new Date(dateStr + "T00:00:00");
      return dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }

    function buildWhatsAppURL(data) {
      var msg = "*NEW BOOKING REQUEST — ROOT94*\n" +
        "*Ref:* " + data.refId + "\n" +
        "*Name:* " + data.customer_name + "\n" +
        "*Route:* " + data.pickup_location + " to " + data.destination + "\n" +
        "*Date:* " + data.travel_date + "\n" +
        "*Passengers:* " + data.passengers + " pax";
      return "https://wa.me/" + ROOT94_WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
    }

    function showBookingSuccessModal(data) {
      var modalEl = document.getElementById("bookingSuccessModal");
      var summaryEl = document.getElementById("bookingSuccessSummary");
      if (summaryEl) {
        summaryEl.innerHTML = `<strong>Ref:</strong> ${data.refId}<br><strong>Customer:</strong> ${data.customer_name}<br><strong>Travel:</strong> ${data.pickup_location} to ${data.destination}`;
      }
      if (window.bootstrap) {
        new bootstrap.Modal(modalEl).show();
      }
    }

    var resendWhatsappBtn = document.getElementById("resendWhatsappBtn");
    if (resendWhatsappBtn) {
      resendWhatsappBtn.addEventListener("click", function () {
        if (window._root94LastBooking) {
          window.open(buildWhatsAppURL(window._root94LastBooking), "_blank");
        }
      });
    }
  });
})();
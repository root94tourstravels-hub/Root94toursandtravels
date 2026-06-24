# ROOT94 TOURS & TRAVELS — Official Website

![ROOT94 TOURS & TRAVELS](images/og-cover.jpg)

**Your Journey, Our Responsibility**

A premium, fully responsive travel agency website for **ROOT94 TOURS & TRAVELS**, based in Palani, Tamil Nadu, India. Built with HTML5, CSS3, Bootstrap 5, and vanilla JavaScript — featuring glassmorphism UI, AOS scroll animations, a WhatsApp-integrated booking system, and full dark mode support.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Booking System](#booking-system)
- [EmailJS Integration Guide](#emailjs-integration-guide)
- [Customization Guide](#customization-guide)
- [Replacing Placeholder Images](#replacing-placeholder-images)
- [Browser Support](#browser-support)
- [Deployment](#deployment)
- [Credits](#credits)
- [License](#license)

---

## 🌍 Overview

| | |
|---|---|
| **Company** | ROOT94 TOURS & TRAVELS |
| **Location** | Palani, Tamil Nadu, India |
| **Tagline** | "Your Journey, Our Responsibility" |
| **Phone / WhatsApp** | +91 80155 14116 |
| **Services** | Local Taxi, Outstation Taxi, Airport Pickup & Drop, Railway Station Pickup & Drop, Bus Stand Pickup & Drop, Temple Tour Packages, Family Tours, Corporate Travel, Tempo Traveller Rental, Hotel Booking Assistance, Sightseeing Trips, All India Tour Packages |

This project is a static, GitHub-ready, production-quality multi-page website. No backend or database is required — booking requests are routed directly to the business via WhatsApp, and a contact form is pre-wired for EmailJS (just add your keys).

---

## ✨ Features

- 🎨 **Premium UI** — Blue / White / Orange brand theme with glassmorphism cards
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile (breakpoints down to 360px)
- ⚡ **Fast Loading** — No build step, CDN-hosted libraries, lazy-loaded images
- 🌗 **Dark Mode Toggle** — Persisted via `localStorage`
- 🎬 **AOS Scroll Animations** — Fade, zoom, and slide-in effects throughout
- 🖼️ **Hero Slider** — Auto-playing 3-slide hero with dot navigation
- 📌 **Sticky Navbar** — Shrinks and adds shadow on scroll
- 🧭 **Smooth Scroll** — For all in-page anchor links
- 🖱️ **Hover Effects** — Card lifts, icon flips, button shimmer
- 🖼️ **Filterable Gallery** — With lightbox modal preview
- ❓ **FAQ Accordion** — With live search filtering (Contact page)
- 📝 **Contact Form** — EmailJS-ready with WhatsApp fallback
- 🗺️ **Google Maps** — Embedded location on the Contact page
- 💬 **Floating WhatsApp Button** — Pulsing animation, pre-filled message
- 📞 **Floating Call Button** — One-tap calling on mobile
- ⬆️ **Back To Top Button** — Appears after scrolling
- ⏳ **Loading Screen** — Branded animated preloader
- 🚐 **Booking System** — Full form with vehicle selector, passenger counter, and **automatic WhatsApp message generation** (no payment gateway)

---

## 📁 Project Structure

```
Root94-Tours-Travels/
│
├── index.html              # Homepage
├── about.html               # About Us page
├── services.html            # All 12 services in detail
├── packages.html             # Tour packages with filters & pricing
├── contact.html              # Contact form, map, FAQ
├── booking.html               # Booking form + WhatsApp auto-send
│
├── css/
│   ├── style.css            # Core design system (colors, layout, components)
│   ├── responsive.css       # All media query breakpoints
│   └── animations.css       # Keyframes & micro-interactions
│
├── js/
│   ├── script.js            # Core site logic (navbar, slider, dark mode, etc.)
│   ├── booking.js           # Booking form validation + WhatsApp message builder
│   └── animation.js         # AOS init + scroll-triggered effects
│
├── images/                   # All image assets (see placeholder note below)
├── assets/                    # Reserved for additional assets (icons, docs, etc.)
├── favicon.ico                # Site favicon
└── README.md                  # This file
```

---

## 📄 Pages

| Page | Description |
|---|---|
| **Home** (`index.html`) | Hero slider, quick booking strip, services grid, featured packages, fleet preview, stats counter, testimonials, FAQ |
| **About** (`about.html`) | Company story, mission & vision, core values, journey timeline, trust section |
| **Services** (`services.html`) | All 12 services in full detail with sticky scroll-spy navigation |
| **Packages** (`packages.html`) | Filterable tour package catalog with itineraries, pricing, inclusions/exclusions |
| **Booking** (`booking.html`) | Full booking form with WhatsApp auto-send and success modal |
| **Contact** (`contact.html`) | Contact form, info cards, Google Maps, business hours, FAQ |

---

## 🚀 Getting Started

This is a static website with **no build tools or dependencies to install.**

### Option 1: Open Directly
Simply open `index.html` in any modern browser.

### Option 2: Local Server (Recommended)
Some features (like fetch-based behavior) work better over HTTP rather than `file://`. Use any simple local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server package)
npx http-server -p 8000
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Deploy Instantly
Push this folder to GitHub and deploy for free using **GitHub Pages**, **Netlify**, or **Vercel** (see [Deployment](#deployment) below).

---

## 🚐 Booking System

The booking page (`booking.html`) collects the following fields:

- Full Name
- Phone Number
- Pickup Location
- Destination
- Travel Date
- Pickup Time
- Vehicle Type (Sedan / SUV / Tempo Traveller / Mini Bus)
- Number of Passengers
- Special Message (optional)

### What happens on submit:

1. All required fields are validated client-side.
2. A unique booking reference ID is generated (e.g. `R94-260621-4821`).
3. A **"Booking Request Submitted Successfully!"** confirmation modal is displayed with a summary.
4. WhatsApp automatically opens (in a new tab) with a pre-filled, formatted message containing all booking details, sent to **+91 80155 14116**.
5. **No payment gateway is used or required** — payment and fare confirmation happen directly between the customer and ROOT94's team.

This logic lives in `js/booking.js` and is fully commented for easy maintenance.

---

## 📧 EmailJS Integration Guide

Both the **Contact form** (`contact.html`) and the **Booking form** (`booking.html`) are pre-wired for [EmailJS](https://www.emailjs.com/), but EmailJS is **not active by default** — forms currently simulate success and rely on the WhatsApp flow. To activate real email delivery:

### Step 1 — Create an EmailJS Account
Sign up at [emailjs.com](https://www.emailjs.com/) and create:
- An **Email Service** (e.g. connect your Gmail) → gives you a `Service ID`
- An **Email Template** → gives you a `Template ID`
- Your **Public Key** from Account → API Keys

### Step 2 — Activate in `js/script.js`
Find the commented block inside the `contactForm` submit handler:

```javascript
emailjs.send(
  "service_xzu2sss", 
  "template_9if8kkdd",
   {
  from_name: name,
  from_email: email,
  from_phone: phone,
  subject: subject,
  message: message
}, 
"wD3FJZtPeubZ7PbPi"
)
.then(() => {
    alert("Massage Sent Successfully!");
})
.catch((error) => {
     console.error(error);
})
```

Replace `"service_xzu2sss"`, `"template_9if8kkdd"`, and `"wD3FJZtPeubZ7PbPi"` with your actual values, then **uncomment** the block and remove (or keep as fallback) the simulated `setTimeout` success block below it.

### Step 3 — Activate in `js/booking.js`
The same pattern applies inside the `bookingForm` submit handler — uncomment the `emailjs.send(...)` block and add your keys.

### Step 4 — Confirm the Script Tag
The EmailJS SDK is already linked in every page's `<head>`/footer scripts:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

No further setup is needed once your keys are added.

---

## 🎨 Customization Guide

### Brand Colors
All colors are defined as CSS variables in `css/style.css` under `:root`:

```css
--primary-blue: #0a3d62;
--accent-orange: #ff7b00;
--white: #ffffff;
```

Change these values once and the entire site updates consistently.

### Contact Number
The WhatsApp/Call number is set in two JavaScript files:
- `js/script.js` → `WHATSAPP_NUMBER` and `CALL_NUMBER`
- `js/booking.js` → `ROOT94_WHATSAPP_NUMBER`

It also appears as plain text/links across all HTML files (`tel:` and `wa.me` links) — use a find-and-replace across the project if you need to change it.

### Fonts
Headings use **Poppins**; body text uses **Inter** — both loaded via Google Fonts in each page's `<head>`.

### Adding a New Page
Copy the structure of an existing page (e.g. `about.html`), update the `<title>`, meta tags, page header, and main content — the navbar, footer, and floating buttons can be copied as-is.

---

## 🖼️ Replacing Placeholder Images

This project references images by filename inside the `images/` folder (e.g. `hero-slide-1.jpg`, `package-arupadai.jpg`, `gallery-1.jpg`, etc.) but does **not** ship with actual photography, since real photos of ROOT94's fleet, drivers, and locations should be used for an authentic, production-ready site.

**To complete the site:**
1. Gather real photographs of your vehicles, drivers, completed trips, and the Palani office/area.
2. Save them into the `images/` folder using the exact filenames referenced in each HTML file (search for `images/` in any file to find all references), or
3. Update the `src` attributes in the HTML to match your own filenames.

Recommended image sizes:
- Hero slider backgrounds: 1920×1080px
- Page header backgrounds: 1920×600px
- Gallery images: 800×800px
- Testimonial avatars: 150×150px

---

## 🌐 Browser Support

Tested and supported on the latest versions of:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS & iOS)
- Samsung Internet

---

## ☁️ Deployment

### GitHub Pages
1. Push this project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` and folder to `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Netlify
1. Drag and drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect your GitHub repo.
2. No build command is required — it's a static site.

### Vercel
1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other** (static site).
3. Deploy — no build step needed.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, SEO meta tags, JSON-LD structured data
- **CSS3** — Custom design system, glassmorphism, CSS variables, media queries
- **Bootstrap 5.3.3** — Grid system, components (navbar, modal, carousel, accordion)
- **JavaScript (Vanilla ES5/ES6)** — No frameworks, no build step
- **Font Awesome 6.5.1** — Icon library
- **Google Fonts** — Poppins & Inter
- **AOS 2.3.4** — Animate On Scroll library
- **EmailJS 4** — Client-side email delivery (ready to activate)

---

## 👏 Credits

Designed & developed for **ROOT94 TOURS & TRAVELS**, Palani, Tamil Nadu.

> "Your Journey, Our Responsibility"

---

## 📜 License

This project was custom-built for ROOT94 TOURS & TRAVELS. All brand names, taglines, and business content belong to ROOT94 TOURS & TRAVELS. The underlying code structure may be reused and adapted for similar travel agency projects.

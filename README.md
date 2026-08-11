# VisionVogue — Luxury Eyewear Platform

A fully functional e-commerce platform for eyewear, built with Node.js, Express, EJS, and Sequelize (SQLite).

## Quick Start

```bash
npm install
node seed-from-dataset.js   # generates placeholder product imagery + seeds the database
node app.js                 # starts the server
```

Visit **http://localhost:5000**

## What's Included

- **Homepage** with animated hero, category tiles, new arrivals, best sellers, sunglasses edit
- **Mega-menu navigation** (Eyeglasses / Sunglasses) with hover-reveal columns
- **Product catalog** (`/products`, `/products/category/:cat`) with sidebar filters (frame shape, price, gender), filter pills (Essential/Premium/Sale), and hover-to-model-photo image swap on cards
- **Product detail page** (`/products/:id`) — thumbnail gallery, frame type/color/size selectors, payable lens upgrades with live price updates, prescription accordion (OD/OS, SPH/CYL/AXIS), pincode delivery checker, spec table, and a customer review photo strip
- **Virtual Try-On** (`/virtual-try-on`) — drag-and-drop photo upload, animated 3-second AI scan, face-shape detection with frame recommendations
- **Cart & Checkout** — slide-out cart drawer (available site-wide), full cart page, checkout with shipping form, order creation
- **Auth** — register/login with bcrypt password hashing, session-based
- **Support Hub** (`/support/*`) — track order, returns & exchange, shipping & delivery, prescription guide
- **Admin Dashboard** (`/admin`) — product/order counts, revenue, low-stock alerts, recent orders
- **Stores** and **Try @ Home** informational pages

## Motion & Animation

Built with GSAP + ScrollTrigger (scroll-reveal), CSS transitions (mega-menu, cart drawer, hover swaps, accordions), and a custom laser-scan animation for the Virtual Try-On flow — the same visual quality Framer Motion would deliver, adapted for this server-rendered EJS stack (Framer Motion itself is React-only, which isn't part of this architecture).

## Real Product Photography

No dataset ZIP was supplied, so `seed-from-dataset.js` calls `generate-placeholder-images.js` to create tasteful SVG placeholder imagery (frame shots, model-wearing shots, customer review photos) for 41 demo products. To use real photography:

1. Drop your images into `public/images/products/<id>/` following the same naming convention (`p<id>_0.svg` → replace with `.jpg`, etc. — update the `image`/`images` fields in the seed script accordingly)
2. Or adapt `seed-from-dataset.js` to scan a real `archive_extracted/` folder as described in the original PRD

## Tech Stack

Node.js 18+, Express, EJS, Sequelize, SQLite3, Bootstrap 5.3, FontAwesome 6, GSAP 3.12, bcryptjs, express-session.

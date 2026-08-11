# 👓 VisionVogue — Luxury Eyewear & Contact Lens E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-VisionVogue-green?logo=mongodb)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/Template-EJS-blue)](https://ejs.co/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205.3-purple?logo=bootstrap)](https://getbootstrap.com/)
[![GitHub](https://img.shields.io/badge/Repository-VisionVogue--E--Commerce--Website-181717?logo=github)](https://github.com/Rohitsuryawanshi19/VisionVogue-E-Commerce-Website)

**VisionVogue** is a state-of-the-art luxury e-commerce platform for Eyeglasses, Sunglasses, Contact Lenses, and Special Power Lenses, engineered with **Node.js, Express, EJS, and MongoDB**. Inspired by industry leaders like Lenskart and Flipkart, it features real-time order tracking, dynamic UPI QR code payments with 5-minute timers, interactive 3D product previews, and a user profile vault.

---

## 🌟 Key Features

### 🛒 1. Catalog & Product Discovery
- **Mega-Menu Navigation**: Split categories for Eyeglasses, Sunglasses, Contact Lenses, and Men's/Women's showcase collections.
- **Dataset Integration**: Pre-loaded with 1,300+ real product datasets complete with high-resolution frame gallery shots, model previews, and real customer review photos.
- **Interactive Contact Lens Section**: Customized 3D packaging artwork for CooperVision, Bausch & Lomb, and Johnson & Johnson lenses (Acuvue Moist, Acuvue Oasys, Lacelle Color, BioTrue).
- **Auto-Banner Slideshow**: Animated hero slider cycling banners every 4 seconds.

### 💳 2. Real-Time Order & Payment Automation
- **Dynamic UPI QR Code Generator**: Generates real-time UPI payment QR codes (`upi://pay?pa=visionvogue@upi`) pre-filled with order subtotal.
- **5-Minute Payment Countdown Clock**: Active session timer (`05:00` → `00:00`) with auto-cancellation on expiry.
- **Interactive Credit Card Preview**: Live 3D card preview updating cardholder name, card number, and expiry in real-time.
- **Automated Order Lifecycle**: Real-time fulfillment tracking through milestones: `Order Placed` ➔ `Optical Lab` ➔ `In Transit` ➔ `Delivered`.

### 👤 3. User Dashboard & Rx Vault (`/auth/profile`)
- **VIP Rewards**: Earn and redeem Vogue Reward Points on purchases.
- **Prescription Vault**: Save and manage optical prescriptions (OD/OS SPH, CYL, AXIS, PD).
- **Order History**: Track live orders with interactive progress bars.
- **1-Click VIP Demo Login**: Instant login option for quick testing.

### 🕶️ 4. Virtual Try-On & Support Hub
- **AI Virtual Try-On**: Drag-and-drop photo upload with animated facial feature scan and frame recommendations.
- **Customer Support Portal**: Dedicated pages for Track Order, Returns & Exchange, Shipping Policy, and Stores locator.
- **Admin Dashboard (`/admin`)**: Real-time sales metrics, revenue analytics, stock alerts, and order management.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (`mongodb://127.0.0.1:27017/VisionVogue`) via Mongoose ORM
- **Frontend / Templating**: EJS (Embedded JavaScript), Vanilla CSS3, Bootstrap 5.3, FontAwesome 6
- **Animations & FX**: GSAP 3.12, ScrollTrigger, Custom SVG Generators
- **Authentication & Security**: bcryptjs, express-session, dotenv

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rohitsuryawanshi19/VisionVogue-E-Commerce-Website.git
   cd VisionVogue-E-Commerce-Website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment (`.env`)**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/VisionVogue
   SESSION_SECRET=visionvogue_luxury_eyewear_secret_2026
   ```

4. **Start the application**:
   ```bash
   node app.js
   ```

5. **Open in Browser**:
   Navigate to **[http://localhost:5000](http://localhost:5000)**

---

## 📂 Project Structure

```
VisionVogue/
├── config/             # Database connection & MongoDB setup
├── models/             # Mongoose schemas (User, Product, Order)
├── routes/             # Express route handlers (auth, cart, products, support, admin)
├── views/              # EJS template views
│   ├── admin/          # Admin dashboard view
│   ├── pages/          # Auth, Profile, Cart, Checkout, Virtual Try-On, Stores
│   ├── partials/       # Header navbar, Footer, Product card components
│   ├── products/       # Catalog & detail product pages
│   └── support/        # Order tracking, Returns, Prescription guides
├── public/             # Static assets (CSS, JS, SVG, image datasets)
│   ├── css/            # Custom luxury styling rules
│   ├── js/             # Hero slider, Main app, Virtual try-on scripts
│   └── images/         # Product collections, team photos, contact lens artwork
├── app.js              # Express application entry point
├── package.json        # Project metadata & dependencies
└── README.md           # Documentation
```

---

## 👤 Author & License

- **Developer**: Rohit Suryawanshi ([@Rohitsuryawanshi19](https://github.com/Rohitsuryawanshi19))
- **Repository**: [VisionVogue-E-Commerce-Website](https://github.com/Rohitsuryawanshi19/VisionVogue-E-Commerce-Website)
- **License**: MIT License

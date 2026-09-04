# Krishna Clothing Store | Premium Devotional E-Commerce Platform 🪶

A complete, high-end e-commerce web application dedicated to devotional Poshak dresses for Laddu Gopal, royal Krishna ethnic wear, Kundan crowns, shringar jewellery, and devotional accessories.

---

## 🌟 Key Features

- **Royal Sacred Aesthetics**: Deep Peacock Blue (`#071927`) and Divine Metallic Gold (`#d4af37`) design system with glassmorphism and subtle metallic gold gradients.
- **Laddu Gopal Size System**: Comprehensive size sizing guide (Sizes 0 to 6+) for idol measurement and poshak diameter matching.
- **Interactive Shopping Flow**:
  - Catalogue search with instant live search modal.
  - Multi-criteria filter sidebar (Category checkboxes, Max price range slider, Sorting).
  - Detailed product page with gallery image switcher, size selector, quantity modifier, and customer review tabs.
  - Interactive Shopping Cart with promo code applicator (`JANMASTHAMI20` -> 20% discount).
  - Multi-step checkout with instant address validation and payment options (UPI, Credit/Debit Cards, Cash on Delivery).
  - Interactive Order Tracking with dynamic visual status timeline.
- **Admin Portal**:
  - Executive dashboard with monthly revenue metrics, low stock alert flags, and recent order summary.
  - Product Inventory manager with add/edit product workflow.
  - Orders fulfillment manager & customer directory.
  - Active promo coupon manager & review moderation portal.

---

## 📁 Directory Structure

```
krishna-clothing-store/
│
├── index.html                     # Homepage (Hero Carousel, Bestsellers, Categories)
│
├── pages/                         # Core Customer Pages
│   ├── shop.html                  # Catalogue with filter sidebar & search
│   ├── product-details.html       # Detail view, size picker, review tabs
│   ├── collections.html           # Curated royal collections
│   ├── new-arrivals.html          # New seasonal launches
│   ├── festival-collection.html   # Janmashtami & Radhashtami festive special
│   ├── about.html                 # Brand story & Vrindavan craftsmanship
│   ├── contact.html               # Customer support & store location
│   ├── faq.html                   # Frequently Asked Questions accordion
│   ├── size-guide.html            # Laddu Gopal Size Chart
│   ├── wishlist.html              # Saved favorite items
│   ├── cart.html                  # Basket overview & discount codes
│   ├── checkout.html              # Shipping address & payment options
│   ├── order-tracking.html        # Order lookup by ID with visual timeline
│   │
│   └── account/                   # Customer Account Suite
│       ├── login.html
│       ├── register.html
│       ├── profile.html
│       ├── orders.html
│       └── order-details.html
│
├── assets/                        # Design System Assets
│   ├── css/
│   │   ├── style.css              # Master theme variables & base reset
│   │   ├── header.css             # Navigation & announcement bar
│   │   ├── footer.css             # Dark gold-trimmed footer
│   │   ├── home.css               # Hero banner & category cards
│   │   ├── products.css           # Catalogue filters & toolbar
│   │   ├── product-details.css    # Gallery zoom & tabs
│   │   ├── cart.css               # Cart table & summary box
│   │   ├── checkout.css           # Form & payment cards
│   │   └── responsive.css         # Responsive mobile breakpoints
│   │
│   ├── js/
│   │   ├── main.js                # Core state, toast notifications, currency formatter
│   │   ├── products.js            # Catalogue rendering & sorting
│   │   ├── product-details.js     # Detail view controller & size picker
│   │   ├── cart.js                # Cart management & coupon code logic
│   │   ├── wishlist.js            # Saved items manager
│   │   ├── search.js              # Instant autocomplete search
│   │   ├── filters.js             # Sidebar filter listeners
│   │   ├── checkout.js            # Checkout flow validator & order creation
│   │   ├── auth.js                # Authentication handler
│   │   └── order-tracking.js      # Visual timeline tracker
│   │
│   └── images/
│
├── components/                    # HTML Reusable Components
│   ├── header.html
│   ├── announcement-bar.html
│   ├── footer.html
│   ├── product-card.html
│   ├── category-card.html
│   ├── review-card.html
│   ├── newsletter.html
│   └── breadcrumbs.html
│
├── data/                          # JSON Mock Datasets
│   ├── products.json              # Detailed poshak & accessory inventory
│   ├── categories.json            # Category metadata
│   ├── reviews.json               # Customer reviews & ratings
│   └── orders.json                # Seed order tracking history
│
└── admin/                         # Store Administrative Portal
    ├── index.html                 # Metrics dashboard
    ├── products.html              # Product list table
    ├── add-product.html           # Product creation form
    ├── orders.html                # Orders fulfillment list
    ├── customers.html             # Customer database
    ├── inventory.html             # Low stock monitoring
    ├── coupons.html               # Discount codes manager
    └── reviews.html               # Review moderation
```

---

## 🚀 How to Run Locally

You can launch a simple local development web server using Python or Node `serve`:

```bash
# Option 1: Python HTTP Server (Built-in)
python -m http.server 8000

# Option 2: Node serve
npx -y serve .
```

Open `http://localhost:8000` in your web browser.

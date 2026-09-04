/* ==========================================================================
   KRISHNA VASTRA - CORE APPLICATION JAVASCRIPT & UTILITIES
   ========================================================================== */

// Global App State
window.KCS = {
  cart: JSON.parse(localStorage.getItem('kcs_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('kcs_wishlist')) || [],
  user: JSON.parse(localStorage.getItem('kcs_user')) || null,
  products: []
};

// Toast Notifications
window.showToast = function(message, type = 'pink') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>🛍️</span><span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Load Header, Announcement Bar & Footer Components
async function loadComponents() {
  const headerContainer = document.getElementById('site-header-container');
  const footerContainer = document.getElementById('site-footer-container');
  const announcementContainer = document.getElementById('announcement-bar-container');

  try {
    if (announcementContainer) {
      const res = await fetch('/components/announcement-bar.html');
      if (res.ok) announcementContainer.innerHTML = await res.text();
    }
    if (headerContainer) {
      const res = await fetch('/components/header.html');
      if (res.ok) {
        headerContainer.innerHTML = await res.text();
        initHeaderEvents();
        updateBadges();
      }
    }
    if (footerContainer) {
      const res = await fetch('/components/footer.html');
      if (res.ok) footerContainer.innerHTML = await res.text();
    }
  } catch (err) {
    console.error('Error loading components:', err);
  }
}

// Update Wishlist & Cart Badges
function updateBadges() {
  const cartBadge = document.getElementById('cart-badge-count');
  const wishlistBadge = document.getElementById('wishlist-badge-count');

  if (cartBadge) {
    const totalQty = window.KCS.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQty;
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = window.KCS.wishlist.length;
  }
}

// Cart Actions
window.addToCart = function(productId, size = null, qty = 1) {
  const product = window.KCS.products.find(p => p.id === productId);
  if (!product) {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        window.KCS.products = data;
        const p = data.find(item => item.id === productId);
        if (p) executeAddToCart(p, size, qty);
      });
  } else {
    executeAddToCart(product, size, qty);
  }
};

function executeAddToCart(product, size, qty) {
  const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
  
  const existingIndex = window.KCS.cart.findIndex(
    item => item.id === product.id && item.selectedSize === selectedSize
  );

  if (existingIndex > -1) {
    window.KCS.cart[existingIndex].quantity += qty;
  } else {
    window.KCS.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedSize: selectedSize,
      quantity: qty
    });
  }

  localStorage.setItem('kcs_cart', JSON.stringify(window.KCS.cart));
  updateBadges();
  window.showToast(`Added "${product.name}" (${selectedSize}) to cart!`);
}

// Wishlist Actions
window.toggleWishlist = function(productId) {
  const index = window.KCS.wishlist.indexOf(productId);
  if (index > -1) {
    window.KCS.wishlist.splice(index, 1);
    window.showToast('Removed item from Wishlist', 'info');
  } else {
    window.KCS.wishlist.push(productId);
    window.showToast('Saved to your Wishlist ❤️');
  }

  localStorage.setItem('kcs_wishlist', JSON.stringify(window.KCS.wishlist));
  updateBadges();
};

// Header Events & Search Modal
function initHeaderEvents() {
  const searchBtn = document.getElementById('search-trigger-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearchModal);
  }
}



// Scroll to Top Button
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-to-top-btn';
  btn.innerHTML = '↑';
  btn.title = 'Scroll to top';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Quick View Modal
window.openQuickView = function(productId) {
  const p = window.KCS.products.find(item => item.id === productId);
  if (!p) return;

  let modal = document.getElementById('quickview-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickview-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <button class="modal-close" onclick="document.getElementById('quickview-modal').classList.remove('active')">&times;</button>
      <img src="${p.images[0]}" style="width: 100%; height: 320px; object-fit: cover; border-radius: 8px;">
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">${p.name}</h3>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--brand-pink); margin-bottom: 12px;">₹${p.price} ${p.originalPrice ? `<span style="font-size: 0.9rem; color: var(--text-muted); text-decoration: line-through;">₹${p.originalPrice}</span>` : ''}</div>
        <p style="font-size: 0.85rem; color: #555; margin-bottom: 16px;">${p.description}</p>
        <button class="btn btn-pink" style="width: 100%;" onclick="window.addToCart('${p.id}'); document.getElementById('quickview-modal').classList.remove('active');">🛒 Add to Cart</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

// Header Dropdown Menu Initialization
function initHeaderEvents() {
  const menuBtn = document.getElementById('all-categories-menu-btn');
  const dropdownMenu = document.getElementById('all-categories-dropdown-menu');

  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== menuBtn) {
        dropdownMenu.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  initScrollToTop();
});

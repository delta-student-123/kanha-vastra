/* Wishlist Page Script */

async function initWishlistPage() {
  const container = document.getElementById('wishlist-grid');
  if (!container) return;

  const wishlistIds = window.KCS.wishlist;

  if (wishlistIds.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">🤍</div>
        <h2 class="font-heading" style="color: var(--primary-main);">Your Wishlist is Empty</h2>
        <p style="color: var(--text-muted); margin: 12px 0 24px 0;">Save your favorite poshak, crowns, and accessories for future purchases.</p>
        <a href="/pages/shop.html" class="btn btn-gold btn-lg">Explore Catalogue</a>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch('/data/products.json');
    const allProducts = await res.json();
    const wishlistedProducts = allProducts.filter(p => wishlistIds.includes(p.id));

    container.innerHTML = wishlistedProducts.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrapper">
          <img src="${p.images[0]}" alt="${p.name}">
          <button class="wishlist-btn active" onclick="removeFromWishlistPage('${p.id}')" title="Remove from Wishlist">
            &times;
          </button>
        </div>
        <div class="product-body">
          <div class="product-category">${p.categoryName}</div>
          <a href="/pages/product-details.html?id=${p.id}" class="product-title">${p.name}</a>
          <div class="product-price-row">
            <span class="price-current">₹${p.price}</span>
          </div>
          <button class="btn-add-cart" onclick="window.addToCart('${p.id}')">🛒 Move to Cart</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error rendering wishlist:', err);
  }
}

window.removeFromWishlistPage = function(productId) {
  window.toggleWishlist(productId);
  initWishlistPage();
};

document.addEventListener('DOMContentLoaded', initWishlistPage);

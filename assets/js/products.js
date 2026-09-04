/* Products Catalogue Script */

let allProducts = [];
let activeCategory = 'all';

async function initShopPage() {
  const grid = document.getElementById('shop-products-grid');
  if (!grid) return;

  try {
    const res = await fetch('/data/products.json');
    allProducts = await res.json();
    window.KCS.products = allProducts;

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      activeCategory = catParam;
    }

    renderShopProducts();
  } catch (err) {
    console.error('Failed to load shop products:', err);
  }
}

function renderShopProducts() {
  const grid = document.getElementById('shop-products-grid');
  const countDisplay = document.getElementById('shop-results-count');
  if (!grid) return;

  let filtered = allProducts.filter(p => {
    if (!activeCategory || activeCategory === 'all') return true;
    const cat = (p.category || '').toLowerCase();
    const target = activeCategory.toLowerCase();
    
    if (cat === target) return true;
    if (target === 'accessories') return ['accessories', 'bansuri', 'mojdi', 'mor-pankh-kalagi', 'ornaments', 'jewellery'].includes(cat);
    if (target === 'dresses') return ['poshak', 'dresses', 'laddu-gopal', 'krishna-dresses', 'festival'].includes(cat);
    if (target === 'ornaments') return ['ornaments', 'jewellery'].includes(cat);
    if (target === 'laddu-gopal') return ['laddu-gopal', 'poshak', 'krishna-dresses', 'festival'].includes(cat);
    
    return cat.includes(target) || target.includes(cat);
  });

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="color: var(--text-dark);">No products found in this category</h3>
        <p style="color: var(--text-muted); margin-top: 8px;">Explore our full shop catalogue.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrapper">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="sale-tag">${p.badge}</span>` : ''}
        <button class="wishlist-heart-btn" onclick="window.toggleWishlist('${p.id}')">♥</button>
        <div class="quick-view-bar" onclick="window.openQuickView('${p.id}')">👁️ Quick View</div>
      </div>
      <div class="product-body">
        <a href="/pages/product-details.html?id=${p.id}" class="product-title">${p.name}</a>
        <div class="product-price-row">
          ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice}.00</span>` : ''}
          <span class="price-current">₹${p.price}.00</span>
        </div>
        <button class="btn-add-cart-full" onclick="window.addToCart('${p.id}')">🛒 ADD TO CART</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initShopPage);

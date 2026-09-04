/* Product Details Page Script */

let currentProduct = null;
let selectedSize = '2';
let currentQty = 1;

async function initProductDetailPage() {
  const container = document.getElementById('product-details-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'KV-302'; // Default to Heavy Pink Diamond Work Poshak

  try {
    const res = await fetch('/data/products.json');
    const products = await res.json();
    window.KCS.products = products;
    currentProduct = products.find(p => p.id === productId) || products[1];

    selectedSize = currentProduct.sizes ? currentProduct.sizes[2] || currentProduct.sizes[0] : '2';

    renderProductDetails();
    renderRelatedProducts(products);
  } catch (err) {
    console.error('Error loading product detail:', err);
  }
}

function renderProductDetails() {
  const container = document.getElementById('product-details-content');
  if (!container) return;

  const p = currentProduct;
  const isWishlisted = window.KCS.wishlist.includes(p.id);

  // Gallery thumbnails from actual product images
  const galleryImages = (p.images && p.images.length > 0) ? p.images : ['/assets/images/cat_poshak.jpg'];

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px;">
      
      <!-- Gallery Column -->
      <div>
        <div style="width: 100%; height: 460px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-light); margin-bottom: 16px;">
          <img id="detail-main-img" src="${galleryImages[0]}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover; cursor: zoom-in;">
        </div>

        <div style="display: flex; gap: 12px;">
          ${galleryImages.map((img, idx) => `
            <div class="thumb-box ${idx === 0 ? 'active' : ''}" onclick="switchDetailImage('${img}', this)" style="width: 80px; height: 80px; border-radius: 4px; overflow: hidden; border: 2px solid ${idx === 0 ? 'var(--brand-magenta)' : 'var(--border-light)'}; cursor: pointer;">
              <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Detail Info Column -->
      <div>
        <h1 style="font-family: var(--font-ui); font-size: 2rem; font-weight: 800; color: var(--primary-black); margin-bottom: 12px;">${p.name}</h1>
        
        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; margin-bottom: 16px;">
          <span style="color: #f59e0b;">★★★★★</span>
          <strong>${p.rating}</strong>
          <span style="color: var(--text-muted);">(${p.reviewsCount} Reviews)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 20px; padding: 16px 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
          <span style="font-size: 2.2rem; font-weight: 800; color: var(--brand-magenta);">₹${p.price}</span>
          ${p.originalPrice ? `<span style="font-size: 1.1rem; color: var(--price-original); text-decoration: line-through;">₹${p.originalPrice}</span>` : ''}
          ${p.discount ? `<span style="background: #ffe8e0; color: #d32f2f; padding: 4px 10px; font-weight: 800; border-radius: 4px; font-size: 0.85rem;">${p.discount}% OFF</span>` : ''}
        </div>

        <!-- Size Selector -->
        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="font-size: 0.9rem;">Size:</strong>
            <a href="/pages/size-guide.html" target="_blank" style="font-size: 0.85rem; color: var(--brand-magenta); text-decoration: underline; font-weight: 600;">Not sure about the size? View Size Guide</a>
          </div>
          <div style="display: flex; gap: 10px;">
            ${['0', '1', '2', '3', '4', '5'].map(sz => `
              <button class="size-chip-btn ${selectedSize === sz ? 'selected' : ''}" onclick="selectDetailSize('${sz}', this)" style="padding: 10px 20px; border: 1.5px solid ${selectedSize === sz ? 'var(--brand-magenta)' : 'var(--border-light)'}; background: ${selectedSize === sz ? 'var(--brand-magenta)' : '#fff'}; color: ${selectedSize === sz ? '#fff' : '#000'}; font-weight: 700; border-radius: 4px;">
                ${sz}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Quantity Stepper -->
        <div style="margin-bottom: 24px;">
          <strong style="font-size: 0.9rem; display: block; margin-bottom: 8px;">Quantity:</strong>
          <div style="display: inline-flex; border: 1px solid var(--border-light); border-radius: 4px;">
            <button onclick="updateDetailQty(-1)" style="width: 40px; height: 40px; background: #f3f3f3; font-size: 1.2rem; font-weight: 700;">-</button>
            <input type="text" id="detail-qty-input" value="1" readonly style="width: 50px; text-align: center; font-weight: 700; border: none;">
            <button onclick="updateDetailQty(1)" style="width: 40px; height: 40px; background: #f3f3f3; font-size: 1.2rem; font-weight: 700;">+</button>
          </div>
        </div>

        <!-- Buttons -->
        <div style="display: flex; gap: 14px; margin-bottom: 24px;">
          <button class="btn btn-magenta btn-lg" style="flex: 1;" onclick="addCurrentProductToCart()">[ ADD TO CART ]</button>
          <button class="btn btn-black btn-lg" style="flex: 1;" onclick="buyNowCurrentProduct()">[ BUY NOW ]</button>
        </div>

        <button onclick="window.toggleWishlist('${p.id}')" style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 24px;">
          <span style="color: var(--brand-magenta);">${isWishlisted ? '♥' : '♡'}</span> ${isWishlisted ? 'In Your Wishlist' : 'Add to Wishlist'}
        </button>

        <!-- Trust Badges -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid var(--border-light); padding-top: 20px; font-size: 0.85rem; font-weight: 600; color: #2e7d32;">
          <div>✓ Premium Quality</div>
          <div>✓ Secure Packaging</div>
          <div>✓ Fast Delivery</div>
          <div>✓ Easy Returns</div>
        </div>

      </div>
    </div>

    <!-- Expandable Information Tabs -->
    <div style="background: #fff; border: 1px solid var(--border-light); border-radius: 4px; padding: 28px;">
      <div style="display: flex; gap: 20px; border-bottom: 2px solid var(--border-light); margin-bottom: 24px; overflow-x: auto;">
        <button class="tab-btn active" onclick="switchTab('tab-desc', this)">Description</button>
        <button class="tab-btn" onclick="switchTab('tab-specs', this)">Specifications</button>
        <button class="tab-btn" onclick="switchTab('tab-size', this)">Size Guide</button>
        <button class="tab-btn" onclick="switchTab('tab-shipping', this)">Shipping Information</button>
        <button class="tab-btn" onclick="switchTab('tab-returns', this)">Returns</button>
        <button class="tab-btn" onclick="switchTab('tab-reviews', this)">Reviews (${p.reviewsCount})</button>
      </div>

      <div id="tab-desc" class="tab-content active">
        <p style="line-height: 1.7; color: #444;">${p.description}</p>
        <h4 style="margin: 16px 0 8px 0; color: var(--primary-black);">Key Features:</h4>
        <ul style="list-style: disc; margin-left: 20px; color: #444;">
          ${p.features ? p.features.map(f => `<li>${f}</li>`).join('') : '<li>Handcrafted traditional craftsmanship</li>'}
        </ul>
      </div>

      <div id="tab-specs" class="tab-content">
        <p><strong>Fabric:</strong> Pure Velvet & Satin</p>
        <p><strong>Craftsmanship:</strong> Diamond Stud & Zardozi Embroidered</p>
        <p><strong>Origin:</strong> Vrindavan, Uttar Pradesh</p>
      </div>

      <div id="tab-size" class="tab-content">
        <p>Refer to our measurement chart: Size 0 (4" poshak flare), Size 1 (5" flare), Size 2 (6" flare), Size 3 (7" flare), Size 4 (8" flare), Size 5 (9" flare).</p>
      </div>

      <div id="tab-shipping" class="tab-content">
        <p>Free delivery across India on orders above ₹999. Standard delivery takes 3-5 business days.</p>
      </div>

      <div id="tab-returns" class="tab-content">
        <p>Easy 7-day return policy. Contact support@krishnavastra.com for hassle-free pick-up.</p>
      </div>

      <div id="tab-reviews" class="tab-content">
        <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Customer Ratings (★ ${p.rating})</div>
        <p style="color: #555;">"Beautiful dress and excellent finishing. Krishna Ji looks absolutely adorable." — Radhika S. (Verified Purchase)</p>
      </div>
    </div>
  `;
}

window.switchDetailImage = function(imgSrc, el) {
  document.getElementById('detail-main-img').src = imgSrc;
  document.querySelectorAll('.thumb-box').forEach(t => t.style.borderColor = 'var(--border-light)');
  el.style.borderColor = 'var(--brand-magenta)';
};

window.selectDetailSize = function(size, el) {
  selectedSize = size;
  document.querySelectorAll('.size-chip-btn').forEach(b => {
    b.style.background = '#fff';
    b.style.color = '#000';
    b.style.borderColor = 'var(--border-light)';
  });
  el.style.background = 'var(--brand-magenta)';
  el.style.color = '#fff';
  el.style.borderColor = 'var(--brand-magenta)';
};

window.updateDetailQty = function(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('detail-qty-input').value = currentQty;
};

window.addCurrentProductToCart = function() {
  if (currentProduct) {
    window.addToCart(currentProduct.id, `Size ${selectedSize}`, currentQty);
  }
};

window.buyNowCurrentProduct = function() {
  if (currentProduct) {
    window.addToCart(currentProduct.id, `Size ${selectedSize}`, currentQty);
    window.location.href = '/pages/cart.html';
  }
};

window.switchTab = function(tabId, btnEl) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btnEl.classList.add('active');
};

function renderRelatedProducts(allProducts) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  const related = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 4);
  container.innerHTML = related.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrapper">
        <img src="${p.images[0]}" alt="${p.name}">
      </div>
      <div class="product-body">
        <a href="/pages/product-details.html?id=${p.id}" class="product-title">${p.name}</a>
        <div class="product-price-row"><span class="price-current">₹${p.price}</span></div>
        <button class="btn-add-cart" onclick="window.addToCart('${p.id}')">🛒 Add to Cart</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initProductDetailPage);

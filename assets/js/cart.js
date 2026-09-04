/* Shopping Cart Page Script */

let appliedDiscount = 0;

function renderCartPage() {
  const container = document.getElementById('cart-page-content');
  if (!container) return;

  const cart = window.KCS.cart;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <div style="font-size: 4rem; color: var(--brand-magenta); margin-bottom: 16px;">🛍️</div>
        <h2 style="font-family: var(--font-ui); font-size: 1.8rem; font-weight: 800;">Your Shopping Bag is Empty</h2>
        <p style="color: var(--text-muted); margin: 12px 0 24px 0;">Explore our beautiful collection of traditional Krishna and Laddu Gopal clothing.</p>
        <a href="/pages/shop.html" class="btn btn-magenta btn-lg">[ CONTINUE SHOPPING ]</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmt = Math.round((subtotal * appliedDiscount) / 100);
  const shipping = subtotal >= 999 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmt + shipping);

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 360px; gap: 32px;">
      
      <!-- Cart Table -->
      <div style="background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 24px;">
        <h2 style="font-family: var(--font-ui); font-size: 1.4rem; font-weight: 800; margin-bottom: 20px; border-bottom: 2px solid var(--primary-black); padding-bottom: 10px;">Shopping Bag (${cart.length} items)</h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-light); text-align: left; color: var(--text-muted);">
              <th style="padding: 10px 0;">Product</th>
              <th style="padding: 10px;">Size</th>
              <th style="padding: 10px;">Price</th>
              <th style="padding: 10px;">Quantity</th>
              <th style="padding: 10px;">Total</th>
              <th style="padding: 10px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map((item, idx) => `
              <tr style="border-bottom: 1px solid var(--border-light);">
                <td style="padding: 16px 0;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${item.image}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px;">
                    <div>
                      <a href="/pages/product-details.html?id=${item.id}" style="font-weight: 700; color: var(--text-main); display: block;">${item.name}</a>
                      <button onclick="window.toggleWishlist('${item.id}')" style="font-size: 0.78rem; color: var(--brand-magenta); margin-top: 4px;">♡ Move to Wishlist</button>
                    </div>
                  </div>
                </td>
                <td style="padding: 16px; font-weight: 600;">${item.selectedSize}</td>
                <td style="padding: 16px; font-weight: 700;">₹${item.price}</td>
                <td style="padding: 16px;">
                  <div style="display: flex; align-items: center; border: 1px solid var(--border-light); border-radius: 4px; width: fit-content;">
                    <button onclick="updateCartItemQty(${idx}, -1)" style="width: 28px; height: 28px; background: #f0f0f0;">-</button>
                    <input type="text" value="${item.quantity}" readonly style="width: 32px; text-align: center; font-weight: 700; border: none;">
                    <button onclick="updateCartItemQty(${idx}, 1)" style="width: 28px; height: 28px; background: #f0f0f0;">+</button>
                  </div>
                </td>
                <td style="padding: 16px; font-weight: 800; color: var(--brand-magenta);">₹${item.price * item.quantity}</td>
                <td style="padding: 16px;">
                  <button onclick="removeCartItem(${idx})" style="color: #d32f2f; font-weight: 700; font-size: 1.2rem;" title="Remove item">&times;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 24px;">
          <a href="/pages/shop.html" class="btn btn-outline-dark">[ CONTINUE SHOPPING ]</a>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 24px; height: fit-content;">
        <h3 style="font-family: var(--font-ui); font-size: 1.2rem; font-weight: 800; border-bottom: 2px solid var(--primary-black); padding-bottom: 10px; margin-bottom: 20px;">Order Summary</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem;">
          <span>Subtotal</span>
          <span>₹${subtotal}</span>
        </div>

        ${appliedDiscount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; color: #2e7d32;">
            <span>Discount (${appliedDiscount}%)</span>
            <span>-₹${discountAmt}</span>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.95rem;">
          <span>Shipping Fee</span>
          <span>${shipping === 0 ? '<strong style="color: #2e7d32;">FREE</strong>' : '₹' + shipping}</span>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          <input type="text" id="coupon-input" placeholder="Promo Code (e.g. FESTIVE10)" style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 4px; font-size: 0.85rem; text-transform: uppercase;">
          <button class="btn btn-black btn-sm" onclick="applyCartCoupon()">Apply</button>
        </div>

        <div style="display: flex; justify-content: space-between; border-top: 2px dashed var(--border-light); padding-top: 16px; font-weight: 800; font-size: 1.25rem; color: var(--primary-black); margin-bottom: 24px;">
          <span>Total Amount</span>
          <span style="color: var(--brand-magenta);">₹${grandTotal}</span>
        </div>

        <a href="/pages/checkout.html" class="btn btn-magenta" style="width: 100%; text-align: center; padding: 14px;">
          [ PROCEED TO CHECKOUT ]
        </a>
      </div>

    </div>
  `;
}

window.updateCartItemQty = function(idx, delta) {
  if (window.KCS.cart[idx]) {
    window.KCS.cart[idx].quantity += delta;
    if (window.KCS.cart[idx].quantity <= 0) {
      window.KCS.cart.splice(idx, 1);
    }
    localStorage.setItem('kcs_cart', JSON.stringify(window.KCS.cart));
    renderCartPage();
    if (typeof updateBadges === 'function') updateBadges();
  }
};

window.removeCartItem = function(idx) {
  window.KCS.cart.splice(idx, 1);
  localStorage.setItem('kcs_cart', JSON.stringify(window.KCS.cart));
  renderCartPage();
  if (typeof updateBadges === 'function') updateBadges();
  window.showToast('Item removed from cart', 'info');
};

window.applyCartCoupon = function() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'FESTIVE10' || code === 'JANMASTHAMI20') {
    appliedDiscount = 10;
    window.showToast('Promo code applied! 10% OFF');
  } else {
    window.showToast('Invalid promo code', 'info');
    return;
  }
  renderCartPage();
};

document.addEventListener('DOMContentLoaded', renderCartPage);

/* Checkout Handler */

let selectedPayment = 'upi';

function initCheckoutPage() {
  const summaryItems = document.getElementById('checkout-items-list');
  const totalAmountEl = document.getElementById('checkout-total-val');
  if (!summaryItems) return;

  const cart = window.KCS.cart;
  if (cart.length === 0) {
    window.location.href = '/pages/cart.html';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  summaryItems.innerHTML = cart.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light); font-size: 0.78rem;">
      <div>
        <strong style="color: var(--primary-main);">${item.name}</strong> (${item.selectedSize})
        <div style="color: var(--text-muted); font-size: 0.72rem;">Qty: ${item.quantity} &times; ₹${item.price}</div>
      </div>
      <span style="font-weight: 700;">₹${item.price * item.quantity}</span>
    </div>
  `).join('');

  if (totalAmountEl) {
    totalAmountEl.textContent = `₹${total}`;
  }
}

window.selectPaymentOption = function(option, el) {
  selectedPayment = option;
  document.querySelectorAll('.payment-card-option').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
};

window.placeOrder = function(e) {
  e.preventDefault();

  const name = document.getElementById('chk-name').value;
  const email = document.getElementById('chk-email').value;
  const phone = document.getElementById('chk-phone').value;
  const address = document.getElementById('chk-address').value;
  const city = document.getElementById('chk-city').value;
  const pincode = document.getElementById('chk-pincode').value;

  if (!name || !phone || !address || !city || !pincode) {
    window.showToast('Please complete all required shipping fields', 'crimson');
    return;
  }

  const newOrderId = 'KCS-' + Math.floor(10000 + Math.random() * 90000);
  const cart = window.KCS.cart;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;

  const newOrder = {
    orderId: newOrderId,
    customer: { name, email, phone, address, city, pincode },
    date: new Date().toLocaleDateString('en-GB'),
    items: cart,
    subtotal: subtotal,
    total: subtotal + shipping,
    paymentMethod: selectedPayment.toUpperCase(),
    orderStatus: 'Order Placed',
    trackingTimeline: [
      { status: 'Order Placed', time: 'Just now', completed: true },
      { status: 'Packed & Quality Checked', time: 'Pending', completed: false },
      { status: 'Shipped', time: 'Pending', completed: false },
      { status: 'Out for Delivery', time: 'Pending', completed: false },
      { status: 'Delivered', time: 'Pending', completed: false }
    ]
  };

  // Save to localStorage orders list
  const existingOrders = JSON.parse(localStorage.getItem('kcs_orders')) || [];
  existingOrders.unshift(newOrder);
  localStorage.setItem('kcs_orders', JSON.stringify(existingOrders));

  // Clear Cart
  window.KCS.cart = [];
  localStorage.removeItem('kcs_cart');

  // Show Success Modal
  showOrderSuccessModal(newOrder);
};

function showOrderSuccessModal(order) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal-content" style="text-align: center; max-width: 520px; border: 2px solid var(--gold-primary);">
      <div style="font-size: 3.5rem; margin-bottom: 12px;">🎉</div>
      <h2 class="font-heading" style="color: var(--primary-main);">Jai Shree Krishna! Order Placed</h2>
      <p style="color: var(--text-muted); margin: 8px 0 20px 0;">Thank you for your order, <strong>${order.customer.name}</strong>!</p>
      
      <div style="background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); text-align: left; margin-bottom: 20px; font-size: 0.9rem;">
        <div><strong>Order ID:</strong> <span style="color: var(--gold-dark);">${order.orderId}</span></div>
        <div><strong>Amount Paid:</strong> ₹${order.total} (${order.paymentMethod})</div>
        <div><strong>Delivery Address:</strong> ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <a href="/pages/order-tracking.html?orderId=${order.orderId}" class="btn btn-gold">
          📍 Track Order Status
        </a>
        <a href="/index.html" class="btn btn-outline">Return to Home</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', initCheckoutPage);

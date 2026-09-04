/* Order Tracking Script */

async function initTrackingPage() {
  const container = document.getElementById('tracking-result-box');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  if (orderId) {
    document.getElementById('track-order-id-input').value = orderId;
    trackOrderById(orderId);
  }
}

window.handleTrackSubmit = function(e) {
  e.preventDefault();
  const orderId = document.getElementById('track-order-id-input').value.trim();
  if (orderId) {
    trackOrderById(orderId);
  }
};

async function trackOrderById(orderId) {
  const container = document.getElementById('tracking-result-box');
  if (!container) return;

  const localOrders = JSON.parse(localStorage.getItem('kcs_orders')) || [];
  let foundOrder = localOrders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());

  if (!foundOrder) {
    foundOrder = {
      orderId: orderId.toUpperCase(),
      date: new Date().toLocaleDateString('en-GB'),
      items: [{ name: "Heavy Pink Diamond Work Poshak", total: 424 }],
      total: 424,
      orderStatus: "Shipped",
      trackingTimeline: [
        { status: "Order Placed", completed: true, time: "Yesterday, 10:30 AM" },
        { status: "Order Confirmed", completed: true, time: "Yesterday, 11:00 AM" },
        { status: "Packed", completed: true, time: "Yesterday, 04:15 PM" },
        { status: "Shipped", completed: true, time: "Today, 08:00 AM" },
        { status: "Out for Delivery", completed: false, time: "Expected Tomorrow" },
        { status: "Delivered", completed: false, time: "Pending" }
      ]
    };
  }

  container.innerHTML = `
    <div style="background: #fff; border: 1px solid var(--border-light); border-radius: 4px; padding: 32px; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 32px;">
        <div>
          <h3 style="font-family: var(--font-ui); font-size: 1.3rem; font-weight: 800;">Order #${foundOrder.orderId}</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Placed on ${foundOrder.date}</span>
        </div>
        <span style="background: #e8f5e9; color: #2e7d32; padding: 6px 14px; font-weight: 800; border-radius: 4px; font-size: 0.85rem;">
          ${foundOrder.orderStatus}
        </span>
      </div>

      <!-- Timeline Stepper -->
      <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 40px;">
        <div style="position: absolute; top: 18px; left: 0; right: 0; height: 3px; background: var(--border-light); z-index: 1;"></div>
        
        ${foundOrder.trackingTimeline.map((step, idx) => `
          <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${step.completed ? 'var(--brand-magenta)' : '#e5e5e5'}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              ${step.completed ? '✓' : idx + 1}
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; margin-top: 10px; color: var(--primary-black);">${step.status}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${step.time}</div>
          </div>
        `).join('')}
      </div>

      <div style="background: var(--secondary-gray); padding: 20px; border-radius: 4px; font-size: 0.9rem;">
        <strong>Total Paid: ₹${foundOrder.total}</strong>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initTrackingPage);

document.addEventListener("DOMContentLoaded", () => {

  const checkoutContainer = document.getElementById("checkoutItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    checkoutContainer.innerHTML = `
      <div style="padding:40px;text-align:center">
        <h2>Your cart is empty</h2>
        <p>Add items to continue shopping.</p>
      </div>
    `;
    updateCartBadge();
    return;
  }

  function renderCheckout() {
    checkoutContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      total += item.price * item.qty;

      checkoutContainer.innerHTML += `
        <div class="checkout-item">
          <img src="${item.image}">
          <div class="item-info">
            <h4>${item.title}</h4>
            <p>₹ ${item.price}</p>

            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
            </div>
          </div>
        </div>
      `;
    });

    subtotalEl.textContent = `₹ ${total}`;
    totalEl.textContent = `₹ ${total}`;
    updateCartBadge();
  }

  window.changeQty = function (i, delta) {
    cart[i].qty += delta;

    if (cart[i].qty <= 0) {
      cart.splice(i, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
  };

  renderCheckout();
  updateCartBadge();
});

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = count;
  badge.classList.toggle("show", count > 0);
}

function goToCart() {
  window.location.href = "checkout.html";
}

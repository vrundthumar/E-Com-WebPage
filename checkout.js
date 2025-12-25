
document.addEventListener("DOMContentLoaded", () => {
  const successModal = document.getElementById("orderSuccess");

  if (localStorage.getItem("orderJustPlaced") === "true") {
    if (successModal) {
      successModal.style.display = "flex";
    }

    // 🔥 VERY IMPORTANT: remove flag immediately
    localStorage.removeItem("orderJustPlaced");
  }
});


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

function isLoggedIn(){
  return localStorage.getItem("loggedIn") === "true";
}


const placeOrderBtn = document.querySelector(".place-order");

placeOrderBtn.onclick = () => {

  if(!isLoggedIn()){
    // show login first
    document.getElementById("loginModal").classList.add("show");
    return;
  }

  // logged in → show delivery form
  document.getElementById("deliveryModal").classList.add("show");
};


document.getElementById("deliveryForm").onsubmit = (e) => {
  e.preventDefault();

  const inputs = e.target.querySelectorAll("input, textarea");

  const deliveryInfo = {
    name: inputs[0].value,
    phone: inputs[1].value,
    address: inputs[2].value,
    pincode: inputs[3].value,
    note: inputs[4].value
  };

  // Save delivery details
  localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));

  // Save order
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  localStorage.setItem("lastOrder", JSON.stringify(cart));

  // Clear cart
  localStorage.removeItem("cart");

  // Redirect
  window.location.href = "order-success.html";
};


const paymentModal = document.getElementById("paymentModal");
const paymentDetails = document.getElementById("paymentDetails");

/* Show payment modal after delivery form */
document.getElementById("paymentForm").onsubmit = (e) => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const delivery = JSON.parse(localStorage.getItem("deliveryInfo"));
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  const order = {
    id: "VLN" + Math.floor(Math.random() * 1000000),
    items: cart,
    delivery,
    paymentMethod,
    status: "Order Placed",
    timeline: [
      { label: "Order Placed", time: Date.now() }
    ]
  };

  saveOrder(order);
  localStorage.removeItem("cart");

  showOrderSuccess(order.id);
};

/* Change payment fields dynamically */
document.getElementById("paymentForm").onchange = (e) => {
  const method = e.target.value;
  paymentDetails.innerHTML = "";

  if(method === "upi"){
    paymentDetails.innerHTML = `<input placeholder="UPI ID" required>`;
  }

  if(method === "card"){
    paymentDetails.innerHTML = `
      <input placeholder="Card Number" required>
      <input placeholder="Expiry MM/YY" required>
      <input placeholder="CVV" required>
    `;
  }

  if(method === "netbanking"){
    paymentDetails.innerHTML = `<input placeholder="Bank Name" required>`;
  }

  if(method === "cod"){
    paymentDetails.innerHTML = `<p>Pay when product is delivered.</p>`;
  }
};

/* Final order placement */
document.getElementById("paymentForm").onsubmit = (e) => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const delivery = JSON.parse(localStorage.getItem("deliveryInfo"));

  const orderId = "VLN" + Date.now();

  const order = {
    orderId,
    cart,
    delivery,
    payment: document.querySelector('input[name="payment"]:checked').value,
    status: "Order Placed",
    date: new Date().toLocaleString()
  };

  localStorage.setItem("currentOrder", JSON.stringify(order));
  localStorage.removeItem("cart");

  window.location.href = "order-success.html";
};


function isLoggedIn(){
  return localStorage.getItem("auth_user") !== null;
}

function loginUser(email){
  localStorage.setItem("auth_user", JSON.stringify({
    email,
    loginTime: Date.now()
  }));
}

function logoutUser(){
  localStorage.removeItem("auth_user");
}


function showOrderSuccess(orderId){
  localStorage.setItem("lastOrderId", orderId);
  document.getElementById("orderSuccess").style.display = "flex";
}

function goToTrack(){
  window.location.href = "track-order.html";
}

// AFTER saving order successfully
localStorage.setItem("orderJustPlaced", "true");

// redirect
window.location.href = "checkout.html";

setTimeout(() => {
  const modal = document.getElementById("orderSuccess");
  if (modal) modal.style.display = "none";
}, 2500);

// after saving order
localStorage.setItem("orderJustPlaced", "1");

// redirect ONCE
window.location.href = "/checkout.html";

(function () {
  // guard to prevent multiple executions
  if (window.__orderSuccessHandled) return;
  window.__orderSuccessHandled = true;

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("orderSuccess");

    if (!modal) return;

    if (localStorage.getItem("orderJustPlaced") === "1") {
      // show once
      modal.style.display = "flex";

      // remove flag immediately
      localStorage.removeItem("orderJustPlaced");

      // auto hide after animation
      setTimeout(() => {
        modal.style.display = "none";
      }, 2200);
    }
  });
})();


document.getElementById("paymentForm").onsubmit = (e) => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0) return;

  const delivery = JSON.parse(localStorage.getItem("deliveryInfo"));
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  const order = {
    id: "VLN" + Date.now(),
    items: cart,
    delivery,
    paymentMethod,
    status: "Order Placed",
    createdAt: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // 🔥 IMPORTANT
  localStorage.removeItem("cart");
  localStorage.removeItem("deliveryInfo");

  // success flag (one time)
  localStorage.setItem("orderJustPlaced", "1");

  window.location.href = "/checkout.html";
};


function isLoggedIn(){
  return !!localStorage.getItem("auth_user");
}

function logoutUser(){
  localStorage.removeItem("auth_user");
  updateAuthUI();
}

function loginUser(email){
  localStorage.setItem("auth_user", JSON.stringify({
    email,
    loginTime: Date.now()
  }));

  updateAuthUI();
}

function updateAuthUI(){
  const logged = isLoggedIn();
  const userBtn = document.getElementById("userBtn");

  if(userBtn){
    userBtn.style.display = logged ? "flex" : "none";
  }
}

updateAuthUI();

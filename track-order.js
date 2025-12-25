const orders = JSON.parse(localStorage.getItem("orders")) || [];
const lastOrderId = localStorage.getItem("lastOrderId");

const order = orders.find(o => o.id === lastOrderId);

const orderCard = document.getElementById("orderCard");
const timeline = document.getElementById("timeline");

if (!order) {
  orderCard.innerHTML = "<p>No order found.</p>";
} else {

  orderCard.innerHTML = `
    <h3>Order #${order.id}</h3>
    <p><strong>Name:</strong> ${order.delivery.name}</p>
    <p><strong>Address:</strong> ${order.delivery.address}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
  `;

  const steps = [
    "Order Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  let currentStep = 0;

  function renderTimeline() {
    timeline.innerHTML = "";

    steps.forEach((step, index) => {
      timeline.innerHTML += `
        <div class="step ${index <= currentStep ? "active" : ""}">
          <span class="dot"></span>
          <p>${step}</p>
        </div>
      `;
    });
  }

  renderTimeline();

  // FAKE AUTO PROGRESSION
  const interval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderTimeline();
    } else {
      clearInterval(interval);
    }
  }, 2000);
}

function goHome() {
  window.location.href = "/";
}

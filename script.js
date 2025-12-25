const products = [
  {
    Image: "./assets/1.JPG",
    title: "Slim Cotton Stripes Light Blue Shirt",
    price: 1199,
    gender: "male",
    Type: "Shirt",
  },

   {
    Image: "./assets/7.JPG",
    title: "Slim Fit Cotton  Knit Polo T-shirt",
    price: 1499,
    gender: "male",
    Type: "T-Shirt",
  },

   {
    Image: "./assets/2.JPG",
    title: "Oversized Fit Textured Beige Shirt",
    price: 999,
    gender: "male",
    Type: "Shirt",
  },

   {
    Image: "./assets/16.JPG",
    title: "Baggy Fit Stretch Washed Jeans",
    price: 1899,
    gender: "male",
    Type: "Jeans",
  },

   {
    Image: "./assets/12.JPG",
    title: "Regular Fit Strech Black Trousers",
    price: 1799,
    gender: "male",
    Type: "Trousers",
  },

   {
    Image: "./assets/3.JPG",
    title: "Oversized Textured Grey Shirt",
    price: 999,
    gender: "male",
    Type: "Shirt",
  },

   {
    Image: "./assets/17.JPG",
    title: "Relaxed Fit Distredded Blue Jeans",
    price: 1899,
    gender: "male",
    Type: "Jeans",
  },

   {
    Image: "./assets/25.JPG",
    title: "Regular Fit Strech Techincal Shorts",
    price: 1299,
    gender: "male",
    Type: "Shorts",
  },

   {
    Image: "./assets/4.JPG",
    title: "Slim Cotton Textured Beige Shirt",
    price: 1299,
    gender: "male",
    Type: "Shirt",
  },

   {
    Image: "./assets/26.JPG",
    title: "Textured Double Pocket jacket",
    price: 1399,
    gender: "male",
    Type: "Jacket",
  },

   {
    Image: "./assets/24.JPG",
    title: "Regular Strech Light Blue Shorts",
    price: 1199,
    gender: "male",
    Type: "Shorts",
  },

   {
    Image: "./assets/29.JPG",
    title: "Regular Fit Off-White Jacket",
    price: 1899,
    gender: "male",
    Type: "Jacket",
  },

   {
    Image: "./assets/5.JPG",
    title: "Regular Linen Blend Checks Shirt",
    price: 1199,
    gender: "male",
    Type: "Shirt",
  },

   {
    Image: "./assets/10.JPG",
    title: "Regular Fit colorado T-Shirt",
    price: 899,
    gender: "male",
    Type: "T-Shirt",
  },

   {
    Image: "./assets/30.JPG",
    title: "Relaxed Fit Floral Jacket",
    price: 2199,
    gender: "male",
    Type: "Jacket",
  },

   {
    Image: "./assets/18.JPG",
    title: "Baggy Fit Indigo Jeans",
    price: 1799,
    gender: "male",
    Type: "Jeans",
  },

   {
    Image: "./assets/15.JPG",
    title: "Regular Fit Strech Beige Trousers",
    price: 1599,
    gender: "male",
    Type: "Trousers",
  },

   {
    Image: "./assets/9.JPG",
    title: "Textured Olive POlo T-Shirt",
    price: 899,
    gender: "male",
    Type: "T-Shirt",
  },

   {
    Image: "./assets/23.JPG",
    title: "Regular Striped Light Grey Shorts",
    price: 1299,
    gender: "male",
    Type: "Shorts",
  },

   {
    Image: "./assets/28.JPG",
    title: "Relaxed Fit Strech Double Pocket ",
    price: 2399,
    gender: "male",
    Type: "Jacket",
  },

   {
    Image: "./assets/20.JPG",
    title: "Loose Fit off White Jeans",
    price: 1799,
    gender: "male",
    Type: "Jeans",
  },

   {
    Image: "./assets/8.JPG",
    title: "Regular Textured Polo T-Shirt",
    price: 999,
    gender: "male",
    Type: "T-Shirt",
  },

   {
    Image: "./assets/19.JPG",
    title: "Baggy Dark Brown Jeans",
    price: 1699,
    gender: "male",
    Type: "Jeans",
  },

  {
    Image: "./assets/14.JPG",
    title: "Regular Linen Stripes Trousers",
    price: 1799,
    gender: "male",
    Type: "Trousers",
  },

  {
    Image: "./assets/6.JPG",
    title: "Cotton Knitted Brown Polo T-shirt ",
    price: 1399,
    gender: "male",
    Type: "T-Shirt",
  },

  {
    Image: "./assets/13.JPG",
    title: "Relaxed Fit Strech Olive Trouser",
    price: 1499,
    gender: "male",
    Type: "Trousers",
  },

  {
    Image: "./assets/27.JPG",
    title: "Strech Double Pocket Jacket",
    price: 2399,
    gender: "male",
    Type: "Jacket",
  },

  {
    Image: "./assets/21.JPG",
    title: "Regular Fit Strech Shorts",
    price: 1299,
    gender: "male",
    Type: "Shorts",
  },

  {
    Image: "./assets/11.JPG",
    title: "Slim fit Mid Rise Black Trousers ",
    price: 1399,
    gender: "male",
    Type: "Trousers",
  },

  {
    Image: "./assets/22.JPG",
    title: "Regular Fit Strech Shorts",
    price: 1299,
    gender: "male",
    Type: "Shorts",
  },
];

// const products = [ /* YOUR FULL ARRAY (UNCHANGED) */ ];

const container = document.getElementById("productContainer");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const closeDrawer = document.getElementById("closeDrawer");
const filters = document.querySelectorAll(".filter-item");
const themeToggle = document.getElementById("themeToggle");

/* RENDER */
function renderProducts(list){
  container.innerHTML="";
  list.forEach((p,i)=>{
    const card=document.createElement("div");
    card.className="card";
    card.setAttribute("data-aos","fade-up");

    card.innerHTML=`
      <div style="position:relative">
        <img src="${p.Image}">
        <div class="card-actions">
          <button class="action-btn cart" onclick="addToCart(${i})">Add to Cart</button>
          <button class="action-btn buy" onclick="buyNow(${i})">Buy Now</button>
        </div>
      </div>
      <div class="card-content">
        <h1>${p.title}</h1>
        <h2>${p.Type}</h2>
        <p>₹ ${p.price.toLocaleString("en-IN")}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
renderProducts(products);

/* DRAWER */
menuBtn.onclick=()=>{
  drawer.classList.add("open");
  overlay.classList.add("show");
};
closeDrawer.onclick=close;
overlay.onclick=close;

function close(){
  drawer.classList.remove("open");
  overlay.classList.remove("show");
}

/* FILTER */
filters.forEach(btn=>{
  btn.onclick=()=>{
    filters.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    const type=btn.innerText;
    type==="All"
      ? renderProducts(products)
      : renderProducts(products.filter(p=>p.Type===type));

    close();
  };
});

/* THEME */
document.addEventListener("DOMContentLoaded", () => {

  const themeToggle = document.getElementById("themeToggle");
  const drawerThemeToggle = document.getElementById("drawerThemeToggle");

  function applyTheme(isDark){
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if(themeToggle){
      themeToggle.textContent = isDark ? "☀️" : "🌙";
    }

    if(drawerThemeToggle){
      drawerThemeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
    }
  }

  // INIT
  const savedTheme = localStorage.getItem("theme") === "dark";
  applyTheme(savedTheme);

  // DESKTOP TOGGLE
  if(themeToggle){
    themeToggle.addEventListener("click", () => {
      applyTheme(!document.body.classList.contains("dark"));
    });
  }

  // DRAWER TOGGLE (MOBILE)
  if(drawerThemeToggle){
    drawerThemeToggle.addEventListener("click", () => {
      applyTheme(!document.body.classList.contains("dark"));

      // close drawer after toggle (UX polish)
      const drawer = document.getElementById("drawer");
      const overlay = document.getElementById("overlay");
      if(drawer) drawer.classList.remove("open");
      if(overlay) overlay.classList.remove("show");
    });
  }

});


/* ======================
   ADD TO CART (AMAZON)
====================== */
function addToCart(index) {
  const product = products[index];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === index);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: index,
      title: product.title,
      price: product.price,
      image: product.Image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function buyNow(index) {
  addToCart(index);            // ✅ add first
  window.location.href = "checkout.html"; // ✅ then redirect
}


function changeQty(i, delta){
  cart[i].qty += delta;

  if(cart[i].qty <= 0){
    cart.splice(i, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckout();
  updateCartBadge(); // sync badge
}

/* ======================
   CART BADGE (FIXED)
====================== */
// function updateCartBadge() {
//   const badge = document.getElementById("cartCount");
//   if (!badge) return; // safe for other pages

//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   const count = cart.reduce((sum, item) => sum + item.qty, 0);

//   badge.textContent = count;

//   if (count > 0) {
//     badge.classList.add("show");
//   } else {
//     badge.classList.remove("show");
//   }
// }

// 🔥 RUN ON PAGE LOAD
updateCartBadge();

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

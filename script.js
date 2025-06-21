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

let container = document.querySelector(".container");
let imageId = 1

products.forEach((e) => {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    console.log(card);

    let cardImg = document.createElement("img");
    cardImg.setAttribute("src", e.Image);
    cardImg.setAttribute("id",`imgID-${imageId}`)
    imageId++

    let cardTitle = document.createElement("h1");
    cardTitle.innerText = e.title;

    // let cardGender = document.createElement("h2");
    // cardGender.innerText = pd.gender;

    let cardType = document.createElement("h2");
    cardType.innerText = e.Type;

    let cardPrice = document.createElement("p");
    cardPrice.innerText = '₹ '+ e.price.toLocaleString("en-IN");

    card.appendChild(cardImg);
    card.appendChild(cardTitle);
    // card.appendChild(cardGender);
    card.appendChild(cardType)
    card.appendChild(cardPrice);

    container.appendChild(card);
});





//  SELECT MENU
// Select dropdown filter logic
const select = document.getElementById("select");

select.addEventListener("change", function () {
  const selectedOption = select.options[select.selectedIndex].text;

  container.innerHTML = ""; // Clear existing cards

  const filteredProducts = selectedOption === "All"
    ? products
    : products.filter((item) => item.Type === selectedOption);

  let imageId = 1;
  filteredProducts.forEach((e) => {
    let card = document.createElement("div");
    card.setAttribute("class", "card");

    let cardImg = document.createElement("img");
    cardImg.setAttribute("src", e.Image);
    cardImg.setAttribute("id", `imgID-${imageId}`);
    imageId++;

    let cardTitle = document.createElement("h1");
    cardTitle.innerText = e.title;

    let cardType = document.createElement("h2");
    cardType.innerText = e.Type;

    let cardPrice = document.createElement("p");
    cardPrice.innerText = '₹ ' + e.price;

    card.appendChild(cardImg);
    card.appendChild(cardTitle);
    card.appendChild(cardType);
    card.appendChild(cardPrice);

    container.appendChild(card);
  });
});


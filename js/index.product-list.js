const products = [
  {
    id: 1,
    title: "Baby Yoda",
    price: 19.99,
    description:
      "A cute Baby Yoda plush toy, perfect for fans of The Mandalorian. Soft, cuddly, and ideal for display or play.",
    image: "img/baby-yoda.svg",
  },
  {
    id: 2,
    title: "Banana",
    price: 17.99,
    description:
      "Fresh banana from Ecuador, rich in potassium and flavor. Great for snacks, smoothies, or a healthy breakfast.",
    image: "img/banana.svg",
  },
  {
    id: 3,
    title: "Girl",
    price: 18.99,
    description:
      "Sticker with a vibrant girl illustration, ideal for decorating laptops, notebooks, or water bottles. Durable and waterproof.",
    image: "img/girl.svg",
  },
  {
    id: 4,
    title: "Viking",
    price: 15.99,
    description:
      "Sticker with Viking illustration, featuring bold colors and intricate details. Perfect for history enthusiasts and collectors.",
    image: "img/viking.svg",
  },
];

function renderProducts(products) {
  let productsHTML = [];
  for (const product of products) {
    productsHTML.push(
      `<article class="products__item">
                <img class="products__image" src="${product.image}" alt="${
        product.title
      }">
                <h3 class="products__name">${product.title}</h3>
                <p class="products__description">${product.description}</p>
                <div class="products__actions">
                    <button class="products__button products__button--info button button-card">
                        Info
                    </button>
                    <button class="products__button products__button--buy button button-card">
                        Buy - ${product.price.toFixed(2)}
                    </button>
                </div>
            </article>
            `
    );
  }
  const productsContainer = document.querySelector(".products__list");
  productsContainer.innerHTML = productsHTML.join("");
}

renderProducts(products);


"use strict";

const WHATSAPP_NUMBER = "5511953368886";

const products = [
  {
    id: 1,
    name: "Conjunto 01",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto1.png",
    description: "Consulte detalhes, tamanhos e disponibilidade."
  },
  {
    id: 2,
    name: "Conjunto 02",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto2.png",
    description: "Uma opção para compor seu próximo look."
  },
  {
    id: 3,
    name: "Conjunto 03",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto3.png",
    description: "Consulte os tamanhos disponíveis com a loja."
  },
  {
    id: 4,
    name: "Conjunto 04",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto4.png",
    description: "Veja mais detalhes pelo WhatsApp."
  },
  {
    id: 5,
    name: "Conjunto 05",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto5.png",
    description: "Consulte disponibilidade e informações."
  },
  {
    id: 6,
    name: "Conjunto 06",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto6.png",
    description: "Entre em contato para saber mais."
  },
  {
    id: 7,
    name: "Conjunto 07",
    category: "conjuntos",
    label: "Conjunto",
    image: "assets/conjunto7.png",
    description: "Confira se este modelo está disponível."
  },
  {
    id: 8,
    name: "Peça Branca",
    category: "roupas",
    label: "Roupa",
    image: "assets/bobojacobranco.png",
    description: "Modelo branco. Consulte detalhes e tamanhos."
  },
  {
    id: 9,
    name: "Bolsa 01",
    category: "bolsas",
    label: "Bolsa",
    image: "assets/bolsa1.png",
    description: "Consulte detalhes e disponibilidade."
  },
  {
    id: 10,
    name: "Tênis 01",
    category: "calcados",
    label: "Calçado",
    image: "assets/tenis1.png",
    description: "Consulte numerações e disponibilidade."
  },
  {
    id: 11,
    name: "Tênis 02",
    category: "calcados",
    label: "Calçado",
    image: "assets/tenis2.png",
    description: "Consulte numerações e informações."
  }
];

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");
const clearFilters = document.getElementById("clearFilters");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const backToTop = document.getElementById("backToTop");

let activeCategory = "todos";
let searchTerm = "";

function createWhatsAppLink(product) {
  const message = [
    "Olá, Dugal Modas! Tenho interesse neste produto:",
    `Produto: ${product.name}`,
    `Categoria: ${product.label}`,
    "",
    "Poderiam informar o preço e a disponibilidade?"
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.style.cssText = [
      "height:100%",
      "min-height:200px",
      "display:flex",
      "flex-direction:column",
      "justify-content:center",
      "align-items:center",
      "text-align:center",
      "padding:15px",
      "background:#eee",
      "color:#555",
      "gap:10px",
      "overflow-wrap:anywhere"
    ].join(";");

    const title = document.createElement("strong");
    title.textContent = "Imagem não encontrada";
    title.style.color = "#c91c28";

    const path = document.createElement("small");
    path.textContent = product.image;

    fallback.append(title, path);
    imageWrap.replaceChildren(fallback);
  }, { once: true });

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.label;

  imageWrap.append(image, category);

  const info = document.createElement("div");
  info.className = "product-info";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = "Consulte o preço";

  const order = document.createElement("a");
  order.className = "product-order";
  order.href = createWhatsAppLink(product);
  order.target = "_blank";
  order.rel = "noopener noreferrer";
  order.setAttribute("aria-label", `Consultar ${product.name} pelo WhatsApp`);
  order.textContent = "Tenho interesse ↗";

  bottom.append(price, order);
  info.append(name, description, bottom);
  card.append(imageWrap, info);

  return card;
}

function getFilteredProducts() {
  const normalizedTerm = searchTerm.toLocaleLowerCase("pt-BR");

  return products.filter((product) => {
    const categoryMatches =
      activeCategory === "todos" || product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.label} ${product.description}`
        .toLocaleLowerCase("pt-BR");

    return categoryMatches && searchableText.includes(normalizedTerm);
  });
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();
  const fragment = document.createDocumentFragment();

  visibleProducts.forEach((product) => {
    fragment.appendChild(createProductCard(product));
  });

  productGrid.replaceChildren(fragment);
  productCount.textContent = String(visibleProducts.length);
  emptyState.hidden = visibleProducts.length !== 0;
  productGrid.hidden = visibleProducts.length === 0;
}

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeCategory = button.dataset.filter;

  filters.querySelectorAll(".filter").forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

clearFilters.addEventListener("click", () => {
  activeCategory = "todos";
  searchTerm = "";
  searchInput.value = "";

  filters.querySelectorAll(".filter").forEach((item) => {
    const isActive = item.dataset.filter === "todos";
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("currentYear").textContent =
  String(new Date().getFullYear());

renderProducts();
updateBackToTop();

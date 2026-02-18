let currentUser = "user";

// --- AUTH LOGIC ---
function handleLogin() {
  const user = document.getElementById("username").value.toLowerCase();
  currentUser = user;

  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");

  // Check if Admin
  if (user === "admin") {
    document.getElementById("admin-link").classList.remove("hidden");
  } else {
    document.getElementById("admin-link").classList.add("hidden");
  }

  renderProducts();
}

// --- NAVIGATION LOGIC ---
function showPage(pageId) {
  const pages = ["home-page", "about-page"];
  pages.forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(`${pageId}-page`).classList.remove("hidden");
}

// --- PRODUCT LOGIC ---
function renderProducts(data = products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  data.forEach((item, index) => {
    let deleteBtn =
      currentUser === "admin"
        ? `<button onclick="deleteProduct(${index})" style="color:red; border:none; background:none; cursor:pointer; margin-top:10px; font-size:12px;">Delete Item</button>`
        : "";

    list.innerHTML += `
            <div class="card fade-in">
                <img src="${item.img}" alt="${item.name}">
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p style="color:#0095f6; font-weight:bold; font-size:1.1rem;">${item.price} RWF</p>
                    ${deleteBtn}
                </div>
            </div>
        `;
  });
}

function saveProduct() {
  const name = document.getElementById("p-name").value;
  const price = document.getElementById("p-price").value;
  const img =
    document.getElementById("p-image").value ||
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400";

  if (name && price) {
    products.push({ name, price, img });
    localStorage.setItem("fruitStock", JSON.stringify(products));
    renderProducts();
    hideModal();
  }
}

function deleteProduct(index) {
  if (confirm("Remove this fruit from inventory?")) {
    products.splice(index, 1);
    localStorage.setItem("fruitStock", JSON.stringify(products));
    renderProducts();
  }
}

function searchFruit() {
  const term = document.getElementById("searchBar").value.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
}

// --- UI HELPERS ---
function showSignup() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("signup-section").classList.remove("hidden");
}
function showLogin() {
  document.getElementById("signup-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}
function showModal() {
  document.getElementById("add-modal").classList.remove("hidden");
}
function hideModal() {
  document.getElementById("add-modal").classList.add("hidden");
}
function logout() {
  location.reload();
}

// ================= NAVIGATION =================
const navLinks = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll("main section");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    sections.forEach((sec) => sec.classList.add("hidden"));

    const targetId = link.dataset.target;
    if (targetId) {
      document.getElementById(targetId).classList.remove("hidden");
    }
  });
});

// ================= PRODUCTS =================
let products = JSON.parse(localStorage.getItem("products")) || [];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  const tbody = document.getElementById("productTable");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (products.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7" style="text-align: center; padding: 30px;">📭 No products yet. Click "Add Product" to create one.</td>`;
    tbody.appendChild(row);
  } else {
    products.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.qty}</td>
                <td>$${parseFloat(p.price).toFixed(2)}</td>
                <td class="${p.qty > 0 ? "in" : "out"}">${p.qty > 0 ? "✅ In Stock" : "❌ Out of Stock"}</td>
                <td>
                    <button onclick="deleteProduct(${i})" class="delete-btn" style="background:#dc2626; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
      tbody.appendChild(row);
    });
  }
  updateDashboardCounts();
  updateStockValue();
  saveProducts();
}

// ================= ADD PRODUCT MODAL =================
function addProduct() {
  const modal = document.createElement("div");
  modal.className = "product-modal";
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
    `;

  modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #333; font-size: 24px;">➕ Add New Product</h2>
                <button onclick="this.closest('.product-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">&times;</button>
            </div>
            
            <form id="addProductForm" onsubmit="return false;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Product ID</label>
                    <input type="text" id="prodId" placeholder="e.g., PRD001" required style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        outline: none;
                    ">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Product Name</label>
                    <input type="text" id="prodName" placeholder="e.g., Laptop" required style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        outline: none;
                    ">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Category</label>
                    <select id="prodCategory" required style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        outline: none;
                        background: white;
                    ">
                        <option value="">Select category</option>
                        <option value="Electronics">📱 Electronics</option>
                        <option value="Clothing">👕 Clothing</option>
                        <option value="Food">🍎 Food</option>
                        <option value="Furniture">🪑 Furniture</option>
                        <option value="Books">📚 Books</option>
                        <option value="Other">📦 Other</option>
                    </select>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Quantity</label>
                        <input type="number" id="prodQty" min="0" value="1" required style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #e0e0e0;
                            border-radius: 10px;
                            font-size: 15px;
                            outline: none;
                        ">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #555;">Price ($)</label>
                        <input type="number" id="prodPrice" min="0" step="0.01" value="0.00" required style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #e0e0e0;
                            border-radius: 10px;
                            font-size: 15px;
                            outline: none;
                        ">
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button type="button" onclick="saveNewProduct()" style="
                        flex: 2;
                        background: linear-gradient(135deg, #2563eb, #1e3a8a);
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 10px;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                    ">💾 Save Product</button>
                    
                    <button type="button" onclick="this.closest('.product-modal').remove()" style="
                        flex: 1;
                        background: #e5e7eb;
                        color: #333;
                        border: none;
                        padding: 14px;
                        border-radius: 10px;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </form>
            
            <p id="modalError" style="color: #dc2626; text-align: center; margin-top: 15px; font-size: 14px;"></p>
        </div>
    `;

  document.body.appendChild(modal);
  setTimeout(() => {
    document.getElementById("prodId").focus();
  }, 100);
}

// ================= SAVE NEW PRODUCT =================
function saveNewProduct() {
  const id = document.getElementById("prodId")?.value.trim();
  const name = document.getElementById("prodName")?.value.trim();
  const category = document.getElementById("prodCategory")?.value;
  const qty = parseInt(document.getElementById("prodQty")?.value);
  const price = parseFloat(document.getElementById("prodPrice")?.value);
  const modalError = document.getElementById("modalError");

  if (!id) {
    modalError.innerText = "❌ Product ID is required!";
    return;
  }
  if (!name) {
    modalError.innerText = "❌ Product name is required!";
    return;
  }
  if (!category) {
    modalError.innerText = "❌ Please select a category!";
    return;
  }
  if (isNaN(qty) || qty < 0) {
    modalError.innerText = "❌ Please enter a valid quantity!";
    return;
  }
  if (isNaN(price) || price < 0) {
    modalError.innerText = "❌ Please enter a valid price!";
    return;
  }

  const exists = products.some((p) => p.id === id);
  if (exists) {
    modalError.innerText = "❌ Product ID already exists!";
    return;
  }

  products.push({
    id: id,
    name: name,
    category: category,
    qty: qty,
    price: price,
  });

  renderProducts();

  const modal = document.querySelector(".product-modal");
  if (modal) modal.remove();

  alert("✅ Product added successfully!");
}

function deleteProduct(index) {
  if (confirm("Delete this product?")) {
    products.splice(index, 1);
    renderProducts();
  }
}

function clearProducts() {
  if (
    confirm(
      "⚠️ Are you sure you want to delete ALL products? This cannot be undone!",
    )
  ) {
    products = [];
    renderProducts();
  }
}

function updateDashboardCounts() {
  const total = products.length;
  const inStock = products.filter((p) => p.qty > 0).length;
  const outStock = products.filter((p) => p.qty <= 0).length;

  const totalEl = document.getElementById("totalProducts");
  const inEl = document.getElementById("inStock");
  const outEl = document.getElementById("outStock");

  if (totalEl) totalEl.innerText = total;
  if (inEl) inEl.innerText = inStock;
  if (outEl) outEl.innerText = outStock;
}
function updateStockValue() {
  const stockValue = products.reduce((acc, p) => acc + p.qty * p.price, 0);
  const stockEl = document.getElementById("stockValue");
  if (stockEl) stockEl.innerText = stockValue.toFixed(2);
}
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));

    const icon = darkToggle.querySelector("i");
    if (icon) {
      if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
      } else {
        icon.className = "fa-solid fa-moon";
      }
    }
  });
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  const icon = document.querySelector("#darkToggle i");
  if (icon) icon.className = "fa-solid fa-sun";
}
const loggedUser = document.getElementById("loggedUser");
if (loggedUser) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    loggedUser.innerText = `👋 ${user.name}`;
  } else {
    loggedUser.innerText = "Guest";
  }
}
document.addEventListener("keydown", function (e) {
  if (e.key === "a" || e.key === "A") {
    const activeSection = document.querySelector("main section:not(.hidden)");
    if (activeSection?.id === "productsSection") {
      addProduct();
    }
  }

  if (e.key === "Escape") {
    const modal = document.querySelector(".product-modal");
    if (modal) modal.remove();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();

  const dashboardSection = document.getElementById("dashboardSection");
  if (dashboardSection) {
    sections.forEach((sec) => sec.classList.add("hidden"));
    dashboardSection.classList.remove("hidden");
  }

  navLinks.forEach((link) => {
    if (link.dataset.target === "dashboardSection") {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-modal input:focus, 
        .product-modal select:focus {
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.2) !important;
        }
        
        body.dark .product-modal > div {
            background: #2d3748;
        }
        
        body.dark .product-modal h2,
        body.dark .product-modal label {
            color: #f1f5f9 !important;
        }
        
        body.dark .product-modal input,
        body.dark .product-modal select {
            background: #4a5568;
            border-color: #4a5568;
            color: white;
        }
        
        body.dark .product-modal option {
            background: #2d3748;
        }
    `;
  document.head.appendChild(style);
});

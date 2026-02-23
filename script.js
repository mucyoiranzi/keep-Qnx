// ================= NAVIGATION =================
const navLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('main section');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(sec => sec.classList.add('hidden'));
        
        const targetId = link.dataset.target;
        if(targetId) {
            document.getElementById(targetId).classList.remove('hidden');
        }
    });
});

// ================= PRODUCTS =================
let products = JSON.parse(localStorage.getItem('products')) || [];

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function renderProducts(){
    const tbody = document.getElementById('productTable');
    if(!tbody) return;
    
    tbody.innerHTML = '';
    if(products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center;">No products yet. Click "Add Product" to create one.</td>`;
        tbody.appendChild(row);
    } else {
        products.forEach((p, i)=>{
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.qty}</td>
                <td>$${parseFloat(p.price).toFixed(2)}</td>
                <td class="${p.qty > 0 ? 'in' : 'out'}">${p.qty > 0 ? 'In Stock' : 'Out of Stock'}</td>
                <td>
                    <button onclick="deleteProduct(${i})" class="delete-btn" style="background:#dc2626; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i> Delete
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

function addProduct(){
    const id = prompt("Product ID:");
    if(!id) return;
    
    const name = prompt("Product Name:");
    if(!name) return;
    
    const category = prompt("Category:");
    if(!category) return;
    
    const qty = parseInt(prompt("Quantity:"));
    if(isNaN(qty)) return;
    
    const price = parseFloat(prompt("Price:"));
    if(isNaN(price)) return;

    products.push({
        id: id,
        name: name,
        category: category,
        qty: qty,
        price: price
    });
    renderProducts();
    alert("Product added successfully!");
}

function deleteProduct(index){
    if(confirm("Delete this product?")){
        products.splice(index, 1);
        renderProducts();
    }
}

function clearProducts(){
    if(confirm("⚠️ Are you sure you want to delete ALL products? This cannot be undone!")){
        products = [];
        renderProducts();
    }
}

// ================= DASHBOARD COUNTS =================
function updateDashboardCounts(){
    const total = products.length;
    const inStock = products.filter(p => p.qty > 0).length;
    const outStock = products.filter(p => p.qty <= 0).length;
    
    const totalEl = document.getElementById('totalProducts');
    const inEl = document.getElementById('inStock');
    const outEl = document.getElementById('outStock');
    
    if(totalEl) totalEl.innerText = total;
    if(inEl) inEl.innerText = inStock;
    if(outEl) outEl.innerText = outStock;
}

// ================= STOCK VALUE =================
function updateStockValue(){
    const stockValue = products.reduce((acc, p) => acc + (p.qty * p.price), 0);
    const stockEl = document.getElementById('stockValue');
    if(stockEl) stockEl.innerText = stockValue.toFixed(2);
}

// ================= DARK MODE =================
const darkToggle = document.getElementById('darkToggle');
if(darkToggle){
    darkToggle.addEventListener('click', ()=>{
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        
        // Update icon
        const icon = darkToggle.querySelector('i');
        if(icon) {
            if(document.body.classList.contains('dark')) {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    });
}

// Load dark mode preference
if(localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark');
    const icon = document.querySelector('#darkToggle i');
    if(icon) icon.className = 'fa-solid fa-sun';
}

// ================= LOGOUT =================
function logout(){
    if(confirm("Are you sure you want to logout?")){
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }
}

// ================= USER DISPLAY =================
const loggedUser = document.getElementById('loggedUser');
if(loggedUser){
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if(user) {
        loggedUser.innerText = `👋 ${user.name}`;
    } else {
        loggedUser.innerText = "Guest";
    }
}

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // Show dashboard by default
    const dashboardSection = document.getElementById('dashboardSection');
    if(dashboardSection) {
        sections.forEach(sec => sec.classList.add('hidden'));
        dashboardSection.classList.remove('hidden');
    }
    
    // Set active nav
    navLinks.forEach(link => {
        if(link.dataset.target === 'dashboardSection') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
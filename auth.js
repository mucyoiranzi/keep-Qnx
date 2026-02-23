/* USERS */
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(u) {
  localStorage.setItem("users", JSON.stringify(u));
}

function register() {
  let n = rname.value,
    e = remail.value,
    p = rpass.value,
    c = rcpass.value;
  let u = getUsers();
  if (!n || !e || !p || !c) {
    rmsg.innerText = "Fill all please ";
    return;
  }
  if (u.find((x) => x.email === e)) {
    rmsg.innerText = "Email exists";
    return;
  }
  if (p !== c) {
    rmsg.innerText = "Fill much info";
    return;
  }
  u.push({ name: n, email: e, pass: p });
  saveUsers(u);
  location = "login.html";
}

function login() {
  let e = lemail.value,
    p = lpass.value;
  let u = getUsers().find((x) => x.email === e && x.pass === p);
  if (!u) {
    lmsg.innerText = "Wrong login ";
    return;
  }
  localStorage.setItem("logged", JSON.stringify(u));
  location = "dashboard.html";
}

function logout() {
  localStorage.removeItem("logged");
  location = "login.html";
}

/* DASH */
function initDash() {
  let u = JSON.parse(localStorage.getItem("logged"));
  if (!u) location = "login.html";
  uname.innerText = u.name;
  loadProducts();
}

/* PRODUCTS */
function getP() {
  return JSON.parse(localStorage.getItem("products")) || [];
}
function saveP(p) {
  localStorage.setItem("products", JSON.stringify(p));
}

function toggleForm() {
  pform.classList.toggle("hidden");
}

function addProduct() {
  let n = pname.value,
    c = pcat.value,
    q = Number(pqty.value),
    pr = Number(pprice.value);
  if (!n || !c || q < 0 || isNaN(pr)) return;
  let p = getP();
  p.push({ id: "P" + Date.now(), name: n, cat: c, qty: q, price: pr });
  saveP(p);
  loadProducts();
}

function delProduct(id) {
  let p = getP().filter((x) => x.id !== id);
  saveP(p);
  loadProducts();
}

function loadProducts() {
  let p = getP();
  ptable.innerHTML = "";

  let ins = 0,
    out = 0;

  if (p.length === 0) {
    ptable.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:20px;">
            No products available
          </td>
        </tr>`;
  }

  p.forEach((x) => {
    let statusText = x.qty > 0 ? "In Stock" : "Out of Stock";
    let statusClass = x.qty > 0 ? "status-in" : "status-out";

    if (x.qty > 0) ins++;
    else out++;

    ptable.innerHTML += `
        <tr>
          <td>${x.id}</td>
          <td>${x.name}</td>
          <td>${x.cat}</td>
          <td>${x.qty}</td>
          <td>$${x.price}</td>
          <td>
            <span class="${statusClass}">
              ${statusText}
            </span>
          </td>
          <td>
            <button class="delBtn" onclick="delProduct('${x.id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
  });

  tprod.innerText = p.length;
  inst.innerText = ins;
  outst.innerText = out;
}
function showDashboard() {
  dashboardSection.classList.remove("hidden");
  productSection.classList.add("hidden");

  dashBtn.classList.add("active");
  prodBtn.classList.remove("active");
}

function showProducts() {
  dashboardSection.classList.add("hidden");
  productSection.classList.remove("hidden");

  prodBtn.classList.add("active");
  dashBtn.classList.remove("active");
}

// ================= REGISTER =================
const registerForm = document.getElementById('registerForm');
if(registerForm){
    const registerError = document.getElementById('registerError');

    registerForm.addEventListener('submit', e=>{
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if(password !== confirm){
            registerError.innerText = "Passwords do not match!";
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.some(u => u.email === email);
        if(exists){
            registerError.innerText = "Email already registered!";
            return;
        }

        users.push({name, email, password});
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registration successful! Please login.");
        window.location.href = 'login.html';
    });
}

// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');
if(loginForm){
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', e=>{
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if(user){
            localStorage.setItem('loggedInUser', JSON.stringify({name: user.name, email: user.email}));
            window.location.href = 'Dashboard.html';
        } else {
            loginError.innerText = "Invalid email or password!";
        }
    });
}

// ================= FORGOT PASSWORD MODAL =================
const forgotModal = document.getElementById('forgotModal');
const forgotPassBtn = document.querySelector('.forgot-pass');
const closeModal = document.getElementById('closeModal');
const checkPasswordBtn = document.getElementById('checkPasswordBtn');
const forgotResult = document.getElementById('forgotResult');

if(forgotModal) {
    if(forgotPassBtn){
        forgotPassBtn.addEventListener('click', ()=>{
            forgotModal.classList.remove('hidden');
            forgotResult.innerText = "";
            document.getElementById('forgotEmail').value = "";
        });
    }

    if(closeModal){
        closeModal.addEventListener('click', ()=>{
            forgotModal.classList.add('hidden');
        });
    }

    if(checkPasswordBtn){
        checkPasswordBtn.addEventListener('click', ()=>{
            const email = document.getElementById('forgotEmail').value.trim();
            if(!email){
                forgotResult.innerText = "Please enter your email!";
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);

            if(user){
                forgotResult.innerText = "✅ Password reset link sent to your email!";
            } else {
                forgotResult.innerText = "❌ Email not found!";
            }
        });
    }

    window.addEventListener('click', (e)=>{
        if(e.target === forgotModal){
            forgotModal.classList.add('hidden');
        }
    });
}
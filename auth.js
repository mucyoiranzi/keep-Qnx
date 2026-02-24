// ================= REGISTER =================
const registerForm = document.getElementById('registerForm');
if(registerForm){
    const registerError = document.getElementById('registerError');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if(password !== confirm){
            registerError.style.color = '#dc2626';
            registerError.innerText = '❌ Passwords do not match!';
            return;
        }

        if(password.length < 6){
            registerError.style.color = '#dc2626';
            registerError.innerText = '❌ Password must be at least 6 characters!';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.some(u => u.email === email);
        if(exists){
            registerError.style.color = '#dc2626';
            registerError.innerText = '❌ Email already registered!';
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        
        registerError.style.color = '#16a34a';
        registerError.innerText = '✅ Registration successful! Redirecting...';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');
if(loginForm){
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if(user){
            localStorage.setItem('loggedInUser', JSON.stringify({
                name: user.name,
                email: user.email,
                loginTime: new Date().toISOString()
            }));
            
            loginError.style.color = '#16a34a';
            loginError.innerText = '✅ Login successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'Dashboard.html';
            }, 1000);
        } else {
            loginError.style.color = '#dc2626';
            loginError.innerText = '❌ Invalid email or password!';
        }
    });
}

// ================= FORGOT PASSWORD MODAL =================
const forgotModal = document.getElementById('forgotModal');
const forgotPassLink = document.querySelector('.forgot-pass-link');
const closeModal = document.getElementById('closeModal');
const checkPasswordBtn = document.getElementById('checkPasswordBtn');
const forgotResult = document.getElementById('forgotResult');

if(forgotModal) {
    if(forgotPassLink) {
        forgotPassLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotModal.classList.remove('hidden');
            forgotResult.innerHTML = '';
            forgotResult.className = 'forgot-result';
            document.getElementById('forgotEmail').value = '';
        });
    }

    if(closeModal) {
        closeModal.addEventListener('click', function() {
            forgotModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', function(e) {
        if(e.target === forgotModal) {
            forgotModal.classList.add('hidden');
        }
    });

    if(checkPasswordBtn) {
        checkPasswordBtn.addEventListener('click', function() {
            const email = document.getElementById('forgotEmail').value.trim();
            
            if(!email) {
                forgotResult.innerHTML = '❌ Please enter your email!';
                forgotResult.className = 'forgot-result error-message';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                forgotResult.innerHTML = '❌ Please enter a valid email!';
                forgotResult.className = 'forgot-result error-message';
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);

            if(user) {
                forgotResult.innerHTML = '✅ Password reset link sent to your email!';
                forgotResult.className = 'forgot-result success-message';
                
                console.log('🔐 Demo mode - Password for', email, 'is:', user.password);
                
                setTimeout(() => {
                    forgotModal.classList.add('hidden');
                }, 2000);
            } else {
                forgotResult.innerHTML = '❌ Email not found!';
                forgotResult.className = 'forgot-result error-message';
            }
        });
    }

    document.getElementById('forgotEmail')?.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            checkPasswordBtn.click();
        }
    });
}

// ================= DEMO ACCOUNTS =================
(function initDemoAccounts() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if(users.length === 0) {
        users = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                createdAt: new Date().toISOString()
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'jane123',
                createdAt: new Date().toISOString()
            },
            {
                name: 'Admin User',
                email: 'admin@sims.com',
                password: 'admin123',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
        console.log('✅ Demo accounts created!');
    }
})();

function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

if(window.location.pathname.includes('Dashboard.html')) {
    if(!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

function logout() {
    if(confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }
}
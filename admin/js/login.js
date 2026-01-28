function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const error = document.getElementById('error');


    const salt = "keyadmin";
    const hashedPassword = CryptoJS.SHA256(pass + salt).toString();

    if (user === 'admin' && hashedPassword === '4373bca83929a8f056018aa169bc7226c43c61990b217edd821444b7a11188a2') {
        sessionStorage.setItem('admin_logged_in', 'true');
        window.location.href = 'index.html';
    } else {
        error.style.display = 'block';
        setTimeout(() => { error.style.display = 'none'; }, 3000);
    }
}

// Xử lý ẩn/hiện mật khẩu
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
}

// Nhấn Enter để đăng nhập 
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

// Đồng bộ theme
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

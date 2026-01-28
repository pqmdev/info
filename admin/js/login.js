function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const error = document.getElementById('error');

    const hashedPassword = md5(pass);
    if (user === 'admin' && hashedPassword === '823f4cfe556f95863e2df595c02b432f') {
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

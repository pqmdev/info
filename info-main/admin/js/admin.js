// Quản lý dữ liệu Keys
let keys = JSON.parse(localStorage.getItem('sys_keys'));

// Nếu local không có, lấy từ key.js
if (!keys || keys.length === 0) {
    keys = (typeof sys_keys_default !== 'undefined') ? sys_keys_default : [];
}

function save() {
    localStorage.setItem('sys_keys', JSON.stringify(keys));
}

// Chức năng Admin
function addKey() {
    const user = document.getElementById('key-user').value || 'User_' + Math.floor(Math.random() * 9000);
    const hours = parseInt(document.getElementById('key-time').value);
    const code = 'KEY-' + Math.random().toString(36).substring(2, 11).toUpperCase();

    let expiryTime;
    if (hours > 100000) {
        expiryTime = 4102444800000; // Năm 2100
    } else {
        expiryTime = Date.now() + (hours * 3600000);
    }

    const newKey = {
        id: Date.now(),
        user: user,
        code: code,
        expires: expiryTime
    };

    keys.unshift(newKey);
    save();
    render();
    document.getElementById('key-user').value = '';
}

function deleteKey(id) {
    keys = keys.filter(k => k.id !== id);
    save();
    render();
}

// Xóa tất cả key đã hết hạn
function deleteExpiredKeys() {
    const now = Date.now();
    const beforeCount = keys.length;
    keys = keys.filter(k => k.expires > now);
    if (keys.length < beforeCount) {
        save();
        render();
        alert(`Đã dọn dẹp ${beforeCount - keys.length} key hết hạn!`);
    } else {
        alert('Không có key nào hết hạn để xóa.');
    }
}

function formatTimeLeft(expiry) {
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) return '<span class="status-expired">Hết hạn</span>';
    if (expiry > 4000000000000) return '<span class="status-valid">Vĩnh viễn ∞</span>';

    const days = Math.floor(diff / (24 * 3600000));
    const hours = Math.floor((diff % (24 * 3600000)) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `<span class="status-valid">${days}ngày ${hours}giờ ${mins}phút ${secs}giây</span>`;
}

// Cập nhật hàm render để sử dụng định dạng thời gian mới
// Biến tạm lưu key đang chỉnh sửa
let currentKeyId = null;

function openManageModal(id) {
    currentKeyId = id;
    const key = keys.find(k => k.id === id);
    if (!key) return;

    const modal = document.getElementById('manageKeyModal');
    const infoBox = document.getElementById('modal-key-info');

    infoBox.innerHTML = `
        <div style="margin-bottom: 5px;"><strong>Của:</strong> ${key.user}</div>
        <div style="color: var(--accent-color); font-weight: 700; font-family: monospace;">${key.code}</div>
        <div style="margin-top: 5px; opacity: 0.8;">Hạn cũ: ${new Date(key.expires).toLocaleString('vi-VN')}</div>
    `;

    modal.style.display = 'flex';
}

function closeManageModal() {
    document.getElementById('manageKeyModal').style.display = 'none';
    currentKeyId = null;
}

function confirmRenew() {
    const hours = parseInt(document.getElementById('extend-time').value);
    renewKey(currentKeyId, hours);
    closeManageModal();
}

function renewKey(id, hours) {
    const keyIndex = keys.findIndex(k => k.id === id);

    if (keyIndex !== -1) {
        const key = keys[keyIndex];
        const now = Date.now();
        // Nếu đã hết hạn thì tính từ bây giờ, nếu chưa thì cộng dồn
        const baseTime = (key.expires > now) ? key.expires : now;

        if (hours > 100000) {
            key.expires = 4102444800000;
        } else {
            key.expires = baseTime + (hours * 3600000);
        }

        save();
        render();
        return true;
    }
    return false;
}

function confirmCancelKey() {
    if (confirm('Bạn muốn hủy kích hoạt Key này ngay lập tức? (Nó sẽ bị tính là hết hạn)')) {
        const key = keys.find(k => k.id === currentKeyId);
        if (key) {
            key.expires = Date.now() - 1000; // Cho hết hạn ngay
            save();
            render();
            closeManageModal();
        }
    }
}

function confirmDeleteKey() {
    if (confirm('LƯU Ý: Thao tác này sẽ xóa vĩnh viễn Key khỏi dữ liệu. Bạn chắc chắn?')) {
        deleteKey(currentKeyId);
        closeManageModal();
    }
}

function render(filter = '') {
    const list = document.getElementById('key-list-render');
    if (!list) return;

    list.innerHTML = '';
    const now = Date.now();
    let liveCount = 0;
    let expiredCount = 0;

    const filteredKeys = keys.filter(k =>
        k.user.toLowerCase().includes(filter.toLowerCase()) ||
        k.code.toLowerCase().includes(filter.toLowerCase())
    );

    filteredKeys.forEach(k => {
        const isExpired = now > k.expires;
        if (isExpired) expiredCount++; else liveCount++;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${k.user}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <code style="font-family: monospace; font-weight: 700; color: var(--accent-color); background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 5px;">${k.code}</code>
                    <button class="btn btn-primary" onclick="copyToClipboard('${k.code}')" style="padding: 5px 10px; font-size: 0.8em;">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </td>
            <td>
                <div style="font-size: 0.85em;">${new Date(k.expires).toLocaleString('vi-VN')}</div>
                <div class="time-left-display" data-expiry="${k.expires}" style="font-size: 0.8em; opacity: 0.7;">
                    ${formatTimeLeft(k.expires)}
                </div>
            </td>
            <td>
                <span class="status-badge ${isExpired ? 'status-expired' : 'status-valid'}">
                    ${isExpired ? 'Expired' : 'Live'}
                </span>
            </td>
            <td>
                <div class="action-dropdown">
                    <button class="btn" style="background: rgba(255,255,255,0.1); color: white;" onclick="toggleDropdown(event, ${k.id})">
                        <i class="fas fa-cog"></i>
                    </button>
                    <div id="dropdown-${k.id}" class="dropdown-content">
                        <a onclick="openManageModal(${k.id})"><i class="fas fa-edit"></i> Quản lý chi tiết</a>
                        <a class="delete-opt" onclick="if(confirm('Xóa key này?')) deleteKey(${k.id})"><i class="fas fa-trash-alt"></i> Xóa Key</a>
                    </div>
                </div>
            </td>
        `;
        list.appendChild(row);
    });

    if (document.getElementById('total-keys')) document.getElementById('total-keys').innerText = keys.length;
    if (document.getElementById('live-keys')) document.getElementById('live-keys').innerText = liveCount;
    if (document.getElementById('expired-keys')) document.getElementById('expired-keys').innerText = expiredCount;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã copy mã Key: ' + text);
    });
}

function filterKeys() {
    const val = document.getElementById('search-input').value;
    render(val);
}

function exportKeys() {
    const blob = new Blob([JSON.stringify(keys, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keys_backup.json';
    a.click();
}

function handleLogout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'login.html';
}

function toggleDropdown(event, id) {
    event.stopPropagation();
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].id !== `dropdown-${id}`) {
            dropdowns[i].classList.remove('show');
        }
    }
    document.getElementById(`dropdown-${id}`).classList.toggle("show");
}

// Đóng dropdown khi click ra ngoài
window.onclick = function (event) {
    if (!event.target.matches('.btn') && !event.target.matches('.fa-cog')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
}

// Khởi tạo trang khi load
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra đăng nhập (chỉ cho trang admin)
    if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('login.html')) {
        if (sessionStorage.getItem('admin_logged_in') !== 'true') {
            window.location.href = 'login.html';
        }
    }

    // Set theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Thêm hiệu ứng sao băng rơi (giống trang chủ)
    initShootingStars();

    // Render dữ liệu ban đầu
    render();

    // Tự động cập nhật thời gian mỗi giây
    setInterval(() => {
        const now = Date.now();
        let liveCount = 0;
        let expiredCount = 0;

        const timerDisplays = document.querySelectorAll('.time-left-display');
        timerDisplays.forEach(el => {
            const expiry = parseInt(el.getAttribute('data-expiry'));
            el.innerHTML = formatTimeLeft(expiry);

            // Cập nhật badge trạng thái nếu vừa hết hạn
            const row = el.closest('tr');
            if (row) {
                const badge = row.querySelector('.status-badge');
                if (badge) {
                    const isNowExpired = now > expiry;
                    if (isNowExpired && badge.classList.contains('status-valid')) {
                        badge.className = 'status-badge status-expired';
                        badge.innerText = 'Expired';
                    } else if (!isNowExpired && badge.classList.contains('status-expired')) {
                        badge.className = 'status-badge status-valid';
                        badge.innerText = 'Live';
                    }
                }
            }
        });

        // Cập nhật thống kê tổng quát
        keys.forEach(k => {
            if (now > k.expires) expiredCount++; else liveCount++;
        });
        if (document.getElementById('live-keys')) document.getElementById('live-keys').innerText = liveCount;
        if (document.getElementById('expired-keys')) document.getElementById('expired-keys').innerText = expiredCount;
        if (document.getElementById('total-keys')) document.getElementById('total-keys').innerText = keys.length;
    }, 1000);
});

function initShootingStars() {
    // Chỉ thêm nếu chưa có
    if (document.querySelector('.night')) return;

    const night = document.createElement('div');
    night.className = 'night';
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'shooting_star';
        night.appendChild(star);
    }
    document.body.prepend(night);
}

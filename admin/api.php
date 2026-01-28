<?php
 //  Share Source by PQM
 // Tham gia giao lưu, trao đổi và hỗ trợ tại Discord:
 // https://discord.gg/Bjb7EvsA 

// Tên file lưu trữ dữ liệu (nên đổi tên khó đoán hoặc chặn truy cập direct)
$storage_file = 'data_keys_secure.json';

// Thiết lập header trả về JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Hỗ trợ gọi từ Tool C#

$action = $_GET['action'] ?? '';

// 1. Hành động: VERIFY (Dùng cho CronTool)
if ($action === 'verify') {
    $key_to_check = $_GET['key'] ?? '';
    
    if (empty($key_to_check)) {
        echo json_encode(['status' => 'error', 'message' => 'Missing Key']);
        exit;
    }

    if (!file_exists($storage_file)) {
        echo json_encode(['status' => 'error', 'message' => 'No database found']);
        exit;
    }

    $keys = json_decode(file_get_contents($storage_file), true);
    if (!is_array($keys)) {
        echo json_encode(['status' => 'error', 'message' => 'Database corrupted']);
        exit;
    }

    $found_key = null;
    foreach ($keys as $k) {
        if ($k['code'] === $key_to_check) {
            $found_key = $k;
            break;
        }
    }

    if ($found_key) {
        $now = time() * 1000; // Đổi sang miliseconds để khớp với JS/C#
        if ($found_key['expires'] > $now) {
            echo json_encode([
                'status' => 'success',
                'user' => $found_key['user'],
                'expires' => $found_key['expires']
            ]);
        } else {
            echo json_encode(['status' => 'expired', 'message' => 'Key has expired']);
        }
    } else {
        echo json_encode(['status' => 'invalid', 'message' => 'Key not found']);
    }
    exit;
}

// 2. Hành động: SAVE (Dùng cho Admin Panel)
if ($action === 'save') {
    // Để bảo mật, chỉ admin mới được save. Ở đây có thể thêm password:
    // if ($_POST['secret'] !== 'MY_PASSWORD') die('Unauthorized');

    $json_input = file_get_contents('php://input');
    $data = json_decode($json_input, true);

    if (is_array($data)) {
        if (file_put_contents($storage_file, json_encode($data, JSON_PRETTY_PRINT))) {
            echo json_encode(['status' => 'success', 'message' => 'Data saved successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Cannot write to file']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid data format']);
    }
    exit;
}

// 3. Hành động mặc định (Khi user vào domain trực tiếp - Không hiển thị key)
echo json_encode([
    'status' => 'active',
    'system' => 'CronOS Activation Server',
    'time' => date('Y-m-d H:i:s'),
    'message' => 'Welcome. Please use proper API endpoints.'
]);

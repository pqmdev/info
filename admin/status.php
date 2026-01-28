<?php
 // Share Source by PQM
 // Tham gia giao lưu, trao đổi và hỗ trợ tại Discord:
 // https://discord.gg/Bjb7EvsA 

$storage_file = 'data_keys_secure.json';

header('Content-Type: text/html; charset=utf-8');

if (!file_exists($storage_file)) {
    die("Hệ thống chưa có dữ liệu Key.");
}

$keys = json_decode(file_get_contents($storage_file), true);
if (!is_array($keys)) {
    die("Dữ liệu bị lỗi.");
}

$now = time() * 1000;
$live = 0;
$expired = 0;

foreach ($keys as $k) {
    if ($k['expires'] > $now) {
        $live++;
    } else {
        $expired++;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Thống kê Key - CronOS</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0a0a0c; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #121216; padding: 30px; border-radius: 15px; border: 1px solid #23232d; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h2 { color: #00a3ff; margin-bottom: 20px; }
        .stat { font-size: 1.2em; margin: 10px 0; }
        .live { color: #00ff9d; font-weight: bold; }
        .expired { color: #ff3250; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h2>HỆ THỐNG CRONOS</h2>
        <div class="stat">Tổng số Key: <strong><?php echo count($keys); ?></strong></div>
        <div class="stat">Đang hoạt động: <span class="live"><?php echo $live; ?></span></div>
        <div class="stat">Đã hết hạn: <span class="expired"><?php echo $expired; ?></span></div>
        <hr style="border: 0; border-top: 1px solid #23232d; margin: 20px 0;">
        <div style="font-size: 0.8em; opacity: 0.5;">Cập nhật lúc: <?php echo date('H:i:s d/m/Y'); ?></div>
    </div>
</body>
</html>

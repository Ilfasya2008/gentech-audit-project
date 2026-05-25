<?php
require 'koneksi.php';

// Header keamanan & akses
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password);

    // Query pencarian user
    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            "status" => "success", 
            "message" => "Login berhasil",
            "role" => $user['role'],
            "name" => $user['name']
        ]);
    } else {
        // Balik ke pesan error formal
        echo json_encode([
            "status" => "error", 
            "message" => "Email atau password salah!"
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
}
?>
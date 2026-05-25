<?php
require 'koneksi.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->email) && isset($data->password)) {
    $name = $conn->real_escape_string($data->name);
    $email = $conn->real_escape_string($data->email);
    $password = $conn->real_escape_string($data->password); // Tips: Pakai password_hash() untuk real project

    // Cek apakah email sudah terdaftar
    $checkEmail = $conn->query("SELECT email FROM users WHERE email='$email'");
    
    if ($checkEmail->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email sudah digunakan!"]);
    } else {
        // Masukkan ke database (role otomatis jadi 'user' sesuai default DB kita)
        $sql = "INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$password', 'user')";
        
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Akun berhasil dibuat"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mendaftarkan akun"]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
}
?>
//test
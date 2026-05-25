<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "database_gentech"; // <-- GANTI JADI INI

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Koneksi Gagal: " . $conn->connect_error]));
}
?>
<?php

use App\Models\Module;

Module::truncate();

Module::create([
    'title' => 'Pengenalan Web3 & Smart Contract',
    'duration' => '15 Menit',
    'description' => 'Pelajari konsep dasar Web3, desentralisasi, dan bagaimana Smart Contract bekerja di atas blockchain Ethereum.',
    'status' => 'published',
    'topics' => json_encode(['Desentralisasi', 'EVM', 'Keamanan Dasar']),
    'content' => json_encode([
        [
            'heading' => 'Apa itu Web3?',
            'text' => 'Web3 adalah generasi ketiga dari layanan internet untuk situs web dan aplikasi yang akan fokus pada pemahaman data berbasis mesin untuk memberikan web semantik yang terdesentralisasi.'
        ],
        [
            'heading' => 'Mengenal Smart Contract',
            'text' => 'Smart contract adalah program komputer yang secara otomatis mengeksekusi, mengontrol, atau mendokumentasikan peristiwa dan tindakan yang relevan secara hukum berdasarkan ketentuan kontrak atau perjanjian.'
        ]
    ])
]);

Module::create([
    'title' => 'Dasar-Dasar Audit Digital',
    'duration' => '20 Menit',
    'description' => 'Memahami metodologi audit digital, cara membaca transaksi on-chain, dan mendeteksi anomali pada smart contract.',
    'status' => 'published',
    'topics' => json_encode(['On-chain Analysis', 'Vulnerability', 'Metodologi Audit']),
    'content' => json_encode([
        [
            'heading' => 'Metodologi Audit',
            'text' => 'Audit digital melibatkan pemindaian kode otomatis, analisis statis, dan peninjauan kode manual baris demi baris untuk menemukan kerentanan seperti Reentrancy dan Overflow.'
        ],
        [
            'heading' => 'Membaca Transaksi On-chain',
            'text' => 'Melalui block explorer seperti Etherscan, auditor dapat menelusuri aliran dana, melihat input data (calldata), dan mengidentifikasi fungsi apa saja yang dipanggil oleh peretas.'
        ]
    ])
]);

Module::create([
    'title' => 'Investigasi & Pelaporan',
    'duration' => '30 Menit',
    'description' => 'Langkah-langkah menyusun laporan audit yang profesional dan mudah dipahami, serta cara mempresentasikan temuan kritis.',
    'status' => 'published',
    'topics' => json_encode(['Report Formatting', 'Risk Assessment', 'Executive Summary']),
    'content' => json_encode([
        [
            'heading' => 'Struktur Laporan Audit',
            'text' => 'Laporan yang baik harus memiliki Executive Summary, daftar kerentanan yang ditemukan beserta tingkat keparahannya (Critical, High, Medium, Low), dan rekomendasi perbaikan.'
        ],
        [
            'heading' => 'Menilai Risiko',
            'text' => 'Setiap temuan harus dinilai berdasarkan Likelihood (kemungkinan eksploitasi) dan Impact (dampak kerugian). Keduanya menentukan tingkat keparahan akhir.'
        ]
    ])
]);

echo "Modules seeded successfully!\n";

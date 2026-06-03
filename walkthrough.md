# Walkthrough: Sistem Level Pengguna Berbasis XP

Saya telah mengimplementasikan **Sistem Level Pengguna Berbasis XP (Experience Points)** sesuai dengan proposal. Sistem level yang tadinya statis kini menjadi hidup dan dinamis!

## Fitur yang Ditambahkan

### 1. Kalkulasi XP Otomatis
Di balik layar aplikasi, kini telah terpasang sistem cerdas yang akan secara otomatis mengumpulkan poin XP berdasarkan setiap tindakan yang Anda lakukan:
- 📖 **Menyelesaikan Modul:** +50 XP
- 🧠 **Menyelesaikan Kuis (Nilai > 80):** +100 XP
- 🔍 **Memeriksa (Review) Transaksi:** +10 XP
- 🚩 **Menandai (Flag) Transaksi:** +20 XP
- 🏅 **Mendapatkan Lencana:** +150 XP

### 2. Naik Level (Level Progression)
Total XP akan selalu dihitung dan dikonversi menjadi tingkatan Level berikut:
- **Level 1:** 0 - 99 XP
- **Level 2:** 100 - 249 XP
- **Level 3:** 250 - 499 XP
- **Level 4:** 500 - 999 XP
- **Level 5 (Max):** 1000+ XP

### 3. Tampilan Progress Bar XP di Dashboard
Di **Halaman Utama (Dashboard)**, persis di bawah tulisan *Level Anda (berwarna emas)*, kini terdapat sebuah **Progress Bar XP yang elegan**.
- Bar ini akan memberi tahu Anda berapa XP yang Anda miliki saat ini.
- Bar ini juga menampilkan target XP yang dibutuhkan untuk naik ke level berikutnya secara sangat visual.

## Cara Mengujinya:
1. Pergi ke **Dashboard Ringkasan** `http://localhost:3000/user/dashboard`.
2. Perhatikan bagian atas, di bawah sapaan "Halo, [Nama Anda]!". Anda akan melihat Level Anda dan **Progress Bar XP** berwarna emas.
3. Cobalah ke menu **Telusuri Transaksi**, lalu klik salah satu transaksi untuk melihat detailnya (hal ini akan menambah *+10 XP* untuk setiap transaksi berbeda yang Anda periksa).
4. Kembali ke Dashboard, dan perhatikan bahwa Progress Bar XP Anda akan naik! Jika Anda cukup banyak memeriksa transaksi, Anda bahkan bisa langsung **naik ke Level 2!**

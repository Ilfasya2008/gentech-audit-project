<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Faq;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Apa itu GenTech Audit?',
                'answer' => 'GenTech Audit adalah platform pembelajaran interaktif yang dirancang khusus untuk membantu Anda memahami dasar-dasar Blockchain dan melakukan simulasi audit aset digital secara praktis.'
            ],
            [
                'question' => 'Bagaimana cara mulai belajar?',
                'answer' => 'Anda bisa memulai dari menu "Pelajaran" di Dashboard. Silakan baca materi yang disediakan dan tekan tombol "Tandai Selesai" pada setiap halaman modul untuk mencatat progres Anda.'
            ],
            [
                'question' => 'Bagaimana cara mendapatkan XP (Experience Points) dan naik Level?',
                'answer' => 'Anda akan mendapatkan XP setiap kali menyelesaikan Modul Belajar, menjawab pertanyaan Kuis dengan benar, atau berhasil mengaudit transaksi. Semakin banyak aktivitas positif yang Anda lakukan, semakin tinggi level akun Anda!'
            ],
            [
                'question' => 'Apa fungsi dari menu "Telusuri Transaksi"?',
                'answer' => 'Menu "Telusuri Transaksi" adalah tempat Anda berlatih menjadi auditor digital. Anda akan melihat daftar simulasi transaksi dari berbagai dompet (wallet). Tugas Anda adalah memeriksa riwayatnya dan menekan tombol "Tandai sebagai Mencurigakan (Flag)" jika Anda menemukan kejanggalan nominal atau pola transaksi berulang.'
            ],
            [
                'question' => 'Kenapa beberapa kuis saya tidak bisa diklik?',
                'answer' => 'Kuis dan modul dirancang secara terurut. Anda harus menyelesaikan modul atau kuis sebelumnya untuk dapat membuka kunci kuis di tingkat selanjutnya. Pastikan Anda tidak melewatkan materi apapun!'
            ],
            [
                'question' => 'Bagaimana cara saya mendapatkan Badges (Lencana Pencapaian)?',
                'answer' => 'Badges akan otomatis diberikan oleh sistem saat Anda mencapai tonggak tertentu. Misalnya, Anda bisa mendapatkan badge khusus setelah menyelesaikan semua modul, mendapatkan nilai 100% pada kuis, atau berhasil mendeteksi transaksi berbahaya.'
            ]
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}

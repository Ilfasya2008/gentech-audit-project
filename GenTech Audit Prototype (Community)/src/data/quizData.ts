export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizType {
  id: string;
  title: string;
  description: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  estimatedMinutes: number;
  icon: 'brain' | 'shield' | 'search';
  color: string;
  questions: QuizQuestion[];
}

export const quizTypes: QuizType[] = [
  {
    id: 'blockchain-basics',
    title: 'Dasar Blockchain',
    description: 'Konsep fundamental blockchain, hash, dan konsensus',
    difficulty: 'Pemula',
    estimatedMinutes: 8,
    icon: 'brain',
    color: 'from-indigo-500 to-indigo-600',
    questions: [
      {
        id: 1,
        question: 'Apa karakteristik utama dari teknologi blockchain?',
        options: [
          'Tersentralisasi dan dapat diubah',
          'Desentralisasi, transparan, dan immutable',
          'Privat dan rahasia',
          'Memerlukan server pusat',
        ],
        correctAnswer: 1,
        explanation:
          'Blockchain memiliki tiga karakteristik utama: desentralisasi, transparansi, dan immutability (data tidak dapat diubah setelah tercatat).',
      },
      {
        id: 2,
        question: 'Apa fungsi utama hash dalam blockchain?',
        options: [
          'Menyimpan password pengguna',
          'Mengenkripsi data pribadi',
          'Mengamankan blok dan menghubungkan blok dalam chain',
          'Mempercepat transaksi',
        ],
        correctAnswer: 2,
        explanation:
          'Hash function mengubah data menjadi string dengan panjang tetap dan menghubungkan setiap blok dalam chain.',
      },
      {
        id: 3,
        question: 'Apa yang dimaksud dengan mekanisme konsensus dalam blockchain?',
        options: [
          'Cara untuk menghapus transaksi lama',
          'Protokol agar semua node setuju tentang keadaan ledger',
          'Metode untuk mengenkripsi data',
          'Sistem untuk membuat password',
        ],
        correctAnswer: 1,
        explanation:
          'Mekanisme konsensus memastikan semua node setuju tentang keadaan ledger dan mencegah double-spending.',
      },
      {
        id: 4,
        question: 'Mengapa blockchain cocok untuk audit trail?',
        options: [
          'Karena data dapat dihapus kapan saja',
          'Karena hanya admin yang bisa melihat transaksi',
          'Karena menyediakan catatan lengkap yang tidak dapat dimanipulasi',
          'Karena lebih murah dari sistem tradisional',
        ],
        correctAnswer: 2,
        explanation:
          'Semua transaksi tercatat permanen dengan timestamp dan tidak dapat diubah, ideal untuk audit trail.',
      },
      {
        id: 5,
        question: 'Apa yang harus diperhatikan auditor saat memeriksa transaksi blockchain?',
        options: [
          'Hanya memeriksa nilai transaksi',
          'Hash, signature, konfirmasi blok, dan pola transaksi',
          'Nama pemilik akun',
          'Lokasi geografis pengirim',
        ],
        correctAnswer: 1,
        explanation:
          'Auditor harus memeriksa hash, digital signature, konfirmasi blok, dan pola transaksi untuk mendeteksi anomali.',
      },
    ],
  },
  {
    id: 'digital-audit',
    title: 'Audit Digital',
    description: 'Prinsip audit digital dan verifikasi berbasis blockchain',
    difficulty: 'Menengah',
    estimatedMinutes: 6,
    icon: 'shield',
    color: 'from-purple-500 to-purple-600',
    questions: [
      {
        id: 1,
        question: 'Apa keunggulan audit berbasis blockchain dibanding audit tradisional?',
        options: [
          'Lebih mahal dan rumit',
          'Hanya bisa dilakukan sekali',
          'Real-time verification dan trail audit permanen',
          'Memerlukan lebih banyak auditor',
        ],
        correctAnswer: 2,
        explanation:
          'Audit blockchain memungkinkan verifikasi real-time dan trail audit permanen yang transparan.',
      },
      {
        id: 2,
        question: 'Dalam audit digital, "immutability" berarti:',
        options: [
          'Data dapat diubah oleh admin kapan saja',
          'Data yang tercatat tidak dapat diubah tanpa terdeteksi',
          'Transaksi bersifat rahasia',
          'Ledger disimpan di satu server',
        ],
        correctAnswer: 1,
        explanation:
          'Immutability memastikan integritas catatan audit karena perubahan akan terlihat di chain.',
      },
      {
        id: 3,
        question: 'Smart contract dalam konteks audit adalah:',
        options: [
          'Kontrak kertas yang dipindai',
          'Program yang berjalan otomatis di blockchain',
          'Laporan audit tahunan',
          'Database Excel perusahaan',
        ],
        correctAnswer: 1,
        explanation:
          'Smart contract adalah program self-executing yang berjalan otomatis ketika kondisi tertentu terpenuhi.',
      },
      {
        id: 4,
        question: 'Evidence gathering pada audit blockchain biasanya mencakup:',
        options: [
          'Hanya screenshot aplikasi',
          'Hash transaksi, block height, dan timestamp',
          'Surat izin usaha saja',
          'Laporan laba rugi tanpa transaksi',
        ],
        correctAnswer: 1,
        explanation:
          'Bukti audit blockchain mencakup hash, block height, timestamp, dan metadata transaksi on-chain.',
      },
    ],
  },
  {
    id: 'transaction-audit',
    title: 'Analisis Transaksi',
    description: 'Mengidentifikasi red flag dan pola transaksi mencurigakan',
    difficulty: 'Lanjutan',
    estimatedMinutes: 7,
    icon: 'search',
    color: 'from-pink-500 to-pink-600',
    questions: [
      {
        id: 1,
        question: 'Red flag dalam analisis transaksi blockchain meliputi:',
        options: [
          'Transaksi dengan timestamp normal',
          'Alamat yang terverifikasi resmi',
          'Nilai tidak wajar dan pola transfer mencurigakan',
          'Gas fee standar industri',
        ],
        correctAnswer: 2,
        explanation:
          'Nilai tidak wajar, pola transfer anomalous, dan alamat berisiko tinggi adalah red flags utama.',
      },
      {
        id: 2,
        question: 'Status transaksi "pending" dalam simulasi audit berarti:',
        options: [
          'Transaksi sudah final di blockchain',
          'Transaksi belum dikonfirmasi sepenuhnya',
          'Transaksi pasti penipuan',
          'Transaksi tidak perlu ditinjau',
        ],
        correctAnswer: 1,
        explanation:
          'Pending berarti transaksi belum mendapat konfirmasi blok yang cukup dan perlu monitoring lanjutan.',
      },
      {
        id: 3,
        question: 'Saat menandai (flag) transaksi, auditor harus:',
        options: [
          'Menghapus transaksi dari blockchain',
          'Mencatat alasan dan bukti pendukung',
          'Mengubah hash transaksi',
          'Menutup semua transaksi serupa otomatis',
        ],
        correctAnswer: 1,
        explanation:
          'Flagging memerlukan dokumentasi alasan dan bukti agar temuan audit dapat diverifikasi.',
      },
      {
        id: 4,
        question: 'Gas fee yang sangat rendah atau sangat tinggi bisa mengindikasikan:',
        options: [
          'Transaksi selalu sah',
          'Potensi anomali atau manipulasi prioritas',
          'Tidak relevan untuk audit',
          'Hanya masalah akuntansi',
        ],
        correctAnswer: 1,
        explanation:
          'Gas fee di luar pola normal dapat mengindikasikan anomali teknis atau upaya menyembunyikan aktivitas.',
      },
      {
        id: 5,
        question: 'Langkah pertama saat menemukan transaksi mencurigakan adalah:',
        options: [
          'Langsung hapus dari sistem',
          'Verifikasi hash, alamat, dan konteks transaksi',
          'Abaikan jika nilainya kecil',
          'Ubah status menjadi success',
        ],
        correctAnswer: 1,
        explanation:
          'Verifikasi hash, alamat pengirim/penerima, dan konteks bisnis adalah langkah audit standar.',
      },
    ],
  },
];

export function getQuizById(id: string): QuizType | undefined {
  return quizTypes.find(q => q.id === id);
}

export function getOverallQuizScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, s) => sum + s, 0) / values.length);
}

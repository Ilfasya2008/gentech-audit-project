import { ArrowLeft, FileText, Download, Flag, CheckCircle, AlertTriangle, Calendar, Hash, Building2, TrendingUp, Shield } from 'lucide-react';
import { FlaggedTransaction } from '../App';
import { motion } from 'motion/react';

interface AuditReportProps {
  flaggedTransactions: FlaggedTransaction[];
  onBack: () => void;
  onViewDashboard: () => void;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export function AuditReport({ flaggedTransactions, onBack, onViewDashboard }: AuditReportProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalValue = flaggedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const criticalCount = flaggedTransactions.filter(tx => tx.amount > 100000000).length;

  const handleDownload = () => {
    // Sembunyikan elemen yang tidak perlu saat di-print
    const actionButtons = document.getElementById('report-action-buttons');
    if (actionButtons) actionButtons.style.display = 'none';
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) downloadButton.style.display = 'none';

    // Ubah title sementara agar nama file PDF default menjadi bagus
    const originalTitle = document.title;
    document.title = `Laporan Audit Digital GenTech Audit - ${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}`;

    // Tambahkan style print sementara untuk memastikan background tercetak
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { margin: 0; }
        #root { padding: 20px; }
      }
    `;
    document.head.appendChild(style);

    // Buka dialog print bawaan browser (User bisa "Save as PDF")
    window.print();

    // Tampilkan kembali tombol setelah print dialog ditutup
    if (actionButtons) actionButtons.style.display = 'flex';
    if (downloadButton) downloadButton.style.display = 'block';
    document.head.removeChild(style);
    document.title = originalTitle; // Kembalikan title semula
  };

  return (
    <div className="h-full bg-slate-50/50 overflow-y-auto relative pb-10">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none" />

      {/* Sticky Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 p-4 sm:p-6 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mb-0.5">Laporan Audit Digital</h1>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">GenTech Audit Platform</p>
          </div>
        </div>
        <button
          id="download-button"
          onClick={handleDownload}
          className="p-3 bg-white border border-slate-200/80 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm text-slate-500"
          title="Unduh PDF"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div id="audit-report-content" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        
        {/* Info Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tanggal</span>
            </div>
            <div className="font-bold text-slate-800">{currentDate}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Auditor</span>
            </div>
            <div className="font-bold text-slate-800">Tim GenTech</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Review</span>
            </div>
            <div className="font-bold text-slate-800">{flaggedTransactions.length} Transaksi</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
            </div>
            <div className="font-bold text-emerald-600">Selesai</div>
          </div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden"
        >
          <div className="border-b border-slate-100 p-6 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><FileText className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-slate-800">Ringkasan Eksekutif</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Audit ini dilakukan terhadap transaksi blockchain untuk mengidentifikasi aktivitas yang memerlukan 
              perhatian khusus. Berdasarkan analisis yang telah diselesaikan, ditemukan <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{flaggedTransactions.length} transaksi</strong> yang ditandai untuk review investigasi lebih lanjut.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 border border-orange-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Flag className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-black text-orange-900">{flaggedTransactions.length}</div>
                  <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">Flagged</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-5 border border-rose-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><AlertTriangle className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-black text-rose-900">{criticalCount}</div>
                  <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">Kritis</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100/50 rounded-2xl p-5 border border-indigo-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <div className="text-lg md:text-xl font-black text-indigo-900 truncate">{formatRupiah(totalValue)}</div>
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Total Nilai</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Findings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden"
        >
          <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl"><Flag className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-slate-800">Rincian Temuan Audit</h2>
            </div>
          </div>

          <div className="p-6">
            {flaggedTransactions.length === 0 ? (
              <div className="bg-emerald-50 rounded-3xl p-12 text-center border-2 border-emerald-100 border-dashed">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Tidak Ada Temuan Mencurigakan</h3>
                <p className="text-emerald-700 font-medium">
                  Belum ada transaksi yang Anda tandai. Lanjutkan eksplorasi untuk memulai simulasi audit.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {flaggedTransactions.map((tx, index) => (
                  <div key={tx.id} className="relative bg-white rounded-3xl p-6 border-2 border-orange-200/60 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 text-white font-black text-lg rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">Temuan Transaksi</h3>
                          <span className={`mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${
                            tx.amount > 100000000 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tx.amount > 100000000 ? 'Risiko Tinggi' : 'Risiko Menengah'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nilai Transaksi</div>
                        <div className="font-black text-xl text-slate-800">{formatRupiah(tx.amount)}</div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Flow */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pengirim</div>
                            <div className="font-bold text-slate-800">{tx.from}</div>
                          </div>
                        </div>
                        <div className="w-0.5 h-6 bg-slate-200 ml-4 rounded-full" />
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Penerima</div>
                            <div className="font-bold text-slate-800">{tx.to}</div>
                          </div>
                        </div>
                      </div>

                      {/* Details & Note */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Hash Block</span>
                            <code className="text-slate-700 font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200">
                              {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                            </code>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Waktu Eksekusi</span>
                            <span className="font-bold text-slate-700">
                              {new Date(tx.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {tx.flagNote && (
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200/60">
                            <div className="flex items-center gap-2 text-orange-800 font-bold mb-2">
                              <FileText className="w-4 h-4" /> Catatan Auditor:
                            </div>
                            <p className="text-orange-900/80 text-sm font-medium leading-relaxed italic border-l-2 border-orange-300 pl-3">
                              "{tx.flagNote}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommendations & Conclusion Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-slate-800">Rekomendasi Tindakan</h2>
            </div>
            <ul className="space-y-4">
              {[
                'Verifikasi lebih lanjut transaksi > Rp 100 juta.',
                'Periksa pola berulang entitas terindikasi.',
                'Amankan log block terkait sebagai bukti forensik digital.',
                'Laporkan ke divisi kepatuhan (compliance) jika diperlukan.'
              ].map((rec, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i+1}</div>
                  <span className="text-slate-600 font-medium text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><Shield className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-slate-800">Kesimpulan Audit</h2>
            </div>
            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50 flex-1">
              <p className="text-indigo-900/80 font-medium text-sm leading-relaxed">
                Audit simulasi blockchain telah berhasil dilakukan memanfaatkan transparansi dan kekekalan (immutability) datanya. Transaksi yang terindikasi mencurigakan telah ditandai dengan baik dan siap untuk proses forensik selanjutnya.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          id="report-action-buttons" 
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <button
            onClick={onBack}
            className="px-6 py-4 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm border border-slate-200"
          >
            Kembali ke Penelusuran
          </button>
          <button
            onClick={onViewDashboard}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
          >
            Selesai & Kembali ke Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
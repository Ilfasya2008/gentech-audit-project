import { ArrowLeft, FileText, Download, Flag, CheckCircle, AlertTriangle, Calendar, Hash, Building2, TrendingUp } from 'lucide-react';
import { FlaggedTransaction } from '../App';

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
    <div className="h-full bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Sticky Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-sm mb-1">Laporan Audit Digital</h1>
              <p className="text-blue-100 font-medium tracking-wide text-sm">Audit Transaksi Blockchain</p>
            </div>
          </div>
          <button
            id="download-button"
            onClick={handleDownload}
            className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/30 transition shadow-sm"
          >
            <Download className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Stats Grid - 2x2 untuk mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Tanggal</div>
            <div className="text-white font-semibold text-sm">{currentDate}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Auditor</div>
            <div className="text-white font-semibold text-sm">GenTech Audit</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Review</div>
            <div className="text-white font-semibold text-sm">{flaggedTransactions.length} Transaksi</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
            <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Status</div>
            <div className="text-white font-semibold text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-300" /> Complete
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="audit-report-content" className="p-4 space-y-4">
        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-primary">Ringkasan Eksekutif</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Audit ini dilakukan terhadap transaksi blockchain untuk mengidentifikasi transaksi yang memerlukan 
            perhatian khusus. Berdasarkan analisis yang dilakukan, ditemukan <strong>{flaggedTransactions.length} transaksi</strong> yang ditandai untuk review lebih lanjut.
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Flag className="w-4 h-4" />
              </div>
              <div className="text-orange-900">{flaggedTransactions.length}</div>
              <div className="text-orange-700">Flagged</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-red-900">{criticalCount}</div>
              <div className="text-red-700">Critical</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-blue-900 text-xs">{formatRupiah(totalValue)}</div>
              <div className="text-blue-700">Total</div>
            </div>
          </div>
        </div>

        {/* Findings */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-5 h-5 text-orange-600" />
            <h2 className="text-primary">Temuan Audit</h2>
          </div>

          {flaggedTransactions.length === 0 ? (
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-green-900 mb-2">Tidak Ada Temuan</h3>
              <p className="text-green-700">
                Belum ada transaksi yang ditandai untuk review. Lanjutkan eksplorasi transaksi untuk memulai audit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedTransactions.map((tx, index) => (
                <div key={tx.id} className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-primary mb-1">
                          Temuan #{index + 1}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs inline-block ${
                          tx.amount > 100000000 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {tx.amount > 100000000 ? 'Critical' : 'Moderate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-white rounded-lg p-3 mb-3 border border-orange-200">
                    <div className="text-muted-foreground mb-1">Nilai Transaksi</div>
                    <div className="text-primary">{formatRupiah(tx.amount)}</div>
                  </div>

                  {/* Sender & Receiver */}
                  <div className="space-y-2 mb-3">
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Building2 className="w-4 h-4" />
                        <span>Pengirim</span>
                      </div>
                      <div className="text-primary">{tx.from}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Building2 className="w-4 h-4" />
                        <span>Penerima</span>
                      </div>
                      <div className="text-primary">{tx.to}</div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hash</span>
                      <code className="text-primary text-xs bg-white px-2 py-1 rounded border border-orange-200">
                        {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Block</span>
                      <span className="text-primary">#{tx.blockNumber.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Waktu</span>
                      <span className="text-primary">
                        {new Date(tx.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Flag Note */}
                  {tx.flagNote && (
                    <div className="mt-3 bg-white rounded-lg p-3 border border-orange-200">
                      <div className="text-orange-700 mb-1">📝 Catatan Audit:</div>
                      <p className="text-orange-900">{tx.flagNote}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-primary">Rekomendasi</h2>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 space-y-2">
            <div className="flex items-start gap-2 text-green-800">
              <span className="flex-shrink-0">1.</span>
              <span>Lakukan verifikasi lebih lanjut terhadap transaksi dengan nilai tinggi ({'>'} Rp 100 juta)</span>
            </div>
            <div className="flex items-start gap-2 text-green-800">
              <span className="flex-shrink-0">2.</span>
              <span>Periksa pola transaksi dari entitas yang sama untuk mendeteksi aktivitas tidak biasa</span>
            </div>
            <div className="flex items-start gap-2 text-green-800">
              <span className="flex-shrink-0">3.</span>
              <span>Verifikasi status konfirmasi blockchain untuk semua transaksi yang ditandai</span>
            </div>
            <div className="flex items-start gap-2 text-green-800">
              <span className="flex-shrink-0">4.</span>
              <span>Dokumentasikan temuan dan simpan bukti blockchain untuk referensi masa depan</span>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-primary mb-3">Kesimpulan</h2>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-blue-900">
              Audit blockchain telah berhasil dilakukan dengan memanfaatkan transparansi dan immutability 
              yang menjadi karakteristik teknologi blockchain. Semua transaksi yang ditandai telah 
              terverifikasi secara kriptografis dan tercatat permanen di blockchain, memberikan jejak 
              audit yang dapat diandalkan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              <div>GenTech Audit Platform</div>
              <div className="text-xs">{currentDate}</div>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="report-action-buttons" className="flex gap-3 pb-safe">
          <button
            onClick={onBack}
            className="px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm border border-gray-200"
          >
            Kembali
          </button>
          <button
            onClick={onViewDashboard}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            Lihat Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
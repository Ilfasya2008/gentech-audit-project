import { useState } from 'react';
import { ArrowLeft, Flag, Shield, Clock, Hash, ArrowRight, CheckCircle, AlertCircle, Building2, Landmark, ArrowRightLeft, Copy, Lightbulb } from 'lucide-react';
import { Transaction } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionDetailProps {
  transaction: Transaction;
  onFlag: (note: string) => void;
  onViewProof: () => void;
  onBack: () => void;
  isFlagged: boolean;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export function TransactionDetail({ transaction, onFlag, onViewProof, onBack, isFlagged }: TransactionDetailProps) {
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagNote, setFlagNote] = useState('');

  const handleFlag = () => {
    if (flagNote.trim()) {
      onFlag(flagNote);
      setShowFlagModal(false);
      setFlagNote('');
    }
  };

  return (
    <div className="h-full bg-slate-50/50 overflow-y-auto relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Detail Transaksi</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analisis Mendalam</p>
          </div>
        </div>
        <button
          onClick={onViewProof}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-indigo-500/10 border border-indigo-100/50"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Bukti Blockchain</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Status Banner */}
          <div className={`relative overflow-hidden rounded-2xl p-5 border shadow-sm ${
            transaction.status === 'success'
              ? 'bg-gradient-to-r from-emerald-50 to-green-50/30 border-emerald-200/60'
              : transaction.status === 'pending'
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50/30 border-amber-200/60'
              : 'bg-gradient-to-r from-rose-50 to-red-50/30 border-rose-200/60'
          }`}>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-full shadow-sm ${
                transaction.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                transaction.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {transaction.status === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <h2 className={`font-bold text-lg ${
                  transaction.status === 'success' ? 'text-emerald-900' :
                  transaction.status === 'pending' ? 'text-amber-900' : 'text-rose-900'
                }`}>
                  {transaction.status === 'success' ? 'Transaksi Berhasil' :
                   transaction.status === 'pending' ? 'Menunggu Konfirmasi' : 'Transaksi Gagal'}
                </h2>
                <p className={`text-sm font-medium ${
                  transaction.status === 'success' ? 'text-emerald-700' :
                  transaction.status === 'pending' ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {transaction.status === 'success' ? 'Tercatat aman di blockchain' :
                   transaction.status === 'pending' ? 'Sedang diproses oleh jaringan' : 'Tidak berhasil diproses'}
                </p>
              </div>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/40 blur-3xl" />
          </div>

          {/* Amount Card - Premium */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="text-indigo-100 font-medium tracking-wide mb-2 flex items-center gap-2">
                  <Landmark className="w-4 h-4" /> Nilai Transaksi
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                  {formatRupiah(transaction.amount)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
                <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Block Number</div>
                <div className="text-xl font-mono font-bold text-white tracking-wide">
                  #{transaction.blockNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Flow & Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Flow */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-500" /> Alur Pemindahan Dana
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                {/* Connecting Line for MD+ */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10" />
                
                {/* Sender */}
                <div className="w-full md:w-2/5 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">Entitas Pengirim</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800 pl-11">
                    {transaction.from}
                  </div>
                </div>

                {/* Arrow */}
                <div className="w-12 h-12 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm z-10 my-2 md:my-0">
                  <ArrowRight className="w-5 h-5 text-slate-400 md:rotate-0 rotate-90" />
                </div>

                {/* Receiver */}
                <div className="w-full md:w-2/5 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 text-slate-500 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">Entitas Penerima</span>
                  </div>
                  <div className="text-lg font-bold text-slate-800 pl-11">
                    {transaction.to}
                  </div>
                </div>
              </div>
            </div>

            {/* Hash & Technicals */}
            <div className="space-y-6">
              {/* Hash */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" /> Transaction Hash
                  </h3>
                  <button className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 bg-slate-50 hover:bg-blue-50 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <code className="block text-sm font-mono text-slate-600 break-all bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {transaction.hash}
                </code>
              </div>

              {/* Gas & Time */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Informasi Teknis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">Waktu Eksekusi</span>
                    <span className="text-sm font-bold text-slate-800">
                      {new Date(transaction.timestamp).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-500">Gas Used</span>
                    <span className="text-sm font-bold text-slate-800">{transaction.gasUsed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit & Tips */}
            <div className="space-y-6">
              {/* Flag Action */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" /> Tindakan Auditor
                </h3>
                {isFlagged ? (
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-orange-700 font-bold mb-2">
                      <Flag className="w-5 h-5 fill-current" />
                      <span>Sudah Ditandai (Flagged)</span>
                    </div>
                    <p className="text-sm text-orange-800/80 font-medium">
                      Transaksi ini telah ditandai untuk review investigasi lanjutan.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowFlagModal(true)}
                    className="w-full group relative overflow-hidden flex items-center justify-center gap-2 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <Flag className="w-5 h-5" />
                    <span className="font-bold">Tandai Transaksi Mencurigakan</span>
                  </button>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-6 border border-blue-100/50">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Tips Analisis
                </h4>
                <ul className="space-y-3">
                  {['Periksa kewajaran nilai transaksi terhadap profil pengguna', 'Verifikasi status konfirmasi di block explorer', 'Perhatikan pola waktu transaksi berulang', 'Cek rekam jejak identitas pengirim dan penerima'].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                      <span className="text-sm font-medium text-blue-800/80 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Flag Modal */}
      <AnimatePresence>
        {showFlagModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Tandai Transaksi</h3>
              <p className="text-slate-500 text-sm mb-6">
                Tambahkan catatan untuk transaksi ini. Jelaskan mengapa transaksi ini perlu ditandai untuk review audit lanjutan.
              </p>
              
              <textarea
                value={flagNote}
                onChange={(e) => setFlagNote(e.target.value)}
                placeholder="Contoh: Nilai transaksi tidak wajar, melebihi threshold normal..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-orange-500 outline-none resize-none transition-colors text-slate-700"
                rows={4}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowFlagModal(false);
                    setFlagNote('');
                  }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleFlag}
                  disabled={!flagNote.trim()}
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    flagNote.trim()
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  Simpan Tanda
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

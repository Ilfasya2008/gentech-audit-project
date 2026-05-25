import { useState } from 'react';
import { ArrowLeft, Flag, Shield, Clock, Hash, User, ArrowRight, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { Transaction } from '../App';

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
    <div className="h-full bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary mb-1">Detail Transaksi</h1>
            <p className="text-muted-foreground">Analisis mendalam</p>
          </div>
          <button
            onClick={onViewProof}
            className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <Shield className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <div className={`rounded-2xl p-4 border-2 ${
          transaction.status === 'success'
            ? 'bg-green-50 border-green-200'
            : transaction.status === 'pending'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {transaction.status === 'success' ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-green-900">Transaksi Berhasil</div>
                  <div className="text-green-700">
                    Tercatat di blockchain
                  </div>
                </div>
              </>
            ) : transaction.status === 'pending' ? (
              <>
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <div className="text-yellow-900">Menunggu Konfirmasi</div>
                  <div className="text-yellow-700">
                    Sedang diproses
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-red-900">Transaksi Gagal</div>
                  <div className="text-red-700">
                    Tidak berhasil diproses
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-blue-100 mb-2">Nilai Transaksi</div>
          <div className="text-white mb-1">
            {formatRupiah(transaction.amount)}
          </div>
          <div className="text-blue-100">
            Block #{transaction.blockNumber.toLocaleString()}
          </div>
        </div>

        {/* Transaction Flow */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-primary mb-4">Alur Transaksi</h3>
          
          <div className="space-y-3">
            {/* Sender */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span>Pengirim</span>
              </div>
              <div className="text-primary">
                {transaction.from}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span>Penerima</span>
              </div>
              <div className="text-primary">
                {transaction.to}
              </div>
            </div>
          </div>
        </div>

        {/* Hash */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Hash className="w-4 h-4" />
            <span>Transaction Hash</span>
          </div>
          <code className="text-primary text-xs break-all bg-gray-50 p-3 rounded-lg block">
            {transaction.hash}
          </code>
        </div>

        {/* Time & Gas */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-primary mb-3">Informasi Teknis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Waktu</span>
              </div>
              <div className="text-primary text-right">
                {new Date(transaction.timestamp).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gas Used</span>
              <span className="text-primary">{transaction.gasUsed.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Flag Action */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-primary mb-3">Audit Action</h3>
          {isFlagged ? (
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Flag className="w-5 h-5" />
                <span>Sudah Ditandai</span>
              </div>
              <p className="text-orange-600">
                Transaksi ini telah ditandai untuk review audit
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowFlagModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow-md"
            >
              <Flag className="w-5 h-5" />
              Tandai Transaksi
            </button>
          )}
        </div>

        {/* Analysis Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <h4 className="text-primary mb-3">💡 Tips Audit</h4>
          <ul className="space-y-2 text-blue-800">
            <li>• Periksa kewajaran nilai transaksi</li>
            <li>• Verifikasi status konfirmasi</li>
            <li>• Perhatikan pola waktu transaksi</li>
            <li>• Cek identitas pengirim dan penerima</li>
          </ul>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-primary mb-4">Tandai Transaksi</h3>
            <p className="text-muted-foreground mb-4">
              Tambahkan catatan untuk transaksi ini. Jelaskan mengapa transaksi ini perlu ditandai untuk review audit.
            </p>
            
            <textarea
              value={flagNote}
              onChange={(e) => setFlagNote(e.target.value)}
              placeholder="Contoh: Nilai transaksi tidak wajar, melebihi threshold normal..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              rows={4}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagNote('');
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleFlag}
                disabled={!flagNote.trim()}
                className={`flex-1 py-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  flagNote.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Flag className="w-4 h-4" />
                Tandai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

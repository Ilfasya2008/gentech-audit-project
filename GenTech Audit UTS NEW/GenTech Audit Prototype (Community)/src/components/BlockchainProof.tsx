import { ArrowLeft, Shield, CheckCircle, Lock, FileText, Link2, Database } from 'lucide-react';
import { Transaction } from '../App';

interface BlockchainProofProps {
  transaction: Transaction;
  onBack: () => void;
  onGenerateReport: () => void;
}

export function BlockchainProof({ transaction, onBack, onGenerateReport }: BlockchainProofProps) {
  // Generate mock Merkle root and previous block hash
  const merkleRoot = '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  const previousBlockHash = '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  const blockHash = '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  const confirmations = transaction.status === 'success' ? 152 : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Detail Transaksi
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Bukti Blockchain</h1>
              <p className="text-gray-600">Verifikasi kriptografis transaksi</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-green-900 mb-1">Transaksi Terverifikasi</h3>
              <p className="text-green-700">
                Transaksi ini telah diverifikasi oleh {confirmations} konfirmasi blok dan tercatat secara permanen di blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Proof Cards */}
        <div className="space-y-6 mb-6">
          {/* Transaction Hash Proof */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Transaction Hash (ID Unik)</h3>
                <p className="text-gray-600 mb-3">
                  Hash unik yang mengidentifikasi transaksi ini di blockchain. Hash ini dihasilkan dari data transaksi menggunakan algoritma kriptografi.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <code className="text-gray-900 break-all">{transaction.hash}</code>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mb-1">Algorithm</div>
                <div className="text-blue-900">SHA-256</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mb-1">Length</div>
                <div className="text-blue-900">64 characters</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mb-1">Immutable</div>
                <div className="text-blue-900">Yes ✓</div>
              </div>
            </div>
          </div>

          {/* Block Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Informasi Blok</h3>
                <p className="text-gray-600 mb-3">
                  Transaksi ini tercatat dalam blok tertentu yang terhubung dengan blok sebelumnya, membentuk chain yang tidak dapat diubah.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-gray-600 mb-2">Block Number</div>
                <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                  <code className="text-gray-900">#{transaction.blockNumber.toLocaleString()}</code>
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Block Hash</div>
                <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                  <code className="text-gray-900 break-all">{blockHash}</code>
                </div>
              </div>

              <div>
                <div className="text-gray-600 mb-2">Previous Block Hash</div>
                <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                  <code className="text-gray-900 break-all">{previousBlockHash}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Merkle Proof */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Link2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Merkle Root</h3>
                <p className="text-gray-600 mb-3">
                  Merkle root adalah hash dari semua transaksi dalam blok. Ini memastikan integritas seluruh set transaksi dalam blok.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <code className="text-gray-900 break-all">{merkleRoot}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Status Konfirmasi</h3>
                <p className="text-gray-600 mb-4">
                  Setiap blok baru yang ditambahkan setelah blok transaksi ini memberikan satu konfirmasi tambahan, meningkatkan keamanan.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-green-600 mb-1">Total Confirmations</div>
                <div className="text-green-900">{confirmations} blocks</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-green-600 mb-1">Security Level</div>
                <div className="text-green-900">
                  {confirmations > 100 ? 'Very High ✓✓✓' : confirmations > 50 ? 'High ✓✓' : 'Standard ✓'}
                </div>
              </div>
            </div>

            {/* Confirmation Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Security Progress</span>
                <span>{Math.min(confirmations, 150)}/150 confirmations</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                  style={{ width: `${Math.min((confirmations / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
          <h3 className="text-blue-900 mb-3">🔐 Mengapa Bukti Ini Penting?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span><strong>Immutability:</strong> Hash kriptografis memastikan data tidak dapat diubah tanpa terdeteksi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span><strong>Transparency:</strong> Semua informasi dapat diverifikasi secara publik di blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span><strong>Auditability:</strong> Bukti kriptografis memberikan jejak audit yang sempurna</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">•</span>
              <span><strong>Trust:</strong> Tidak memerlukan pihak ketiga untuk verifikasi keaslian</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-md"
          >
            Kembali
          </button>
          <button
            onClick={onGenerateReport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            <FileText className="w-5 h-5" />
            Lihat Laporan Audit
          </button>
        </div>
      </div>
    </div>
  );
}
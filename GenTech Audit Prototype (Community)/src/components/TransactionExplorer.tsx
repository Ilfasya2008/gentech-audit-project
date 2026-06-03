import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ArrowUpDown, Flag, CheckCircle, Home, FileText, ChevronRight, ArrowRight, Activity, Clock, XCircle } from 'lucide-react';
import { Transaction, AppScreen } from '../App';
import { motion } from 'motion/react';

interface TransactionExplorerProps {
  onSelectTransaction: (transaction: Transaction) => void;
  onNavigate: (screen: AppScreen) => void;
  flaggedTransactions: Transaction[];
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x742d35cc6634c0532925a3b844bc9e7595f0e721',
    from: 'PT Maju Jaya',
    to: 'PT Sejahtera Mandiri',
    amount: 25000000,
    timestamp: '2024-12-02 14:23:15',
    blockNumber: 15678234,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '2',
    hash: '0x8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    from: 'CV Digital Teknologi',
    to: 'Yayasan Pendidikan Nusantara',
    amount: 150000000,
    timestamp: '2024-12-02 14:18:42',
    blockNumber: 15678233,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '3',
    hash: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    from: 'Toko Elektronik Jaya',
    to: 'Supplier ABC',
    amount: 500000,
    timestamp: '2024-12-02 13:55:28',
    blockNumber: 15678232,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '4',
    hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    from: 'PT Investasi Global',
    to: 'Dana Pensiun Mandiri',
    amount: 9999900000,
    timestamp: '2024-12-02 13:42:10',
    blockNumber: 15678231,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '5',
    hash: '0x9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    from: 'Koperasi Sejahtera',
    to: 'Anggota Koperasi - Ahmad',
    amount: 50250000,
    timestamp: '2024-12-02 13:30:55',
    blockNumber: 15678230,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '6',
    hash: '0x3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e',
    from: 'Yayasan Amal Sejahtera',
    to: 'Pembangunan Sekolah Desa',
    amount: 10000000000,
    timestamp: '2024-12-02 13:15:33',
    blockNumber: 15678229,
    gasUsed: 21000,
    status: 'success'
  },
  {
    id: '7',
    hash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
    from: 'Warung Makan Bu Siti',
    to: 'Supplier Sayuran Organik',
    amount: 1000000,
    timestamp: '2024-12-02 12:58:20',
    blockNumber: 15678228,
    gasUsed: 21000,
    status: 'pending'
  },
  {
    id: '8',
    hash: '0x2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f',
    from: 'PT Konstruksi Megah',
    to: 'Pemerintah Daerah Jakarta',
    amount: 7500000000,
    timestamp: '2024-12-02 12:45:12',
    blockNumber: 15678227,
    gasUsed: 21000,
    status: 'success'
  }
];

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export function TransactionExplorer({ onSelectTransaction, onNavigate, flaggedTransactions }: TransactionExplorerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/simulation-transactions');
        if (response.data.success && Array.isArray(response.data.data)) {
          const mapped = response.data.data.map((tx: any) => ({
            id: String(tx.id),
            hash: tx.hash,
            from: tx.from_entity,
            to: tx.to_entity,
            amount: Number(tx.amount),
            timestamp: tx.transaction_date,
            blockNumber: tx.block_number || 'N/A',
            gasUsed: Number(tx.gas_used),
            status: tx.status === 'success' || tx.status === 'pending' || tx.status === 'failed' ? tx.status : 'success'
          }));
          setTransactions(mapped);
        }
      } catch (error) {
        console.warn("Gagal mengambil transaksi dari Laravel API, menggunakan data mock lokal:", error);
      }
    };
    fetchTxs();
  }, []);

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <div className="h-full bg-slate-50/50 overflow-y-auto relative pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-8 py-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Telusuri Transaksi</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Simulasi Audit Blockchain</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('report')}
            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all relative border border-indigo-100/50 shadow-sm"
          >
            <FileText className="w-5 h-5" />
            {flaggedTransactions.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                {flaggedTransactions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200/50 shadow-sm"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{transactions.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{flaggedTransactions.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Flagged</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {transactions.filter(tx => tx.status === 'success').length}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Success</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {transactions.filter(tx => tx.status === 'pending').length}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">
                {transactions.filter(tx => tx.status === 'failed').length}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Failed</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Sort */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari hash, pengirim, atau penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider hidden md:block">Urutkan:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
              <button
                onClick={() => setSortBy('date')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  sortBy === 'date'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" /> Waktu
              </button>
              <button
                onClick={() => setSortBy('value')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  sortBy === 'value'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" /> Nilai
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction, i) => {
            const isFlagged = flaggedTransactions.some(tx => tx.id === transaction.id);

            return (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={transaction.id}
                onClick={() => onSelectTransaction(transaction)}
                className="w-full group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 text-left border border-slate-200/60 hover:border-indigo-200 flex flex-col md:flex-row gap-5 items-center justify-between"
              >
                {/* Status & Flags */}
                <div className="flex items-center gap-3 md:w-1/4 w-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    transaction.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    transaction.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {transaction.status === 'success' ? <CheckCircle className="w-6 h-6" /> :
                     transaction.status === 'failed' ? <XCircle className="w-6 h-6" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className={`font-bold ${
                      transaction.status === 'success' ? 'text-emerald-700' :
                      transaction.status === 'failed' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {transaction.status === 'success' ? 'Success' :
                       transaction.status === 'failed' ? 'Failed' : 'Pending'}
                    </div>
                    {isFlagged && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full w-max">
                        <Flag className="w-3 h-3" /> Flagged
                      </div>
                    )}
                  </div>
                </div>

                {/* From -> To */}
                <div className="flex-1 w-full md:px-6">
                  <div className="flex items-center justify-between md:justify-start gap-4 text-sm font-semibold text-slate-800">
                    <div className="truncate w-full md:w-auto">{transaction.from}</div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
                    <div className="truncate w-full md:w-auto text-right md:text-left">{transaction.to}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 font-mono truncate bg-slate-50 p-1.5 rounded-md inline-block">
                    {transaction.hash}
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-1/4 md:border-l border-slate-100 md:pl-6">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nilai</div>
                    <div className="font-black text-slate-800 text-lg">{formatRupiah(transaction.amount)}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-sm p-16 text-center border border-slate-200/60"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ditemukan</h3>
            <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

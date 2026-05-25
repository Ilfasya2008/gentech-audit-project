import { useState } from 'react';
import { Search, Filter, ArrowUpDown, Flag, CheckCircle, Home, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { Transaction, AppScreen } from '../App';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

  const filteredTransactions = mockTransactions
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
    <div className="h-full bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-primary">Telusuri Transaksi</h1>
            <p className="text-muted-foreground">Simulasi audit blockchain</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('report')}
              className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition relative"
            >
              <FileText className="w-5 h-5 text-primary" />
              {flaggedTransactions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {flaggedTransactions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <Home className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-blue-50 rounded-xl p-2 text-center border border-blue-100">
            <div className="text-primary">{mockTransactions.length}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-2 text-center border border-orange-100">
            <div className="text-orange-600">{flaggedTransactions.length}</div>
            <div className="text-muted-foreground">Flagged</div>
          </div>
          <div className="bg-green-50 rounded-xl p-2 text-center border border-green-100">
            <div className="text-green-600">
              {mockTransactions.filter(tx => tx.status === 'success').length}
            </div>
            <div className="text-muted-foreground">Success</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-2 text-center border border-yellow-100">
            <div className="text-yellow-600">
              {mockTransactions.filter(tx => tx.status === 'pending').length}
            </div>
            <div className="text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari hash, pengirim, atau penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Urutkan:</span>
            <button
              onClick={() => setSortBy('date')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                sortBy === 'date'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-muted-foreground'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              Waktu
            </button>
            <button
              onClick={() => setSortBy('value')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                sortBy === 'value'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-muted-foreground'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              Nilai
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.map(transaction => {
            const isFlagged = flaggedTransactions.some(tx => tx.id === transaction.id);

            return (
              <button
                key={transaction.id}
                onClick={() => onSelectTransaction(transaction)}
                className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 text-left border border-gray-100"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {transaction.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-yellow-500 rounded-full flex-shrink-0" />
                    )}
                    <span className={`${
                      transaction.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.status === 'success' ? 'Success' : 'Pending'}
                    </span>
                  </div>
                  {isFlagged && (
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-lg">
                      <Flag className="w-4 h-4" />
                      <span>Flagged</span>
                    </div>
                  )}
                </div>

                {/* From -> To */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <div>
                      <div className="text-muted-foreground">Pengirim</div>
                      <div className="text-primary">{transaction.from}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-1">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Penerima</div>
                      <div className="text-primary">{transaction.to}</div>
                    </div>
                  </div>
                </div>

                {/* Amount & Time */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-muted-foreground">Nilai Transaksi</div>
                    <div className="text-primary">{formatRupiah(transaction.amount)}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-primary mb-2">Tidak ada transaksi</h3>
            <p className="text-muted-foreground">Coba ubah kata kunci pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Landmark, 
  ArrowRightLeft,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';

interface Transaction {
  id: number;
  hash: string;
  from_entity: string;
  to_entity: string;
  amount: number;
  block_number: string;
  gas_used: number;
  status: 'success' | 'pending' | 'failed';
  transaction_date: string;
}

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    from_entity: '',
    to_entity: '',
    amount: 0,
    status: 'success' as 'success' | 'pending' | 'failed',
    gas_used: 21000,
    block_number: '',
    transaction_date: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/simulation-transactions');
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      from_entity: '',
      to_entity: '',
      amount: 0,
      status: 'success',
      gas_used: 21000,
      block_number: '',
      transaction_date: new Date().toISOString().substring(0, 16) // Format YYYY-MM-DDTHH:MM
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx: Transaction) => {
    setEditingId(tx.id);
    setFormData({
      from_entity: tx.from_entity,
      to_entity: tx.to_entity,
      amount: tx.amount,
      status: tx.status,
      gas_used: tx.gas_used || 21000,
      block_number: tx.block_number || '',
      transaction_date: tx.transaction_date ? new Date(tx.transaction_date).toISOString().substring(0, 16) : ''
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/simulation-transactions/${id}`);
        if (res.data.success) {
          fetchTransactions();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Gagal menghapus transaksi.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.from_entity || !formData.to_entity || formData.amount <= 0) {
      setErrorMsg("Pengirim, Penerima, dan Jumlah Transaksi wajib diisi dengan benar.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/simulation-transactions/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/simulation-transactions', formData);
      }
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const shortenHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.from_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.to_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.block_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Manajemen Simulasi Transaksi">
      {/* Search & Add Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengirim, penerima, block, atau hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm transition"
          />
        </div>
        <Button 
          onClick={handleOpenAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20 font-semibold text-sm h-11"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500">Memuat data transaksi...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">Tidak ada transaksi ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Tx Hash</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Pengirim & Penerima</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Uang</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Block</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {shortenHash(tx.hash)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-700">
                        <span className="font-semibold text-slate-800">{tx.from_entity}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{tx.to_entity}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tx.transaction_date ? new Date(tx.transaction_date).toLocaleString('id-ID') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm whitespace-nowrap">
                      {formatIDR(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-mono whitespace-nowrap">
                      #{tx.block_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-100">
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </span>
                      ) : tx.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-100">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(tx)} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Transaksi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(tx.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Transaksi Simulasi' : 'Tambah Transaksi Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Entitas Pengirim (From)</label>
                  <input 
                    type="text"
                    placeholder="Contoh: PT ABC" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.from_entity} 
                    onChange={e => setFormData({...formData, from_entity: e.target.value})} 
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Entitas Penerima (To)</label>
                  <input 
                    type="text"
                    placeholder="Contoh: PT XYZ" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.to_entity} 
                    onChange={e => setFormData({...formData, to_entity: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah Nominal (IDR)</label>
                  <input 
                    type="number"
                    min="1"
                    placeholder="Nominal transaksi" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} 
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Transaksi</label>
                  <select 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gas Used</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 21000" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.gas_used} 
                    onChange={e => setFormData({...formData, gas_used: parseInt(e.target.value) || 21000})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Block Number</label>
                  <input 
                    type="text"
                    placeholder="Opsional (Kosongkan untuk acak)" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.block_number} 
                    onChange={e => setFormData({...formData, block_number: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal Transaksi</label>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                  value={formData.transaction_date} 
                  onChange={e => setFormData({...formData, transaction_date: e.target.value})} 
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 text-slate-500 px-5"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                >
                  Simpan Transaksi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

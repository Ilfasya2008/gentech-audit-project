import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Shield, 
  User as UserIcon,
  X,
  Loader2,
  Eye,
  EyeOff,
  Award,
  BookOpen,
  Brain,
  FileText
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';
import { loadUserProgressByEmail, getCurrentUserEmail, setCurrentUserName } from '../../lib/userProgress';
import type { UserProgress } from '../../App';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // States untuk Detail User
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<{user: User, progress: UserProgress} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingId(user.id);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', // Kosongkan password saat edit kecuali ingin diubah
      role: user.role 
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (user: User) => {
    const progress = loadUserProgressByEmail(user.email);
    setSelectedUserDetails({ user, progress });
    setIsDetailModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/users/${id}`);
        if (res.data.success) {
          fetchUsers();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Gagal menghapus user.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi dasar
    if (!formData.name || !formData.email) {
      setErrorMsg("Nama dan Email wajib diisi");
      return;
    }
    if (!editingId && !formData.password) {
      setErrorMsg("Password wajib diisi untuk pengguna baru");
      return;
    }

    try {
      if (editingId) {
        // Update user
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await axios.put(`http://localhost:8000/api/users/${editingId}`, updateData);
        
        // Jika admin mengedit dirinya sendiri, update nama di localStorage juga
        if (formData.email === getCurrentUserEmail()) {
          setCurrentUserName(formData.name);
          // Force a small reload so the top right name updates immediately
          window.location.reload();
        }
      } else {
        // Create user
        await axios.post('http://localhost:8000/api/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Manajemen Pengguna">
      {/* Search & Add Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm transition"
          />
        </div>
        <Button 
          onClick={handleOpenAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20 font-semibold text-sm h-11"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500">Memuat data pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">Tidak ada data pengguna ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal Terdaftar</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isCurrentUser = user.email === getCurrentUserEmail();
                  return (
                  <tr key={user.id} className={`transition duration-150 ${isCurrentUser ? 'bg-blue-50/30 hover:bg-blue-50/60 border-l-4 border-l-blue-500' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 inline-block text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Anda
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                          <UserIcon className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDetailModal(user)} 
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Lihat Detail Progress"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(user)} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
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

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input 
                  type="text"
                  placeholder="Nama Lengkap" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email</label>
                <input 
                  type="email"
                  placeholder="name@example.com" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  {editingId && (
                    <span className="text-[10px] text-slate-400 italic font-medium">Biarkan kosong jika tidak ingin diubah</span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder={editingId ? "••••••••" : "Masukkan password (min. 6 karakter)"} 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 pr-10 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required={!editingId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role/Akses</label>
                <select 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal (Progress & Stats) */}
      {isDetailModalOpen && selectedUserDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-white shadow-inner">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white drop-shadow-sm">{selectedUserDetails.user.name}</h2>
                  <p className="text-blue-100 text-sm">{selectedUserDetails.user.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 bg-slate-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status Pengguna</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                      {selectedUserDetails.user.role === 'admin' ? (
                        <Shield className="w-3.5 h-3.5 text-purple-500" />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      {selectedUserDetails.user.role.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
                      Bergabung: {new Date(selectedUserDetails.user.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
                  <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Level</p>
                    <p className="text-2xl font-extrabold text-indigo-600">{selectedUserDetails.progress.level || 1}</p>
                  </div>
              </div>

              {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modul Selesai</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">
                      {selectedUserDetails.progress.completedModules || 0}
                      <span className="text-lg text-slate-400">/{selectedUserDetails.progress.totalModules || 1}</span>
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skor Kuis</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">
                      {selectedUserDetails.progress.quizScore || 0}%
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="text-xs font-bold text-slate-500 tracking-wider">TRANSAKSI DITANDAI</div>
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        {selectedUserDetails.progress?.transactionsFlagged || 0}
                      </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badges</p>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">
                      {selectedUserDetails.progress.badges?.length || 0}
                    </p>
                  </div>
                </div>
              
            </div>
            
            <div className="p-6 bg-white border-t border-slate-100 text-center">
              <Button onClick={() => setIsDetailModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition">Tutup Detail</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

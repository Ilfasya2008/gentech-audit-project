import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Landmark, 
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';
import { getCurrentUserName } from '../../lib/userProgress';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    users: 0,
    modules: 0,
    quizzes: 0,
    transactions: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [usersRes, modulesRes, quizzesRes, txRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users'),
        axios.get('http://localhost:8000/api/modules'),
        axios.get('http://localhost:8000/api/quizzes'),
        axios.get('http://localhost:8000/api/simulation-transactions')
      ]);

      setStats({
        users: usersRes.data.data?.length || 0,
        modules: modulesRes.data.data?.length || 0,
        quizzes: quizzesRes.data.data?.length || 0,
        transactions: txRes.data.data?.length || 0
      });
      setApiStatus('online');
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Pengguna',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
      description: 'Pengguna terdaftar di database',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Modul Belajar',
      value: stats.modules,
      icon: BookOpen,
      color: 'bg-green-500/10 text-green-600 border-green-200/50',
      description: 'Modul materi audit blockchain',
      action: () => navigate('/admin/modules')
    },
    {
      title: 'Bank Kuis',
      value: stats.quizzes,
      icon: HelpCircle,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
      description: 'Set kumpulan evaluasi kuis',
      action: () => navigate('/admin/quizzes')
    },
    {
      title: 'Data Transaksi',
      value: stats.transactions,
      icon: Landmark,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
      description: 'Transaksi simulasi audit explorer',
      action: () => navigate('/admin/transactions')
    }
  ];

  return (
    <AdminLayout title="Dashboard Ringkasan">
      {/* Greetings Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Selamat Datang Kembali
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Halo, {getCurrentUserName() || 'Admin'}!</h2>
          <p className="text-blue-100/90 text-sm leading-relaxed">
            Di sini Anda dapat mengelola materi modul pembelajaran, membuat bank kuis evaluasi, mengelola user terdaftar, serta mengatur data transaksi simulasi blockchain.
          </p>
        </div>
        
        {/* Background shapes */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-blue-500/25 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-1/4 w-32 h-32 rounded-full bg-indigo-500/30 blur-2xl pointer-events-none" />
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Menghubungkan ke API server...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div 
                  key={index} 
                  onClick={card.action}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.title}</p>
                      <h3 className="text-3xl font-extrabold text-slate-800">{card.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="border-t border-slate-100 mt-5 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 leading-snug">{card.description}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Info */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Status Koneksi API
                </h4>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">API Server (Laravel)</span>
                    {apiStatus === 'online' ? (
                      <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        Aktif (Port 8000)
                      </span>
                    ) : apiStatus === 'offline' ? (
                      <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Terputus
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Mengecek...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Database Driver</span>
                    <span className="font-semibold text-slate-700 font-mono">SQLite / MySQL</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Frontend Client</span>
                    <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                      Aktif (Port 3000)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm col-span-2">
              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                Pintasan Cepat Tindakan Admin
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={() => navigate('/admin/modules')}
                  variant="outline"
                  className="h-auto p-4 rounded-xl border border-slate-200 flex flex-col items-start text-left gap-1 hover:border-blue-200 hover:bg-blue-50/20 hover:text-slate-800 transition"
                >
                  <span className="font-semibold text-sm">Kelola Modul</span>
                  <span className="text-xs text-slate-400">Tambah materi audit baru ke database</span>
                </Button>
                <Button 
                  onClick={() => navigate('/admin/quizzes')}
                  variant="outline"
                  className="h-auto p-4 rounded-xl border border-slate-200 flex flex-col items-start text-left gap-1 hover:border-purple-200 hover:bg-purple-50/20 hover:text-slate-800 transition"
                >
                  <span className="font-semibold text-sm">Kelola Bank Kuis</span>
                  <span className="text-xs text-slate-400">Buat pertanyaan baru untuk quiz set</span>
                </Button>
                <Button 
                  onClick={() => navigate('/admin/transactions')}
                  variant="outline"
                  className="h-auto p-4 rounded-xl border border-slate-200 flex flex-col items-start text-left gap-1 hover:border-amber-200 hover:bg-amber-50/20 hover:text-slate-800 transition"
                >
                  <span className="font-semibold text-sm">Kelola Transaksi</span>
                  <span className="text-xs text-slate-400">Simulasikan audit transaksi untuk dicurigai</span>
                </Button>
                <Button 
                  onClick={() => navigate('/admin/users')}
                  variant="outline"
                  className="h-auto p-4 rounded-xl border border-slate-200 flex flex-col items-start text-left gap-1 hover:border-green-200 hover:bg-green-50/20 hover:text-slate-800 transition"
                >
                  <span className="font-semibold text-sm">Kelola Akun Pengguna</span>
                  <span className="text-xs text-slate-400">Beri akses admin ke pengguna terdaftar</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
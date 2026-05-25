import { motion } from 'motion/react';
import { BookOpen, Brain, Search, FileText, TrendingUp, Award, LogOut } from 'lucide-react';
import type { AppScreen, UserProgress } from '../App';

interface DashboardProps {
  navigate: (screen: AppScreen) => void;
  userProgress: UserProgress;
}

export default function Dashboard({ navigate, userProgress }: DashboardProps) {
  
  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      // Jika nanti pakai Session/LocalStorage, hapus di sini
      // localStorage.removeItem('user_token');
      window.location.href = '/';
    }
  };

  const menuItems = [
    {
      icon: BookOpen,
      title: 'Pelajaran',
      description: 'Materi blockchain & audit digital',
      screen: 'learning' as AppScreen,
      color: 'from-blue-500 to-blue-600',
      progressValue: userProgress.completedModules,
      progressText: `${userProgress.completedModules}/${userProgress.totalModules || 5} Selesai`,
      progressPercent: ((userProgress.completedModules || 0) / (userProgress.totalModules || 5)) * 100
    },
    {
      icon: Brain,
      title: 'Kuis',
      description: 'Uji pemahaman Anda',
      screen: 'quiz' as AppScreen,
      color: 'from-purple-500 to-purple-600',
      progressValue: userProgress.quizScore,
      progressText: `Skor: ${userProgress.quizScore || 0}%`,
      progressPercent: userProgress.quizScore || 0
    },
    {
      icon: Search,
      title: 'Telusuri Transaksi',
      description: 'Simulasi audit blockchain',
      screen: 'explorer' as AppScreen,
      color: 'from-pink-500 to-pink-600',
      progressValue: userProgress.transactionsReviewed,
      progressText: `${userProgress.transactionsReviewed || 0} Diperiksa`,
      progressPercent: Math.min((userProgress.transactionsReviewed || 0) * 10, 100)
    },
    {
      icon: FileText,
      title: 'Laporan Audit',
      description: 'Lihat laporan hasil audit',
      screen: 'report' as AppScreen,
      color: 'from-green-500 to-green-600',
      progressValue: userProgress.transactionsFlagged,
      progressText: `${userProgress.transactionsFlagged || 0} Ditandai`,
      progressPercent: Math.min((userProgress.transactionsFlagged || 0) * 20, 100)
    },
    {
      icon: TrendingUp,
      title: 'Dashboard Ringkasan',
      description: 'Lihat progres & pencapaian',
      screen: 'summary' as AppScreen,
      color: 'from-orange-500 to-orange-600',
      progressValue: userProgress.badges ? userProgress.badges.length : 0,
      progressText: `${userProgress.badges ? userProgress.badges.length : 0} Badges`,
      progressPercent: Math.min((userProgress.badges ? userProgress.badges.length : 0) * 25, 100)
    }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50/30 relative">
      
      {/* TOMBOL LOGOUT - Pojok Kanan Atas */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-2.5 rounded-2xl shadow-sm hover:bg-red-50 transition-colors font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </motion.button>
      </div>

      <div className="w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full px-6 py-3 shadow-sm mb-6">
            <Award className="w-6 h-6 text-yellow-500 drop-shadow-sm" />
            <span className="text-gray-800 font-semibold">Level {userProgress.level || 1}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Dashboard GenTech Audit</h1>
          <p className="text-gray-500">Pilih menu untuk memulai pembelajaran</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Modul Selesai</p>
            <p className="text-2xl font-bold text-blue-600">{userProgress.completedModules || 0}/{userProgress.totalModules || 5}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Skor Kuis</p>
            <p className="text-2xl font-bold text-purple-600">{userProgress.quizScore || 0}%</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Transaksi Ditandai</p>
            <p className="text-2xl font-bold text-pink-600">{userProgress.transactionsFlagged || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Badges</p>
            <p className="text-2xl font-bold text-orange-600">{userProgress.badges ? userProgress.badges.length : 0}</p>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.screen)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all text-left group flex flex-col h-full"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-6 flex-grow">{item.description}</p>
                
                {(item.progressValue > 0 || item.progressPercent > 0) && (
                  <div className="w-full mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{item.progressText}</span>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}